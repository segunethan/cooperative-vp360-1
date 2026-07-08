-- Replace member number trigger to use cooperative name prefix
-- Format: first 3 letters of cooperative name (uppercase) + 6-digit serial
-- e.g. LAG000001, LAG000002 for "Lagos Teachers Cooperative"

create or replace function assign_member_number()
returns trigger language plpgsql as $$
declare
  v_prefix text;
  v_count  int;
begin
  -- Get first 3 letters of the cooperative name, uppercase, letters only
  select upper(regexp_replace(substring(name, 1, 10), '[^A-Za-z]', '', 'g'))
  into v_prefix
  from tenants
  where id = NEW.tenant_id;

  -- Take exactly 3 characters (pad with X if name is shorter)
  v_prefix := rpad(substring(v_prefix, 1, 3), 3, 'X');

  -- Lock per-tenant to avoid race conditions
  perform pg_advisory_xact_lock(hashtext(NEW.tenant_id::text || '-member'));

  -- Count existing members for this tenant
  select count(*) + 1 into v_count
  from members
  where tenant_id = NEW.tenant_id;

  NEW.member_number := v_prefix || lpad(v_count::text, 6, '0');

  return NEW;
end;
$$;

-- Trigger already exists from initial migration — replace function is enough.
-- But in case it was dropped, recreate it safely:
drop trigger if exists assign_member_number_trigger on members;

create trigger assign_member_number_trigger
  before insert on members
  for each row
  when (NEW.member_number is null or NEW.member_number = '')
  execute function assign_member_number();
