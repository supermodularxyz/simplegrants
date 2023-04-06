import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvitesService {
  constructor(private readonly prisma: PrismaService) {}

  //   async createInvites() {}

  /**
   * Claim an invite code to be an ecosystem builder
   * @param code Invite code
   * @param user The user model created by NextAuth
   * @returns
   */
  async claimInviteCode(code: string, user: User) {
    // First, we ensure that this user doesn't already have an ecosystem builder account
    const ecosystemBuilder = await this.prisma.ecosystemBuilder.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (ecosystemBuilder)
      throw new HttpException(
        'User already has an ecosystem builder account',
        HttpStatus.BAD_REQUEST,
      );

    const invite = await this.prisma.inviteCodes.findUnique({
      where: {
        id: code,
      },
    });

    if (!invite)
      throw new HttpException('Invalid invite code', HttpStatus.NOT_FOUND);

    if (invite.claimed)
      throw new HttpException(
        'Invite code already claimed',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    // If all good, we create an ecosystem builder entry by updating the invite code
    return await this.prisma.inviteCodes.update({
      where: {
        id: code,
      },
      data: {
        claimed: true,
        claimedBy: {
          create: {
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },
    });
  }
}
