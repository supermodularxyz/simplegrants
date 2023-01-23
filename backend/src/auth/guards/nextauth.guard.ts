import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getSession } from 'next-auth/react';
import { PrismaService } from 'src/prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PUBLIC_KEY, ROLES_KEY } from 'types/constants';

@Injectable()
export class NextAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieving user sesion
    const req = context.switchToHttp().getRequest();
    const session = await getSession({ req });

    // Checking for required roles
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Checking if public route
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If route is made public, we do not care about the session
    if (isPublic) {
      return true;
    }

    // If route is not public and no session exists, we deny entry
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
