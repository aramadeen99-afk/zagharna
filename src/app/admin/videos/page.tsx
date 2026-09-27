import { prisma } from "@/lib/db";

export default async function AdminVideosPage() {
  const videos = await prisma.video.count();
  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">إدارة الفيديو</h1>
      <p className="text-sm text-ivory-dim">عدد الفيديوهات الحالية: {videos}</p>
    </div>
  );
}
