import { prisma } from "@/lib/db";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.count();
  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">إدارة الصور</h1>
      <p className="text-sm text-ivory-dim">عدد الصور الحالية: {images}</p>
    </div>
  );
}
