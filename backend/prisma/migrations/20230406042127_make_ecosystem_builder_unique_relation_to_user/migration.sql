/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `EcosystemBuilder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EcosystemBuilder_userId_key" ON "EcosystemBuilder"("userId");
