-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "cources" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "PurchasedCource" (
    "courceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchasedCource_pkey" PRIMARY KEY ("userId","courceId")
);

-- AddForeignKey
ALTER TABLE "PurchasedCource" ADD CONSTRAINT "PurchasedCource_courceId_fkey" FOREIGN KEY ("courceId") REFERENCES "cources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedCource" ADD CONSTRAINT "PurchasedCource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
