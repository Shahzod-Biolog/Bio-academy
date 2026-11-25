-- =====================================================================
-- Bio Academy — ma'lumotlar bazasi sxemasi
-- Supabase -> SQL Editor -> New query -> shu faylni to'liq joylab "Run" bosing.
-- Faylni qayta ishga tushirish xavfsiz (mavjud jadvallar o'chirilmaydi).
-- =====================================================================

-- ---------- Foydalanuvchi profillari ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

-- Yangi foydalanuvchi ro'yxatdan o'tganda avtomatik profil yaratiladi
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- Kurslar, mavzular, darslar ----------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  description text not null default '',
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics (id) on delete cascade,
  title text not null,
  description text not null default '',
  -- 'bunny' (Bunny Stream video ID) yoki 'youtube' (YouTube havola/ID)
  video_provider text not null default 'bunny' check (video_provider in ('bunny', 'youtube', 'none')),
  video_ref text not null default '',
  -- Dars konspekti: AI yordamchi shu matn asosida javob beradi
  notes text not null default '',
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Testlar ----------
create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics (id) on delete cascade,
  title text not null,
  time_limit_minutes int not null default 20 check (time_limit_minutes > 0),
  created_at timestamptz not null default now()
);

-- Savol matni va variantlar (o'quvchilar ko'ra oladi)
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests (id) on delete cascade,
  text text not null,
  options jsonb not null, -- ["A variant", "B variant", ...]
  position int not null default 0
);

-- To'g'ri javoblar alohida jadvalda: o'quvchilar ularni o'qiy olmaydi
create table if not exists public.question_keys (
  question_id uuid primary key references public.questions (id) on delete cascade,
  correct_index int not null,
  explanation text not null default ''
);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  test_id uuid not null references public.tests (id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  answers jsonb,
  score int,
  total int
);
create index if not exists test_attempts_user_idx on public.test_attempts (user_id, started_at desc);
-- O'quvchi tanlagan savollar (null = testdagi barcha savollar) va shu urinish uchun vaqt
alter table public.test_attempts add column if not exists question_ids uuid[];
alter table public.test_attempts add column if not exists time_limit_minutes int;

-- ---------- Jonli darslar ----------
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  meeting_url text not null default '',    -- Zoom / Google Meet havolasi
  recording_ref text not null default '',  -- dars yozuvi (YouTube havola yoki Bunny ID)
  recording_provider text not null default 'youtube' check (recording_provider in ('bunny', 'youtube')),
  created_at timestamptz not null default now()
);

-- ---------- AI savollar hisobi (kunlik limit uchun) ----------
create table if not exists public.ai_messages (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid references public.lessons (id) on delete set null,
  question text not null,
  created_at timestamptz not null default now()
);
create index if not exists ai_messages_user_idx on public.ai_messages (user_id, created_at desc);

-- =====================================================================
-- Xavfsizlik qoidalari (Row Level Security)
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.topics enable row level security;
alter table public.lessons enable row level security;
alter table public.tests enable row level security;
alter table public.questions enable row level security;
alter table public.question_keys enable row level security;
alter table public.test_attempts enable row level security;
alter table public.live_sessions enable row level security;
alter table public.ai_messages enable row level security;

-- Profillar: o'zini ko'radi va ismini o'zgartira oladi; admin hammasini ko'radi
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
-- O'quvchi faqat ismini o'zgartira oladi (role ustunini emas)
revoke update on public.profiles from authenticated, anon;
grant update (full_name) on public.profiles to authenticated;

-- Kontent: tizimga kirgan har kim o'qiydi, faqat admin yozadi
do $$
declare t text;
begin
  foreach t in array array['courses', 'topics', 'lessons', 'tests', 'questions', 'live_sessions'] loop
    execute format('drop policy if exists "%1$s read" on public.%1$I', t);
    execute format('create policy "%1$s read" on public.%1$I for select to authenticated using (true)', t);
    execute format('drop policy if exists "%1$s admin write" on public.%1$I', t);
    execute format('create policy "%1$s admin write" on public.%1$I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

drop policy if exists "question_keys admin" on public.question_keys;
create policy "question_keys admin" on public.question_keys
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Test urinishlari: faqat o'zinikini o'qiydi; yozish faqat quyidagi funksiyalar orqali
drop policy if exists "attempts read own" on public.test_attempts;
create policy "attempts read own" on public.test_attempts
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "ai_messages read own" on public.ai_messages;
create policy "ai_messages read own" on public.ai_messages
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "ai_messages insert own" on public.ai_messages;
create policy "ai_messages insert own" on public.ai_messages
  for insert with check (user_id = auth.uid());

-- =====================================================================
-- Test funksiyalari: vaqtni va baholashni server nazorat qiladi
-- =====================================================================

-- Testni boshlash: yangi urinish yaratadi (yoki tugallanmagan urinishni qaytaradi).
-- p_count: o'quvchi nechta savol yechmoqchi (null yoki 0 = barchasi).
-- Savollar testdagi savollar ichidan tasodifiy tanlanadi, vaqt esa savollar soniga
-- mos ravishda kamaytiriladi (masalan 100 savol 60 daqiqa bo'lsa, 30 savolga 18 daqiqa).
drop function if exists public.start_test(uuid);
create or replace function public.start_test(p_test_id uuid, p_count int default null)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_attempt uuid;
  v_limit int;
  v_pool int;
  v_ids uuid[];
  v_minutes int;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  select time_limit_minutes into v_limit from tests where id = p_test_id;
  if v_limit is null then
    raise exception 'test not found';
  end if;

  select a.id into v_attempt from test_attempts a
  where a.user_id = auth.uid() and a.test_id = p_test_id and a.finished_at is null
    and a.started_at + make_interval(mins => coalesce(a.time_limit_minutes, v_limit)) > now()
  order by a.started_at desc limit 1;
  if v_attempt is not null then
    return v_attempt;
  end if;

  select count(*) into v_pool from questions where test_id = p_test_id;

  if p_count is null or p_count <= 0 or p_count >= v_pool then
    v_ids := null;
    v_minutes := v_limit;
  else
    select array_agg(id order by position) into v_ids
    from (select id, position from questions where test_id = p_test_id order by random() limit p_count) s;
    v_minutes := greatest(1, ceil(v_limit::numeric * p_count / v_pool)::int);
  end if;

  insert into test_attempts (user_id, test_id, question_ids, time_limit_minutes)
  values (auth.uid(), p_test_id, v_ids, v_minutes)
  returning id into v_attempt;
  return v_attempt;
end;
$$;

-- Javoblarni topshirish va avtomatik baholash.
-- p_answers: {"<question_id>": <tanlangan variant indeksi>, ...}
create or replace function public.submit_test(p_attempt_id uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_attempt test_attempts%rowtype;
  v_limit int;
  v_score int := 0;
  v_total int := 0;
  v_late boolean;
  r record;
begin
  select * into v_attempt from test_attempts where id = p_attempt_id for update;
  if v_attempt.id is null or v_attempt.user_id <> auth.uid() then
    raise exception 'attempt not found';
  end if;
  if v_attempt.finished_at is not null then
    raise exception 'attempt already submitted';
  end if;

  select coalesce(v_attempt.time_limit_minutes, time_limit_minutes) into v_limit
  from tests where id = v_attempt.test_id;
  -- 1 daqiqa internet kechikishi uchun zaxira
  v_late := now() > v_attempt.started_at + make_interval(mins => v_limit + 1);

  for r in
    select q.id, k.correct_index from questions q
    join question_keys k on k.question_id = q.id
    where q.test_id = v_attempt.test_id
      and (v_attempt.question_ids is null or q.id = any (v_attempt.question_ids))
  loop
    v_total := v_total + 1;
    if not v_late and (p_answers ->> r.id::text) is not null
       and (p_answers ->> r.id::text)::int = r.correct_index then
      v_score := v_score + 1;
    end if;
  end loop;

  update test_attempts
  set finished_at = now(), answers = p_answers, score = v_score, total = v_total
  where id = p_attempt_id;

  return jsonb_build_object('score', v_score, 'total', v_total, 'late', v_late);
end;
$$;

-- Topshirilgan urinish uchun to'g'ri javoblar va izohlar
create or replace function public.attempt_review(p_attempt_id uuid)
returns table (question_id uuid, correct_index int, explanation text)
language sql
stable
security definer set search_path = public
as $$
  select k.question_id, k.correct_index, k.explanation
  from test_attempts a
  join questions q on q.test_id = a.test_id
  join question_keys k on k.question_id = q.id
  where a.id = p_attempt_id
    and a.finished_at is not null
    and (a.question_ids is null or q.id = any (a.question_ids))
    and (a.user_id = auth.uid() or public.is_admin());
$$;

revoke all on function public.start_test(uuid, int) from public, anon;
revoke all on function public.submit_test(uuid, jsonb) from public, anon;
revoke all on function public.attempt_review(uuid) from public, anon;
grant execute on function public.start_test(uuid, int) to authenticated;
grant execute on function public.submit_test(uuid, jsonb) to authenticated;
grant execute on function public.attempt_review(uuid) to authenticated;

-- =====================================================================
-- O'zingizni admin qilish (ro'yxatdan o'tgandan keyin, emailni almashtirib ishga tushiring):
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'sizning@email.uz');
-- =====================================================================
