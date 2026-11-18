-- ÖNCE web uygulamasında kendi e-postanla HESAP OLUŞTUR ve doğrula.
-- Sonra aşağıdaki EMAIL_ADRESINIZ bölümünü gerçek e-postanla değiştirip
-- Supabase > SQL Editor'de çalıştır.
-- Bu işlem ilk (ana) yöneticiyi yetkilendirir.

insert into public.memberships (organization_id, user_id, email, role)
select
  '2fbf3c51-1f9b-4c6f-96a4-20a44c442010'::uuid,
  u.id,
  lower(u.email),
  'admin'
from auth.users u
where lower(u.email) = lower('EMAIL_ADRESINIZ')
  and u.email_confirmed_at is not null
on conflict (organization_id, user_id) do nothing;

-- Sonuç 0 rows ise: e-posta yanlış girilmiş veya henüz doğrulanmamıştır.
select m.email, m.role from public.memberships m
where m.organization_id='2fbf3c51-1f9b-4c6f-96a4-20a44c442010';
