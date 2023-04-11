import { Contribution, EcosystemBuilder, Grant } from '@prisma/client';
import { MatchedFund } from 'src/matched-funds/matched-funds.interface';

export class MatchingRound {
  id: string;
  name: string;
  funders: EcosystemBuilder[];
  contributions: Contribution[];
  grants: Grant[];
  matchedFunds: MatchedFund[];
  verified: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
