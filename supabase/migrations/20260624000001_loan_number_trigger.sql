-- ============================================================
-- Loan number auto-generation trigger
-- Replaces the race-prone application-side count + insert.
-- Format: LA-{YEAR}-{ZEROPADDED_SEQ}  e.g. LA-2026-0001
-- Sequence is per-tenant, resets each calendar year.
-- Uses an advisory lock on (tenant_id hash) to prevent
-- concurrent transactions from grabbing the same sequence number.
-- ============================================================

create or replace function assign_loan_number()
returns trigger language plpgsql as $$
declare
  v_year  text;
  v_count int;
begin
  v_year := to_char(now(), 'YYYY');

  -- Advisory lock scoped to this tenant so concurrent inserts
  -- from the same cooperative queue rather than collide.
  perform pg_advisory_xact_lock(hashtext(NEW.tenant_id::text));

  select count(*) + 1
    into v_count
    from loans
   where tenant_id = NEW.tenant_id
     and to_char(created_at, 'YYYY') = v_year;

  NEW.loan_number := 'LA-' || v_year || '-' || lpad(v_count::text, 4, '0');
  return NEW;
end;
$$;

create trigger assign_loan_number_trigger
  before insert on loans
  for each row
  when (NEW.loan_number is null or NEW.loan_number = '')
  execute function assign_loan_number();
