-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'PENDING';

-- CreateTable
CREATE TABLE "TelegramOtp" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresIn" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TelegramOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TelegramOtp_userId_idx" ON "TelegramOtp"("userId");

-- AddForeignKey
ALTER TABLE "TelegramOtp" ADD CONSTRAINT "TelegramOtp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
