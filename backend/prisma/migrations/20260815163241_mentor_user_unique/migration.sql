/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `mentor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "mentor_userId_key" ON "mentor"("userId");
