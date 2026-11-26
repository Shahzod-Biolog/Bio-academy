# Bio Academy — qadamma-qadam o'rnatish qo'llanmasi

Bu qo'llanma dasturlashni bilmaydigan odam uchun yozilgan. Hammasi brauzer orqali qilinadi, kompyuteringizga hech narsa o'rnatish shart emas. Taxminan **1–1,5 soat** vaqt ketadi.

Sizga 4 ta bepul (yoki arzon) hisob kerak bo'ladi:

| Xizmat | Nima uchun | Narxi |
|---|---|---|
| **Supabase** | O'quvchilar ro'yxati, darslar, testlar saqlanadigan baza | Bepul (boshlanishiga yetadi) |
| **Bunny Stream** | Video darslarni saqlash va ko'rsatish | ~1 $/oy dan (1000 GB ko'rish ≈ 5–10 $) |
| **Anthropic (Claude)** | Har dars ostidagi AI yordamchi | Ishlatgancha to'lanadi (boshlash uchun 5 $ yetadi) |
| **Vercel** | Saytni internetga chiqarish | Bepul |

> Video uchun pul to'lamoqchi bo'lmasangiz, boshida darslarni **YouTube'ga "Unlisted" (ro'yxatda yo'q)** qilib yuklab, havolasini qo'yishingiz ham mumkin. Keyin istalgan vaqtda Bunny'ga o'tasiz.

Quyidagi kalitlarni (key) bir joyga — masalan, telefoningizdagi zametkaga — yozib boring. Ular 5-qadamda kerak bo'ladi:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_BUNNY_LIBRARY_ID=
BUNNY_STREAM_API_KEY=
BUNNY_TOKEN_KEY=
```

⚠️ **ANTHROPIC_API_KEY ni hech kimga bermang va hech qayerga (Telegram, GitHub) joylamang** — u bilan sizning hisobingizdan pul sarflash mumkin.

---

## 1-qadam. Supabase (ma'lumotlar bazasi)

1. https://supabase.com saytiga kiring → **Start your project** → GitHub hisobingiz bilan kiring.
2. **New project** tugmasini bosing:
   - *Name*: `bio-academy`
   - *Database Password*: kuchli parol o'ylab toping va saqlab qo'ying
   - *Region*: **Central EU (Frankfurt)** — O'zbekistonga eng yaqini
   - **Create new project** ni bosing va 1–2 daqiqa kuting.
3. Chap menyudan **SQL Editor** → **New query** ni oching.
4. Ushbu repozitoriydagi [`supabase/schema.sql`](../supabase/schema.sql) faylini oching, **butun matnni** nusxalab, SQL Editor'ga joylang va **Run** ni bosing. Pastda `Success. No rows returned` chiqishi kerak.
5. Chap menyudan **Project Settings** (tishli g'ildirak) → **API** (yoki **Data API**) bo'limiga kiring va yozib oling:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** kalit → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   
   (`service_role` kalitni **olmang** — u kerak emas va xavfli.)

## 2-qadam. Bunny Stream (video)

1. https://bunny.net ga kiring va ro'yxatdan o'ting (karta ulash so'raladi, 14 kun bepul).
2. Chap menyudan **Stream** → **Add Video Library** → nom bering (`bio-academy`) → mintaqa sifatida **Europe** ni tanlang.
3. Kutubxona ichida **API** bo'limiga kiring:
   - **Video Library ID** (raqam) → `NEXT_PUBLIC_BUNNY_LIBRARY_ID`
   - **API Key** (uzun kod) → `BUNNY_STREAM_API_KEY` — buni hech kimga bermang, u bilan videolaringizni o'chirish mumkin.
4. **Security** bo'limida:
   - **Allowed Domains** ga saytingiz manzilini qo'shing (masalan `bio-academy-delta.vercel.app`). Shunda videolaringizni boshqa saytlarga joylab bo'lmaydi.
   - **Embed view token authentication** ni yoqing va **Token Authentication Key** ni nusxalang → `BUNNY_TOKEN_KEY`. Shunda video havolasi 6 soatdan keyin ishlamay qoladi va uni boshqalarga tarqatib bo'lmaydi. (Bu kalitni qo'shmasdan token'ni yoqsangiz, videolar ochilmaydi.)

Video yuklash: admin panelda darsni oching → **🎬 Video** bo'limida **"Videoni Bunny'ga yuklash"** → faylni tanlang → 100% bo'lgach **Saqlash** ni bosing. Bunny videoni 5–15 daqiqada tayyorlaydi. (Xohlasangiz, bunny.net'ning o'zida yuklab, **Video ID** ni qo'lda joylashingiz ham mumkin.)

## 3-qadam. Anthropic (AI yordamchi)

1. https://console.anthropic.com ga kiring va ro'yxatdan o'ting.
2. **Billing** (yoki **Plans & Billing**) bo'limida karta ulab, 5 $ hisob to'ldiring.
3. **API Keys** → **Create Key** → nom: `bio-academy` → hosil bo'lgan `sk-ant-...` kalitni darhol nusxalab oling (u faqat bir marta ko'rsatiladi) → `ANTHROPIC_API_KEY`.
4. (Tavsiya) **Limits** bo'limida oylik xarajat chegarasini qo'ying, masalan 20 $.

AI har bir o'quvchiga kuniga **50 ta** savol beradi (o'zgartirish mumkin, pastga qarang).

## 4-qadam. Vercel (saytni internetga chiqarish)

1. https://vercel.com ga kiring → **Continue with GitHub**.
2. **Add New…** → **Project** → ro'yxatdan `Bio-academy` repozitoriyini tanlang → **Import**.
   (Agar ro'yxatda ko'rinmasa: **Adjust GitHub App Permissions** ni bosib, shu repozitoriyga ruxsat bering.)
3. **Environment Variables** bo'limini oching va yozib olgan kalitlarni birma-bir qo'shing (chapda nomi, o'ngda qiymati):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | 1-qadamdagi Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 1-qadamdagi anon kalit |
   | `ANTHROPIC_API_KEY` | 3-qadamdagi `sk-ant-...` |
   | `NEXT_PUBLIC_BUNNY_LIBRARY_ID` | 2-qadamdagi Library ID |
   | `BUNNY_STREAM_API_KEY` | 2-qadamdagi API Key (admin paneldan yuklash uchun) |
   | `BUNNY_TOKEN_KEY` | 2-qadamdagi Token Authentication Key (ixtiyoriy) |

4. **Deploy** ni bosing va 2–3 daqiqa kuting. Tayyor bo'lgach, saytingiz manzili chiqadi, masalan `https://bio-academy.vercel.app`.

## 5-qadam. Supabase'ga sayt manzilini aytish

Email tasdiqlash havolalari to'g'ri ishlashi uchun:

1. Supabase → **Authentication** → **URL Configuration**.
2. **Site URL** ga Vercel bergan manzilni yozing: `https://bio-academy.vercel.app`
3. **Redirect URLs** ga qo'shing: `https://bio-academy.vercel.app/**`
4. **Save**.

## 6-qadam. O'zingizni admin qilish

1. Saytingizni oching → **Ro'yxatdan o'tish** → ism, email, parol kiriting.
2. Emailingizga kelgan tasdiqlash havolasini bosing.
3. Supabase → **SQL Editor** → **New query** ga quyidagini yozing (emailni o'zingiznikiga almashtiring) va **Run**:

   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'sizning@email.uz');
   ```

4. Saytga qaytib, sahifani yangilang — yuqori menyuda **Admin** paydo bo'ladi. 🎉

---

## Platformadan foydalanish

### Kurs, mavzu va dars qo'shish
**Admin** → yangi kurs (masalan, "Botanika") → kursni oching → **Yangi mavzu** → mavzu ichida **Dars qo'shish**:
- **Video**: Bunny tanlansa — Video ID; YouTube tanlansa — video havolasi.
- **Dars konspekti**: darsdagi asosiy ma'lumotlar, ta'riflar, misollar. **AI yordamchi aynan shu matn asosida javob beradi** — qanchalik to'liq yozsangiz, javoblar shunchalik aniq bo'ladi. Video matnini (transkript) ham shu yerga joylashingiz mumkin.

### Test qo'shish
Mavzu ichida test nomi va vaqtini yozib **Test qo'shish** → test sahifasida savollarni bittalab yoki **ko'pini birdaniga** qo'shing:

```
1. Hujayraning energiya markazi qaysi organoid?
A) Yadro
*B) Mitoxondriya
C) Ribosoma
D) Lizosoma
Izoh: Mitoxondriyada ATF sintezlanadi.

2. Fotosintez qayerda boradi?
*A) Xloroplastda
B) Yadroda
```

To'g'ri javob oldiga `*` qo'yiladi, savollar orasida bo'sh qator qoldiriladi. To'g'ri javoblar o'quvchiga test topshirilgandan keyingina ko'rsatiladi. Vaqt tugasa test avtomatik yakunlanadi.

### PDF'dan 100 ta savolni birdaniga yuklash
1. Test sahifasida **📄 PDF fayldan savollarni yuklash** bo'limida PDF'ni tanlang va **PDF'ni o'qish** ni bosing.
2. 1–3 daqiqa kuting (sahifani yopmang). AI savollar, variantlar va to'g'ri javoblarni o'qiydi. PDF oxirida javoblar jadvali bo'lsa (`1-B, 2-C ...`), u ham hisobga olinadi.
3. Ro'yxatni tekshiring:
   - **sariq** savol — javobni AI tanlagan (PDF'da javob yo'q edi). To'g'ri bo'lsa doirachani bir marta bosib tasdiqlang, xato bo'lsa to'g'risini belgilang;
   - **qizil** savol — javob topilmadi, o'zingiz belgilang;
   - matn yoki variantda xato bo'lsa, shu yerning o'zida tuzating; keraksiz savolni **O'chirish**.
4. **... ta savolni testga qo'shish** ni bosing.

Maslahat: skanerlangan (rasm) PDF ham o'qiladi, lekin matnli PDF aniqroq. Bitta 100 savollik PDF taxminan $0.20–0.60 AI krediti sarflaydi.

### Jonli dars
**Admin → Jonli darslar** → mavzu, vaqt (Toshkent vaqti) va Zoom/Google Meet havolasini kiriting. O'quvchilar uni kabinet va "Jonli darslar" sahifasida ko'radi. Dars tugagach, yozuvni YouTube (Unlisted) yoki Bunny'ga yuklab, o'sha darsni tahrirlab **yozuv havolasini** qo'shing — u arxivda paydo bo'ladi.

---

## Qo'shimcha sozlamalar (ixtiyoriy)

Vercel → Project → **Settings → Environment Variables** da qo'shish mumkin (keyin **Deployments → Redeploy**):

| Nomi | Nima qiladi | Standart |
|---|---|---|
| `AI_DAILY_LIMIT` | Bir o'quvchi 24 soatda nechta AI savol bera oladi | `50` |
| `ANTHROPIC_MODEL` | AI modeli | `claude-opus-5-5` |

## Muammo bo'lsa

- **"AI yordamchi hali sozlanmagan"** — Vercel'da `ANTHROPIC_API_KEY` qo'shilmagan yoki qo'shilgandan keyin Redeploy qilinmagan.
- **Video o'rniga "Video hali joylanmagan"** — dars uchun Video ID kiritilmagan yoki `NEXT_PUBLIC_BUNNY_LIBRARY_ID` qo'shilmagan.
- **Bunny videosi ochilmaydi** — Bunny → Security → Allowed Domains ga sayt manzili to'g'ri yozilganini tekshiring. Token yoqilgan bo'lsa, `BUNNY_TOKEN_KEY` Vercel'da borligini tekshiring.
- **"Bunny sozlanmagan" xatosi yuklashda** — Vercel'da `BUNNY_STREAM_API_KEY` yo'q; qo'shing va **Redeploy** qiling.
- **Video yuklandi, lekin "ishlanmoqda" deb turibdi** — Bunny videoni tayyorlayapti, 5–15 daqiqa kuting.
- **Tasdiqlash emaili kelmaydi** — Spam papkasini tekshiring. Supabase bepul rejasida soatiga bir necha email yuboradi; ko'p o'quvchi uchun Supabase → Authentication → **SMTP Settings** orqali o'z pochta xizmatingizni ulang (yoki sinov paytida Authentication → Providers → Email → **Confirm email** ni o'chiring).
- **Admin menyusi chiqmayapti** — 6-qadamdagi SQL'da email to'g'ri yozilganini tekshiring, so'ng saytdan chiqib qayta kiring.

## Yangilanishlar (SQL)

Ba'zi yangi imkoniyatlar Supabase bazasiga kichik o'zgartirish talab qiladi. Bunday paytda Supabase → **SQL Editor** → **New query** ni oching, ko'rsatilgan faylning butun matnini joylang va **Run** ni bosing:

- [`supabase/update-savollar-soni.sql`](../supabase/update-savollar-soni.sql) — o'quvchi testda nechta savol yechishini o'zi tanlaydi (10, 20, 30, 40, 50 yoki barchasi).

## Dasturchilar uchun (kompyuterda ishga tushirish)

```bash
cp .env.example .env.local   # kalitlarni to'ldiring
npm install
npm run dev                  # http://localhost:3000
```

Texnologiyalar: Next.js 16 (App Router), Supabase (Auth + Postgres + RLS), Tailwind CSS 4, Anthropic Claude API, Bunny Stream / YouTube embed.
