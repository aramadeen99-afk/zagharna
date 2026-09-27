/**
 * بيانات أولية للتشغيل المحلي فقط — موسومة بوضوح كبيانات Demo.
 * لا تُستخدم أي بيانات إخبارية حقيقية هنا؛ الأخبار الحقيقية تُجلب
 * لاحقًا عبر خدمة src/services/newsIngestion من مصادر مرخصة.
 */
import { PrismaClient, RoleName, SourceType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // الأدوار
  const superAdminRole = await prisma.role.upsert({
    where: { name: RoleName.SUPER_ADMIN },
    update: {},
    create: { name: RoleName.SUPER_ADMIN },
  });
  await prisma.role.upsert({
    where: { name: RoleName.EDITOR },
    update: {},
    create: { name: RoleName.EDITOR },
  });
  await prisma.role.upsert({
    where: { name: RoleName.MODERATOR },
    update: {},
    create: { name: RoleName.MODERATOR },
  });

  // حساب المشرف الأول — غيّر كلمة المرور فور أول تسجيل دخول
  const passwordHash = await bcrypt.hash("ChangeMe123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@zagharna.local" },
    update: {},
    create: {
      name: "مشرف النظام",
      email: "admin@zagharna.local",
      passwordHash,
      roleId: superAdminRole.id,
    },
  });

  // مصدر أخبار تجريبي — يجب استبدال الرابط برابط RSS رسمي فعلي
  await prisma.newsSource.upsert({
    where: { id: "demo-source-1" },
    update: {},
    create: {
      id: "demo-source-1",
      name: "مصدر تجريبي (استبدله من لوحة الإدارة)",
      type: SourceType.RSS,
      rssUrl: "https://example.com/rss-feed-placeholder.xml",
      status: "PAUSED", // متوقف حتى يضبطه المشرف برابط حقيقي
      fetchIntervalMinutes: 30,
    },
  });

  // إعداد بث القرآن — Placeholder، يُضبط من لوحة الإدارة
  await prisma.radioStream.upsert({
    where: { id: "quran-live-1" },
    update: {},
    create: {
      id: "quran-live-1",
      title: "إذاعة القرآن الكريم — بث مباشر",
      streamUrl: "", // يجب تعبئته برابط بث مرخص من لوحة الإدارة قبل التفعيل
      isActive: false,
    },
  });

  console.log("✅ تمت تهيئة البيانات الأولية (Demo) بنجاح.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
