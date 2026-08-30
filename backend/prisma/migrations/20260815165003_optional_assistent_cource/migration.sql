-- DropForeignKey
ALTER TABLE "assistent" DROP CONSTRAINT "assistent_courceId_fkey";

-- AlterTable
ALTER TABLE "assistent" ALTER COLUMN "courceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "assistent" ADD CONSTRAINT "assistent_courceId_fkey" FOREIGN KEY ("courceId") REFERENCES "cources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
