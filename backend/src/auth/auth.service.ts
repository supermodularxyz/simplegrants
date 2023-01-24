import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Grant admin privilege for a user
   * @param id ID of the user to escalate
   * @param user User calling this function
   * @returns
   */
  async grantAdminPrivilege(id: string, user: User) {
    // Just do another check to ensure only an admin can call this
    if (user.role !== Role.Admin)
      throw new HttpException('Not enough permissions', HttpStatus.FORBIDDEN);

    return await this.prisma.user.update({
      data: {
        role: Role.Admin,
      },
      where: {
        id,
      },
    });
  }

  /**
   * Revoke admin privilege for a user
   * @param id ID of the user to revoke
   * @param user User calling this function
   * @returns
   */
  async revokeAdminPrivilege(id: string, user: User) {
    // Just do another check to ensure only an admin can call this
    if (user.role !== Role.Admin)
      throw new HttpException('Not enough permissions', HttpStatus.FORBIDDEN);

    return await this.prisma.user.update({
      data: {
        role: Role.User,
      },
      where: {
        id,
      },
    });
  }
}
