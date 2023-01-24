/*
  Warnings:

  - You are about to drop the column `paymentAccountId` on the `Contribution` table. All the data in the column will be lost.
  - Added the required column `paymentMethodId` to the `Contribution` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_paymentAccountId_fkey";

-- AlterTable
ALTER TABLE "Contribution" DROP COLUMN "paymentAccountId",
ADD COLUMN     "paymentMethodId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
