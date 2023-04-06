import { ApiResponseProperty } from '@nestjs/swagger';
import { InviteCodes } from '@prisma/client';
import { Exclude } from 'class-transformer';

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
