# عائلة الزغارنة — منصة رقمية عائلية وثقافية وإخبارية

منصة ويب عربية (RTL بالكامل) مبنية بـ Next.js 14 + TypeScript + PostgreSQL + Prisma.

## 1. شجرة المشروع

```
zagharna/
├── prisma/
│   ├── schema.prisma        # كل الجداول والعلاقات
│   └── seed.ts               # بيانات أولية موسومة كـ Demo فقط
├── src/
│   ├── app/                  # صفحات Next.js (App Router)
│   │   ├── page.tsx          # الرئيسية
│   │   ├── quran/            # /quran
│   │   ├── news/             # /news
│   │   ├── sports/           # /sports
│   │   ├── education/        # /education
│   │   ├── family/           # /family
│   │   ├── articles/         # /articles + /articles/[id]
│   │   ├── gallery/          # /gallery
│   │   ├── videos/           # /videos
│   │   ├── admin/            # لوحة التحكم الكاملة (محمية)
│   │   └── api/               # كل مسارات الـ API
│   ├── components/           # Header, Footer, AnalogClock, NewsCard, AudioPlayer...
│   ├── services/newsIngestion/ # خدمة جلب الأخبار (RSS parser, ingest, scheduler)
│   ├── lib/                  # db.ts, auth.ts, logger.ts
│   ├── config/                # site.config.ts (الهوية والإعدادات)
│   ├── hooks/                 # useAudioPlayer.ts
│   └── types/
├── tests/                     # اختبارات Vitest
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## 2. أوامر التثبيت

```bash
npm install
```

## 3. إعداد ملف .env

```bash
cp .env.example .env
```

ثم عدّل داخل `.env`:
- `DATABASE_URL` — رابط اتصال PostgreSQL الحقيقي
- `NEXTAUTH_SECRET` — ولّده بـ: `openssl rand -base64 32`
- `CRON_SECRET` — سلسلة عشوائية تحمي `/api/cron/ingest-news`

## 4. إنشاء قاعدة البيانات

```bash
npx prisma migrate dev --name init
npm run db:seed
```

هذا ينشئ كل الجداول ويضيف حساب مشرف أولي:
- البريد: `admin@zagharna.local`
- كلمة المرور: `ChangeMe123!` — **غيّرها فورًا بعد أول دخول**

## 5. التشغيل المحلي

```bash
npm run dev
```

الموقع: http://localhost:3000
لوحة التحكم: http://localhost:3000/admin/login

## 6. تشغيل خدمة جلب الأخبار

- تشغيل يدوي لمرة واحدة: `npm run ingest:news`
- تشغيل مستمر (Worker منفصل، مُستخدم في الإنتاج): `npx tsx src/services/newsIngestion/scheduler.ts`
- أو عبر Cron خارجي يستدعي: `POST /api/cron/ingest-news` مع الترويسة
  `Authorization: Bearer <CRON_SECRET>`

## 7. طريقة إضافة مصادر الأخبار

من لوحة التحكم: **Admin → Sources → إضافة مصدر جديد**
أدخل: اسم المصدر، رابط RSS الرسمي، فترة التحديث بالدقائق.
لا تضع رابطًا لا يسمح مالك المصدر بإعادة استخدامه.

## 8. طريقة تغيير رابط بث القرآن

الرابط مخزَّن في جدول `radio_streams` (وليس في الكود). عدّله عبر:

```bash
npx prisma studio
```

ثم افتح جدول `RadioStream` وحدّث حقل `streamUrl` واجعل `isActive = true`.

## 9. طريقة الدخول إلى لوحة الإدارة

`/admin/login` — بالحساب الذي أنشأته عبر `npm run db:seed` أو أي حساب مشرف آخر تضيفه لاحقًا.

## 10. تشغيل الاختبارات

```bash
npm run test
```

## 11. البناء والتشغيل عبر Docker

```bash
docker compose up --build
```

يشغّل ثلاث خدمات: `web` (الموقع)، `news-worker` (جلب الأخبار المجدول)، `db` (PostgreSQL)، بالإضافة إلى `redis`.

## 12. النشر على Nebius

1. ابنِ صورة Docker: `docker build -t zagharna-platform .`
2. ادفعها إلى سجل الحاويات الخاص بـ Nebius.
3. أنشئ خدمة PostgreSQL مُدارة على Nebius، وضع رابطها في `DATABASE_URL`.
4. شغّل الترحيلات مرة واحدة عند النشر: `npx prisma migrate deploy`
5. اضبط متغيرات البيئة من `.env.example` في إعدادات الخدمة على Nebius.
6. فعّل فحص الصحة على `/api/health` (مُعرَّف مسبقًا في Dockerfile).
7. شغّل `news-worker` كخدمة منفصلة دائمة، أو استخدم Scheduled Job في Nebius يستدعي
   `/api/cron/ingest-news` دوريًا بدلًا من عملية دائمة.

## 13. شرح مختصر لكل جزء

| الجزء | الوصف |
|---|---|
| `prisma/schema.prisma` | مصدر الحقيقة الوحيد لبنية البيانات — 16 جدولًا مترابطًا |
| `services/newsIngestion` | يجلب RSS، يحلّله، يزيل التكرار (unique sourceId+externalId)، يسجّل الأخطاء |
| `api/cron/ingest-news` | بديل لتشغيل الجلب عبر Cron خارجي بدل عملية دائمة |
| `components/AnalogClock` | ساعة تناظرية تعمل بـ setInterval فعلي، لا صورة ثابتة |
| `hooks/useAudioPlayer` | يحفظ آخر موضع استماع في القرآن عبر localStorage |
| `middleware.ts` | يحمي كل مسارات `/admin` عدا صفحة الدخول |
| `config/site.config.ts` | الهوية والتنقل — عدّل هنا بدل البحث داخل المكونات |

## ملاحظات هامة

- لا تُعرض أي بيانات إخبارية أو رياضية حقيقية في هذا الإصدار — النظام فارغ حتى يضيف
  المشرف مصادر RSS رسمية فعلية عبر لوحة التحكم.
- كل خبر يُعرض بعنوانه وملخصه فقط، مع رابط "اقرأ الخبر كاملًا" يوجّه للمصدر الأصلي،
  احترامًا لحقوق النشر.
- الصفحات التالية لم تُبنَ بعد في هذا الإصدار وتحتاج دفعة تالية: تكامل AI (تلخيص/تصنيف)،
  دعم اللغة الإنجليزية، نظام الإشعارات الفعلي، صفحة تفصيلية لكل سورة مع Metadata SEO
  (Article Schema/Breadcrumbs) على كل صفحة محتوى.
