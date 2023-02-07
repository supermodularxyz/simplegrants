/*
  Warnings:

  - A unique constraint covering the columns `[uniqueId]` on the table `PaymentMethod` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_uniqueId_key" ON "PaymentMethod"("uniqueId");
