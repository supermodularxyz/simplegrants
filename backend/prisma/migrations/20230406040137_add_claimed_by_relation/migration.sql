/*
  Warnings:

  - A unique constraint covering the columns `[inviteCodesId]` on the table `EcosystemBuilder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteCodesId` to the `EcosystemBuilder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EcosystemBuilder" ADD COLUMN     "inviteCodesId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InviteCodes" ADD COLUMN     "claimedById" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "EcosystemBuilder_inviteCodesId_key" ON "EcosystemBuilder"("inviteCodesId");

-- AddForeignKey
ALTER TABLE "EcosystemBuilder" ADD CONSTRAINT "EcosystemBuilder_inviteCodesId_fkey" FOREIGN KEY ("inviteCodesId") REFERENCES "InviteCodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
