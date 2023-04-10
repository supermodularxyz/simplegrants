import { ApiResponseProperty } from '@nestjs/swagger';
import { InviteCodes } from '@prisma/client';
import { Exclude } from 'class-transformer';

/**
 * We only return a boolean `claimed` and the `code` that was claimed
 * Everything else is excluded to protect user's information
 *
 * This is using the `class-transformer` library to exclude properties
 */
export class InviteCodeResponse {
  @ApiResponseProperty({
    type: Boolean,
  })
  claimed: boolean;

  @ApiResponseProperty({
    type: String,
  })
  code: string;

  @Exclude()
  id: string;

  @Exclude()
  claimedById: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<InviteCodes>) {
    Object.assign(this, partial);
  }
}
