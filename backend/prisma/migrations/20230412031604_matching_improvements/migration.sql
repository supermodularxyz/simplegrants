/*
  Warnings:

  - A unique constraint covering the columns `[matchingRoundId,grantId]` on the table `MatchedFund` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MatchingRound" ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "verified" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "MatchedFund_matchingRoundId_grantId_key" ON "MatchedFund"("matchingRoundId", "grantId");
