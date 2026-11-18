-- APARTMAN YÖNETİMİ | Supabase PostgreSQL kurulumu
-- Önce bu dosyanın TAMAMINI Supabase > SQL Editor'de çalıştırın.
-- Sonra web uygulamasından ilk hesabı oluşturun ve README'deki ilk yönetici SQL'ini uygulayın.
-- İlk çalıştırma için tasarlanmıştır; mevcut tablolarda veri varsa yeniden çalıştırmayın.

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Apartmanımız',
  monthly_fee numeric(14,2) not null default 500 check (monthly_fee >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'manager')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);
create index if not exists idx_memberships_user on public.memberships(user_id);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  used_at timestamptz,
  unique(organization_id, email),
  check (email = lower(trim(email)))
);

create table if not exists public.apartments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  number integer not null check (number > 0),
  owner text not null default '',
  phone text not null default '',
  notes text not null default '',
  monthly_fee_override numeric(14,2) check (monthly_fee_override >= 0),
  opening_debt numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  unique(organization_id, id),
  unique(organization_id, number)
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('cash','bank')),
  opening_balance numeric(14,2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(organization_id, id)
);

create table if not exists public.dues (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  apartment_id uuid not null,
  period date not null check (extract(day from period) = 1),
  amount numeric(14,2) not null check (amount >= 0),
  description text not null default '',
  created_at timestamptz not null default now(),
  unique(organization_id, id),
  unique(organization_id, apartment_id, period),
  foreign key (organization_id, apartment_id) references public.apartments(organization_id, id) on delete restrict
);
create index if not exists idx_dues_period on public.dues(organization_id, period);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  occurred_on date not null default current_date,
  kind text not null check (kind in ('aidat','devir','gelir','gider','virman')),
  amount numeric(14,2) not null check (amount > 0),
  account_id uuid,
  from_account_id uuid,
  to_account_id uuid,
  apartment_id uuid,
  period date,
  category text not null default '',
  description text not null default '',
  receipt_path text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (organization_id, account_id) references public.accounts(organization_id, id) on delete restrict,
  foreign key (organization_id, from_account_id) references public.accounts(organization_id, id) on delete restrict,
  foreign key (organization_id, to_account_id) references public.accounts(organization_id, id) on delete restrict,
  foreign key (organization_id, apartment_id) references public.apartments(organization_id, id) on delete restrict,
  foreign key (organization_id, apartment_id, period) references public.dues(organization_id, apartment_id, period) on update restrict on delete restrict,
  check (
    (kind = 'aidat' and account_id is not null and apartment_id is not null and period is not null and from_account_id is null and to_account_id is null)
    or (kind = 'devir' and account_id is not null and apartment_id is not null and period is null and from_account_id is null and to_account_id is null)
    or (kind in ('gelir','gider') and account_id is not null and apartment_id is null and period is null and from_account_id is null and to_account_id is null)
    or (kind = 'virman' and account_id is null and apartment_id is null and period is null and from_account_id is not null and to_account_id is not null and from_account_id <> to_account_id)
  )
);
create index if not exists idx_tx_org_date on public.transactions(organization_id, occurred_on desc);
create index if not exists idx_tx_apartment on public.transactions(organization_id, apartment_id);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity text not null,
  entity_id text not null,
  operation text not null,
  old_data jsonb,
  new_data jsonb,
  changed_by uuid,
  changed_at timestamptz not null default now()
);
create index if not exists idx_audit_org_time on public.audit_logs(organization_id, changed_at desc);

-- Yardımcı fonksiyonlar: üyelik kontrolü RLS öz-yinelemesine girmesin.
create or replace function public.is_org_member(p_org uuid)
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.memberships m where m.organization_id = p_org and m.user_id = (select auth.uid())); $$;

create or replace function public.is_org_admin(p_org uuid)
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.memberships m where m.organization_id = p_org and m.user_id = (select auth.uid()) and m.role = 'admin'); $$;

-- Davet sadece önceden izin verilmiş, e-postası doğrulanmış hesapla kabul edilebilir.
create or replace function public.claim_manager_invitation()
returns integer language plpgsql security definer set search_path = ''
as $$
declare v_email text; v_count integer := 0;
begin
  if auth.uid() is null then raise exception 'Giriş gerekli'; end if;
  select lower(email) into v_email from auth.users
   where id = auth.uid() and email_confirmed_at is not null;
  if v_email is null then raise exception 'Davet için e-postanızı doğrulayın'; end if;
  insert into public.memberships(organization_id, user_id, email, role)
    select organization_id, auth.uid(), v_email, 'manager'
      from public.invites
     where email = v_email and used_at is null
  on conflict (organization_id, user_id) do nothing;
  get diagnostics v_count = row_count;
  update public.invites set used_at = now() where email = v_email and used_at is null
    and exists (select 1 from public.memberships m where m.organization_id = invites.organization_id and m.user_id = auth.uid());
  return v_count;
end $$;

create or replace function public.touch_transaction()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;
create trigger trg_tx_touch before update on public.transactions
for each row execute function public.touch_transaction();

create or replace function public.write_audit_log()
returns trigger language plpgsql security definer set search_path = '' as $$
declare old_json jsonb; new_json jsonb; org uuid; rec_id text;
begin
  if tg_op in ('UPDATE','DELETE') then old_json := to_jsonb(old); end if;
  if tg_op in ('INSERT','UPDATE') then new_json := to_jsonb(new); end if;
  org := coalesce((new_json->>'organization_id')::uuid, (old_json->>'organization_id')::uuid, (new_json->>'id')::uuid, (old_json->>'id')::uuid);
  rec_id := coalesce(new_json->>'id', old_json->>'id', 'organization');
  insert into public.audit_logs(organization_id, entity, entity_id, operation, old_data, new_data, changed_by)
  values (org, tg_table_name, rec_id, tg_op, old_json, new_json, auth.uid());
  if tg_op = 'DELETE' then return old; else return new; end if;
end $$;
create trigger audit_transactions after insert or update or delete on public.transactions for each row execute function public.write_audit_log();
create trigger audit_dues after insert or update or delete on public.dues for each row execute function public.write_audit_log();
create trigger audit_apartments after insert or update or delete on public.apartments for each row execute function public.write_audit_log();
create trigger audit_accounts after insert or update or delete on public.accounts for each row execute function public.write_audit_log();
create trigger audit_organizations after update on public.organizations for each row execute function public.write_audit_log();

-- Row Level Security: üye olmayan hiçbir kullanıcı apartman verisini okuyamaz veya değiştiremez.
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.invites enable row level security;
alter table public.apartments enable row level security;
alter table public.accounts enable row level security;
alter table public.dues enable row level security;
alter table public.transactions enable row level security;
alter table public.audit_logs enable row level security;

create policy org_read on public.organizations for select to authenticated using (public.is_org_member(id));
create policy org_edit on public.organizations for update to authenticated using (public.is_org_member(id)) with check (public.is_org_member(id));
create policy members_read on public.memberships for select to authenticated using (public.is_org_member(organization_id) or user_id = (select auth.uid()));
create policy members_insert on public.memberships for insert to authenticated with check (public.is_org_admin(organization_id));
create policy members_update on public.memberships for update to authenticated using (public.is_org_admin(organization_id)) with check (public.is_org_admin(organization_id));
create policy members_delete on public.memberships for delete to authenticated using (public.is_org_admin(organization_id) and user_id <> (select auth.uid()));
create policy invites_read on public.invites for select to authenticated using (public.is_org_admin(organization_id));
create policy invites_insert on public.invites for insert to authenticated with check (public.is_org_admin(organization_id));
create policy invites_update on public.invites for update to authenticated using (public.is_org_admin(organization_id)) with check (public.is_org_admin(organization_id));
create policy invites_delete on public.invites for delete to authenticated using (public.is_org_admin(organization_id));

create policy units_read on public.apartments for select to authenticated using (public.is_org_member(organization_id));
create policy units_insert on public.apartments for insert to authenticated with check (public.is_org_member(organization_id));
create policy units_update on public.apartments for update to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy units_delete on public.apartments for delete to authenticated using (public.is_org_member(organization_id));
create policy accounts_read on public.accounts for select to authenticated using (public.is_org_member(organization_id));
create policy accounts_insert on public.accounts for insert to authenticated with check (public.is_org_member(organization_id));
create policy accounts_update on public.accounts for update to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy dues_read on public.dues for select to authenticated using (public.is_org_member(organization_id));
create policy dues_insert on public.dues for insert to authenticated with check (public.is_org_member(organization_id));
create policy dues_update on public.dues for update to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy dues_delete on public.dues for delete to authenticated using (public.is_org_member(organization_id));
create policy tx_read on public.transactions for select to authenticated using (public.is_org_member(organization_id));
create policy tx_insert on public.transactions for insert to authenticated with check (public.is_org_member(organization_id) and created_by = (select auth.uid()));
create policy tx_update on public.transactions for update to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy tx_delete on public.transactions for delete to authenticated using (public.is_org_member(organization_id));
create policy audit_read on public.audit_logs for select to authenticated using (public.is_org_member(organization_id));

-- Dekontlar özel bucket'ta; yalnızca ilgili apartmanın yöneticileri erişebilir.
insert into storage.buckets (id, name, public, file_size_limit)
values ('apartman-dekontlari', 'apartman-dekontlari', false, 10485760)
on conflict (id) do nothing;
create policy receipt_select on storage.objects for select to authenticated
  using (bucket_id = 'apartman-dekontlari' and public.is_org_member((split_part(name,'/',1))::uuid));
create policy receipt_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'apartman-dekontlari' and public.is_org_member((split_part(name,'/',1))::uuid));
create policy receipt_delete on storage.objects for delete to authenticated
  using (bucket_id = 'apartman-dekontlari' and public.is_org_member((split_part(name,'/',1))::uuid));

revoke all on function public.claim_manager_invitation() from public, anon;
grant execute on function public.claim_manager_invitation() to authenticated;

-- Tek apartman başlangıç kurulumu; varsayılan 10 daire, 500 TL aidat.
insert into public.organizations (id, name, monthly_fee)
values ('2fbf3c51-1f9b-4c6f-96a4-20a44c442010', 'Apartmanımız', 500)
on conflict (id) do nothing;
insert into public.apartments(organization_id, number)
select '2fbf3c51-1f9b-4c6f-96a4-20a44c442010'::uuid, n
from generate_series(1,10) as n
on conflict (organization_id, number) do nothing;
insert into public.accounts (organization_id, name, kind)
select '2fbf3c51-1f9b-4c6f-96a4-20a44c442010'::uuid, n, k
from (values ('Apartman Kasası','cash'),('Banka Hesabı','bank')) v(n,k)
where not exists (select 1 from public.accounts a where a.organization_id = '2fbf3c51-1f9b-4c6f-96a4-20a44c442010'::uuid and a.name = v.n);

-- Supabase Realtime: üyelerin diğer cihazlardaki değişiklikleri izlemesi için.
do $$
declare t text;
begin
  foreach t in array array['organizations','apartments','accounts','dues','transactions','memberships','invites'] loop
    if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=t) then
      execute format('alter publication supabase_realtime add table public.%I',t);
    end if;
  end loop;
end $$;
