import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { getSession } from 'next-auth/react';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NextAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const session = await getSession({ req });

    if (!session) return false;

    // Get user data based on session
    const user = await this.prisma.user.findUnique({
      where: {
        id: (session.user as any).id,
      },
    });

    // Append the user to the request to retrieve
    req.user = user;

    return !!session && new Date() < new Date(session.expires);
  }
}
