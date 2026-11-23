# Bio Academy 🧬

Biologiya ta'lim platformasi: video darslar, jonli darslar, har dars ostida AI yordamchi va mavzu testlari.

**O'rnatish bo'yicha qadamma-qadam qo'llanma: [docs/ORNATISH.md](docs/ORNATISH.md)**

## Imkoniyatlar

- 👤 O'quvchi ro'yxatdan o'tishi, shaxsiy kabinet
- 📚 Kurs → mavzu → dars, video pleyer (Bunny Stream yoki YouTube)
- 🤖 Har dars ostida AI yordamchi (Claude) — dars konspekti asosida o'zbek tilida javob beradi, kunlik limit bilan
- 📝 Mavzu testlari: vaqt chegarasi, server tomonda avtomatik baholash, izohlar, natijalar tarixi
- 🔴 Jonli darslar jadvali (Zoom/Meet havolasi) va o'tgan darslar yozuvlari arxivi
- 🛠 Admin panel: kurs, mavzu, dars, test (ko'p savolni birdaniga import qilish), jonli darslarni boshqarish
- 📱 Telefonga moslashgan o'zbekcha interfeys

## Tuzilishi

```
supabase/schema.sql      — baza jadvallari, xavfsizlik qoidalari (RLS), test funksiyalari
src/app/                 — sahifalar (dashboard, courses, lessons, tests, results, live, admin)
src/app/api/chat/        — AI yordamchi (Claude API, streaming)
src/app/admin/actions.ts — admin panel amallari
docs/ORNATISH.md         — o'rnatish qo'llanmasi
```
