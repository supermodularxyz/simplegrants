/*
  Warnings:

  - A unique constraint covering the columns `[recipientAddress,providerId]` on the table `PaymentAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentAccount_recipientAddress_providerId_key" ON "PaymentAccount"("recipientAddress", "providerId");
