-- DropForeignKey
ALTER TABLE "PurchasedCource" DROP CONSTRAINT "PurchasedCource_courceId_fkey";

-- AddForeignKey
ALTER TABLE "PurchasedCource" ADD CONSTRAINT "PurchasedCource_courceId_fkey" FOREIGN KEY ("courceId") REFERENCES "cources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
