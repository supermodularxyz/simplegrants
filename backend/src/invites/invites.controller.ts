import { Controller, Post } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { Throttle } from '@nestjs/throttler';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  async createInvites() {}

  /**
   * Claim an invite code
   * Rate limited to:
   * 3 tries for 24 hours
   */
  @Throttle(3, 86400)
  @Post(':code')
  async claimInviteCode() {}
}
