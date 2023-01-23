import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from 'types/constants';

export const Public = () => SetMetadata(PUBLIC_KEY, true);
