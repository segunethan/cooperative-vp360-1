-- ============================================================
-- Jollify Platform — Initial Schema v1
-- Non-negotiables enforced:
--   1. tenant_id on every table + Postgres RLS
--   2. Append-only double-entry ledger
--   3. Idempotency keys (UNIQUE reference) on payment writes
--   4. Append-only audit log (trigger blocks UPDATE/DELETE)
-- Money stored as bigint kobo (never floats)
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
create type tenant_status as enum (
  'PENDING_EMAIL_VERIFICATION',
  'EMAIL_VERIFIED',
  'KYB_SUBMITTED',
  'ACTIVE',
  'SUSPENDED'
);

create type member_invite_status as enum (
  'INVITED',
  'ACTIVE',
  'SUSPENDED',
  'EXITED'
);

create type loan_status as enum (
  'PENDING',
  'APPROVED',
  'ACTIVE',
  'REPAID',
  'DEFAULTED',
  'REJECTED'
);

create type contribution_status as enum (
  'PENDING',
  'COMPLETED',
  'FAILED'
);

create type dividend_status as enum (
  'DRAFT',
  'DECLARED',
  'PROCESSING',
  'COMPLETED'
);

-- ============================================================
-- TENANTS (cooperative organizations — the B2B layer)
-- ============================================================
create table tenants (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  slug                text unique not null,
  email               text unique not null,
  phone               text,
  address             text,
  rc_number           text,               -- CAC registration number
  logo_url            text,
  status              tenant_status not null default 'PENDING_EMAIL_VERIFICATION',
  billing_plan        text not null default 'trial',
  trial_ends_at       timestamptz default (now() + interval '30 days'),
  email_verified_at   timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- TENANT USERS (admins / staff linked to a tenant)
-- ============================================================
create table tenant_users (
  id          uuid primary key default uuid_generate_v4(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'admin',    -- admin, staff, viewer
  created_at  timestamptz not null default now(),
  unique(tenant_id, user_id)
);

-- RLS helper: resolves caller's tenant_id (stable — cached per tx)
create or replace function get_tenant_id()
returns uuid language sql stable security definer as $$
  select tenant_id from public.tenant_users
  where user_id = auth.uid()
  limit 1;
$$;

-- Signup helper: atomically creates tenant + links admin user
-- Runs as SECURITY DEFINER to bypass RLS during initial setup
create or replace function create_tenant(
  p_name  text,
  p_email text,
  p_slug  text,
  p_phone text default null
)
returns uuid language plpgsql security definer as $$
declare
  v_tenant_id uuid;
begin
  insert into tenants (name, email, slug, phone)
  values (p_name, p_email, p_slug, p_phone)
  returning id into v_tenant_id;

  insert into tenant_users (tenant_id, user_id, role)
  values (v_tenant_id, auth.uid(), 'admin');

  return v_tenant_id;
end;
$$;

-- ============================================================
-- MEMBERS (cooperative members — the B2C layer)
-- ============================================================
create table members (
  id              uuid primary key default uuid_generate_v4(),
  tenant_id       uuid not null references tenants(id) on delete cascade,
  member_number   text not null,          -- MEM-001, auto-assigned
  full_name       text not null,
  email           text,
  phone           text,
  gender          text,
  date_of_birth   date,
  address         text,
  occupation      text,
  status          member_invite_status not null default 'INVITED',
  kyc_verified    boolean not null default false,
  kyc_verified_at timestamptz,
  invite_token    text unique,
  auth_user_id    uuid references auth.users(id),
  joined_at       timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(tenant_id, member_number),
  unique(tenant_id, email)
);

-- Auto-generate member_number on insert
create or replace function assign_member_number()
returns trigger language plpgsql as $$
declare
  v_count int;
begin
  select count(*) + 1 into v_count from members where tenant_id = NEW.tenant_id;
  NEW.member_number := 'MEM-' || lpad(v_count::text, 3, '0');
  return NEW;
end;
$$;

create trigger assign_member_number_trigger
  before insert on members
  for each row
  when (NEW.member_number is null or NEW.member_number = '')
  execute function assign_member_number();

-- ============================================================
-- CONTRIBUTIONS (savings / deposits)
-- ============================================================
create table contributions (
  id                  uuid primary key default uuid_generate_v4(),
  tenant_id           uuid not null references tenants(id) on delete cascade,
  member_id           uuid not null references members(id) on delete restrict,
  amount_kobo         bigint not null check (amount_kobo > 0),
  channel             text not null default 'bank_transfer',
  status              contribution_status not null default 'PENDING',
  reference           text unique not null,       -- idempotency key
  paystack_reference  text,
  period_month        int check (period_month between 1 and 12),
  period_year         int,
  notes               text,
  recorded_by         uuid references auth.users(id),
  completed_at        timestamptz,
  created_at          timestamptz not null default now()
);

-- ============================================================
-- SHARES (share capital transactions)
-- ============================================================
create table shares (
  id                    uuid primary key default uuid_generate_v4(),
  tenant_id             uuid not null references tenants(id) on delete cascade,
  member_id             uuid not null references members(id) on delete restrict,
  quantity              int not null check (quantity > 0),
  price_per_share_kobo  bigint not null check (price_per_share_kobo > 0),
  total_value_kobo      bigint not null check (total_value_kobo > 0),
  transaction_date      date not null default current_date,
  reference             text unique,
  notes                 text,
  created_at            timestamptz not null default now()
);

-- ============================================================
-- LOANS
-- ============================================================
create table loans (
  id                  uuid primary key default uuid_generate_v4(),
  tenant_id           uuid not null references tenants(id) on delete cascade,
  member_id           uuid not null references members(id) on delete restrict,
  loan_number         text not null,          -- LA-2025-0001
  principal_kobo      bigint not null check (principal_kobo > 0),
  interest_rate_bps   int not null,           -- basis points: 1500 = 15%
  tenure_months       int not null check (tenure_months > 0),
  purpose             text,
  status              loan_status not null default 'PENDING',
  approved_by         uuid references auth.users(id),
  approved_at         timestamptz,
  disbursed_at        timestamptz,
  due_date            date,
  paystack_reference  text,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique(tenant_id, loan_number)
);

-- ============================================================
-- LOAN REPAYMENTS (append-only)
-- ============================================================
create table loan_repayments (
  id                      uuid primary key default uuid_generate_v4(),
  tenant_id               uuid not null references tenants(id) on delete cascade,
  loan_id                 uuid not null references loans(id) on delete restrict,
  amount_kobo             bigint not null check (amount_kobo > 0),
  principal_portion_kobo  bigint not null default 0 check (principal_portion_kobo >= 0),
  interest_portion_kobo   bigint not null default 0 check (interest_portion_kobo >= 0),
  channel                 text not null default 'bank_transfer',
  reference               text unique not null,   -- idempotency
  paystack_reference      text,
  paid_at                 timestamptz not null default now(),
  created_at              timestamptz not null default now()
);

-- ============================================================
-- DIVIDENDS
-- ============================================================
create table dividends (
  id                  uuid primary key default uuid_generate_v4(),
  tenant_id           uuid not null references tenants(id) on delete cascade,
  period              text not null,              -- "Q1 2025"
  total_amount_kobo   bigint not null check (total_amount_kobo > 0),
  rate_bps            int not null,
  eligible_members    int not null default 0,
  calculation_method  text not null default 'per_share',
  status              dividend_status not null default 'DRAFT',
  declared_by         uuid references auth.users(id),
  declared_at         timestamptz,
  payout_date         date,
  created_at          timestamptz not null default now(),
  unique(tenant_id, period)
);

-- ============================================================
-- DIVIDEND ENTITLEMENTS (per-member allocations)
-- ============================================================
create table dividend_entitlements (
  id                  uuid primary key default uuid_generate_v4(),
  tenant_id           uuid not null references tenants(id) on delete cascade,
  dividend_id         uuid not null references dividends(id) on delete cascade,
  member_id           uuid not null references members(id) on delete restrict,
  share_balance_kobo  bigint not null,
  entitlement_kobo    bigint not null check (entitlement_kobo > 0),
  payment_method      text,
  paid_at             timestamptz,
  paystack_reference  text,
  created_at          timestamptz not null default now(),
  unique(dividend_id, member_id)
);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
create table announcements (
  id            uuid primary key default uuid_generate_v4(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  title         text not null,
  body          text not null,
  channels      text[] not null default '{}',     -- email, sms, in_app
  audience      text not null default 'all',      -- all, active, pending
  published_at  timestamptz,
  created_by    uuid references auth.users(id),
  created_at    timestamptz not null default now()
);

-- ============================================================
-- DOUBLE-ENTRY LEDGER (append-only)
-- journal_entries: one row per financial event
-- journal_lines:   two+ rows per entry (debits + credits must balance)
-- ============================================================
create table journal_entries (
  id            uuid primary key default uuid_generate_v4(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  description   text not null,
  reference     text unique not null,     -- idempotency key
  source_type   text not null,            -- contribution | loan_disbursement | loan_repayment | dividend
  source_id     uuid,
  created_at    timestamptz not null default now()
);

create table journal_lines (
  id            uuid primary key default uuid_generate_v4(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  entry_id      uuid not null references journal_entries(id) on delete cascade,
  account       text not null,            -- member_contributions | loans_receivable | member_equity | ...
  debit_kobo    bigint not null default 0 check (debit_kobo >= 0),
  credit_kobo   bigint not null default 0 check (credit_kobo >= 0),
  member_id     uuid references members(id),
  created_at    timestamptz not null default now(),
  check (debit_kobo > 0 or credit_kobo > 0),
  check (not (debit_kobo > 0 and credit_kobo > 0))
);

-- Prevent mutation of journal lines (append-only enforcement)
create or replace function prevent_journal_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'journal_lines is append-only — % not allowed', TG_OP;
end;
$$;

create trigger journal_lines_immutable_update
  before update on journal_lines
  for each row execute function prevent_journal_mutation();

create trigger journal_lines_immutable_delete
  before delete on journal_lines
  for each row execute function prevent_journal_mutation();

-- ============================================================
-- AUDIT LOG (append-only — triggers block UPDATE/DELETE)
-- ============================================================
create table audit_log (
  id            uuid primary key default uuid_generate_v4(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  actor_id      uuid references auth.users(id),
  action        text not null,     -- member.approved | loan.disbursed | dividend.declared | ...
  entity_type   text not null,
  entity_id     uuid,
  before_state  jsonb,
  after_state   jsonb,
  ip_address    text,
  created_at    timestamptz not null default now()
);

create or replace function prevent_audit_log_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'audit_log is append-only — % not allowed', TG_OP;
end;
$$;

create trigger audit_log_immutable_update
  before update on audit_log
  for each row execute function prevent_audit_log_mutation();

create trigger audit_log_immutable_delete
  before delete on audit_log
  for each row execute function prevent_audit_log_mutation();

-- ============================================================
-- INDEXES (performance)
-- ============================================================
create index idx_tenant_users_user_id on tenant_users(user_id);
create index idx_tenant_users_tenant_id on tenant_users(tenant_id);
create index idx_members_tenant_status on members(tenant_id, status);
create index idx_members_tenant_email on members(tenant_id, email);
create index idx_contributions_member on contributions(tenant_id, member_id);
create index idx_contributions_status on contributions(tenant_id, status);
create index idx_contributions_reference on contributions(reference);
create index idx_loans_member on loans(tenant_id, member_id);
create index idx_loans_status on loans(tenant_id, status);
create index idx_loan_repayments_loan on loan_repayments(loan_id);
create index idx_dividend_entitlements_dividend on dividend_entitlements(dividend_id);
create index idx_dividend_entitlements_member on dividend_entitlements(tenant_id, member_id);
create index idx_journal_entries_source on journal_entries(tenant_id, source_type, source_id);
create index idx_journal_lines_entry on journal_lines(entry_id);
create index idx_audit_log_tenant_time on audit_log(tenant_id, created_at desc);
create index idx_audit_log_entity on audit_log(tenant_id, entity_type, entity_id);

-- ============================================================
-- ROW-LEVEL SECURITY
-- Enable RLS on all tables — no exceptions
-- ============================================================
alter table tenants enable row level security;
alter table tenant_users enable row level security;
alter table members enable row level security;
alter table contributions enable row level security;
alter table shares enable row level security;
alter table loans enable row level security;
alter table loan_repayments enable row level security;
alter table dividends enable row level security;
alter table dividend_entitlements enable row level security;
alter table announcements enable row level security;
alter table journal_entries enable row level security;
alter table journal_lines enable row level security;
alter table audit_log enable row level security;

-- tenant_users: a user can only see their own row
create policy "tenant_users_own" on tenant_users
  for all using (user_id = auth.uid());

-- tenants: user can see + update their own tenant
create policy "tenants_select_own" on tenants
  for select using (id = get_tenant_id());

create policy "tenants_update_own" on tenants
  for update using (id = get_tenant_id());

-- members
create policy "members_isolated" on members
  for all using (tenant_id = get_tenant_id());

-- contributions
create policy "contributions_isolated" on contributions
  for all using (tenant_id = get_tenant_id());

-- shares
create policy "shares_isolated" on shares
  for all using (tenant_id = get_tenant_id());

-- loans
create policy "loans_isolated" on loans
  for all using (tenant_id = get_tenant_id());

-- loan_repayments
create policy "loan_repayments_isolated" on loan_repayments
  for all using (tenant_id = get_tenant_id());

-- dividends
create policy "dividends_isolated" on dividends
  for all using (tenant_id = get_tenant_id());

-- dividend_entitlements
create policy "dividend_entitlements_isolated" on dividend_entitlements
  for all using (tenant_id = get_tenant_id());

-- announcements
create policy "announcements_isolated" on announcements
  for all using (tenant_id = get_tenant_id());

-- journal_entries
create policy "journal_entries_isolated" on journal_entries
  for all using (tenant_id = get_tenant_id());

-- journal_lines
create policy "journal_lines_isolated" on journal_lines
  for all using (tenant_id = get_tenant_id());

-- audit_log: read-only via RLS; writes go through service role / edge functions
create policy "audit_log_select" on audit_log
  for select using (tenant_id = get_tenant_id());

create policy "audit_log_insert" on audit_log
  for insert with check (tenant_id = get_tenant_id());
