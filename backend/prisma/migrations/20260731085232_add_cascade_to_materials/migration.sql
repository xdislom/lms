-- DropForeignKey
ALTER TABLE "materials" DROP CONSTRAINT "materials_lessonId_fkey";

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
