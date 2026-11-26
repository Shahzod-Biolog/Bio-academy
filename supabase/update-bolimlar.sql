-- =====================================================================
-- YANGILANISH: kurslar 2 bo'limga ajratiladi — "Nazariy darslar" va "Masala darslari".
-- Supabase -> SQL Editor -> New query: shu faylning butun matnini joylab, Run bosing.
-- (Qayta ishga tushirilsa ham zarar qilmaydi: kurslar ikki marta yaratilmaydi.)
-- =====================================================================

-- 1) Kurslarga "bo'lim" ustuni. Hozirgi barcha kurslar (DNK, ATF ...) -> Masala darslari.
alter table public.courses add column if not exists section text not null default 'masala';
alter table public.courses drop constraint if exists courses_section_check;
alter table public.courses add constraint courses_section_check check (section in ('nazariy', 'masala'));

-- 2) Nazariy darslar: 6 ta kurs
insert into public.courses (title, description, position, section)
select v.title, '', v.pos, 'nazariy'
from (values
  ('6-sinf Botanika', 1),
  ('7-sinf Zoologiya', 2),
  ('8-sinf Odam va uning salomatligi', 3),
  ('9-sinf Sitologiya asoslari', 4),
  ('10-sinf Umumiy biologiya', 5),
  ('11-sinf Biologiya', 6)
) as v(title, pos)
where not exists (select 1 from public.courses c where c.title = v.title);

-- 3) 9-sinf Sitologiya asoslari ichida "Tirik organizmlarning kimyoviy tarkibi" mavzusi
insert into public.topics (course_id, title, position)
select c.id, 'Tirik organizmlarning kimyoviy tarkibi', 1
from public.courses c
where c.title = '9-sinf Sitologiya asoslari'
  and not exists (
    select 1 from public.topics t
    where t.course_id = c.id and t.title = 'Tirik organizmlarning kimyoviy tarkibi'
  );

-- 4) Saytda hozir faqat bitta test bo'lsa, uni shu yangi mavzuga ko'chiramiz.
--    (Bir nechta test bo'lsa, admin paneldagi test sahifasidan "Qaysi kurs va mavzuda turadi"
--    ro'yxati orqali kerakligini ko'chiring.)
update public.tests
set topic_id = (
  select t.id from public.topics t
  join public.courses c on c.id = t.course_id
  where c.title = '9-sinf Sitologiya asoslari' and t.title = 'Tirik organizmlarning kimyoviy tarkibi'
  limit 1
)
where (select count(*) from public.tests) = 1;

-- Natija: testlar qaysi kurs va mavzuda turgani
select te.title as test, c.title as kurs, t.title as mavzu
from public.tests te
join public.topics t on t.id = te.topic_id
join public.courses c on c.id = t.course_id;
