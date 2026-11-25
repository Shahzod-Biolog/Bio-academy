-- =====================================================================
-- YANGILANISH: o'quvchi nechta savol yechishini o'zi tanlaydi.
-- Supabase -> SQL Editor -> New query: shu faylning butun matnini joylab, Run bosing.
-- (Bir marta ishga tushirish kifoya. Qayta ishga tushirilsa ham zarar qilmaydi.)
-- =====================================================================

alter table public.test_attempts add column if not exists question_ids uuid[];
alter table public.test_attempts add column if not exists time_limit_minutes int;

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
