-- ============================================================
-- Clinical Logbook v2
-- جدول السجلات + عزل بيانات كل مستخدم + سياسات RLS آمنة
-- نفّذ هذا الملف كاملًا من: Supabase Dashboard → SQL Editor
-- ============================================================
--
-- ملخص الحماية:
--   • لا يوجد أي وصول مجهول (anon) إلى الجدول.
--   • كل مستخدم مسجّل يرى ويضيف ويعدّل ويحذف سجلاته فقط.
--   • الملكية تعتمد على auth.uid() المرتبط بجلسة Supabase Auth.
--   • جميع السياسات القديمة على هذا الجدول ستُحذف قبل إنشاء السياسات الآمنة.
--
-- ⚠️ ملاحظة: المفتاح العام (anon/publishable) يمكن استخدامه في المتصفح،
--    أما service_role أو sb_secret_ فلا يوضع أبدًا في ملفات الواجهة.
-- ============================================================

begin;

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1) الجدول
-- ------------------------------------------------------------
create table if not exists public.clinical_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  patient_code text not null,
  diagnosis text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clinical_cases_patient_code_length
    check (char_length(btrim(patient_code)) between 1 and 40),
  constraint clinical_cases_diagnosis_length
    check (char_length(btrim(diagnosis)) between 1 and 180),
  constraint clinical_cases_notes_length
    check (notes is null or char_length(notes) <= 1000)
);

-- ترقية آمنة إذا كان الجدول موجودًا من الإصدار السابق.
alter table public.clinical_cases
  add column if not exists user_id uuid default auth.uid()
  references auth.users(id) on delete cascade;

alter table public.clinical_cases
  add column if not exists updated_at timestamptz not null default now();

-- إضافة قيود الطول إذا كان الجدول موجودًا بدونها.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'clinical_cases_patient_code_length'
      and conrelid = 'public.clinical_cases'::regclass
  ) then
    alter table public.clinical_cases
      add constraint clinical_cases_patient_code_length
      check (char_length(btrim(patient_code)) between 1 and 40);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'clinical_cases_diagnosis_length'
      and conrelid = 'public.clinical_cases'::regclass
  ) then
    alter table public.clinical_cases
      add constraint clinical_cases_diagnosis_length
      check (char_length(btrim(diagnosis)) between 1 and 180);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'clinical_cases_notes_length'
      and conrelid = 'public.clinical_cases'::regclass
  ) then
    alter table public.clinical_cases
      add constraint clinical_cases_notes_length
      check (notes is null or char_length(notes) <= 1000);
  end if;
end
$$;

-- يسرّع جلب سجلات المستخدم الحالي مرتبة حسب الأحدث.
create index if not exists clinical_cases_user_created_idx
  on public.clinical_cases (user_id, created_at desc);

-- ------------------------------------------------------------
-- 2) تحديث updated_at تلقائيًا عند التعديل
-- ------------------------------------------------------------
create or replace function public.set_clinical_cases_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

drop trigger if exists clinical_cases_set_updated_at
  on public.clinical_cases;

create trigger clinical_cases_set_updated_at
  before update on public.clinical_cases
  for each row
  execute function public.set_clinical_cases_updated_at();

-- ------------------------------------------------------------
-- 3) الصلاحيات: منع anon تمامًا، والسماح للمستخدم المسجل فقط
-- ------------------------------------------------------------
alter table public.clinical_cases enable row level security;

revoke all on table public.clinical_cases from anon;
revoke all on table public.clinical_cases from public;
grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.clinical_cases to authenticated;

-- حذف كل السياسات السابقة على هذا الجدول (بما فيها سياسات القراءة العامة القديمة).
do $$
declare
  policy_row record;
begin
  for policy_row in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'clinical_cases'
  loop
    execute format(
      'drop policy if exists %I on public.clinical_cases',
      policy_row.policyname
    );
  end loop;
end
$$;

-- ------------------------------------------------------------
-- 4) سياسات RLS — كل مستخدم يصل إلى سجلاته فقط
-- ------------------------------------------------------------
create policy clinical_cases_select_own
  on public.clinical_cases
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy clinical_cases_insert_own
  on public.clinical_cases
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy clinical_cases_update_own
  on public.clinical_cases
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy clinical_cases_delete_own
  on public.clinical_cases
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

commit;

-- ============================================================
-- ترحيل السجلات القديمة (اختياري)
-- ============================================================
-- السجلات التي أُنشئت قبل تفعيل تسجيل الدخول ستحتوي على user_id = null
-- ولن يستطيع أي مستخدم رؤيتها بعد الآن.
--
-- 1) اعرض السجلات القديمة من SQL Editor:
-- select id, patient_code, diagnosis, notes, created_at
-- from public.clinical_cases
-- where user_id is null
-- order by created_at desc;
--
-- 2) بعد إنشاء حسابك، خصّص السجلات القديمة لبريدك:
-- update public.clinical_cases
-- set user_id = (select id from auth.users where email = 'YOUR_EMAIL@example.com')
-- where user_id is null;
--
-- 3) بعد التأكد من عدم وجود سجلات بلا مالك، يمكنك فرض NOT NULL:
-- alter table public.clinical_cases
--   alter column user_id set not null;

-- ============================================================
-- فحص سريع بعد التنفيذ (اختياري)
-- ============================================================
-- select schemaname, tablename, policyname, roles, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public' and tablename = 'clinical_cases'
-- order by policyname;
