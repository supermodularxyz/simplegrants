import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getSession } from 'next-auth/react';
import { PrismaService } from 'src/prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from 'types/constants';

@Injectable()
export class NextAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();
    const session = await getSession({ req });

    // If no session exists, we don't allow any entry
    if (!session) return false;

    // Get user data based on session
    const user = await this.prisma.user.findUnique({
      where: {
        id: (session.user as any).id,
      },
    });

    // Append the user to the request to retrieve
    req.user = user;

    const validSession = !!session && new Date() < new Date(session.expires);

    // If no roles, just check if session is valid
    if (!requiredRoles) {
      return validSession;
    }

    // Otherwise, ensure that session is valid & has required roles
    return requiredRoles.some((role) => user.role === role) && validSession;
  }
}
