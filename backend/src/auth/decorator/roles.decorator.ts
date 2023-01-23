import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ROLES_KEY } from 'types/constants';

export const Roles = (...args: Role[]) => SetMetadata(ROLES_KEY, args);
