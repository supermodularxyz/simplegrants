-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "matchingRoundId" TEXT;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_matchingRoundId_fkey" FOREIGN KEY ("matchingRoundId") REFERENCES "MatchingRound"("id") ON DELETE SET NULL ON UPDATE CASCADE;
