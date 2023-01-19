import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  image: string;
  bio?: string;
  twitter?: string;
  visitorId?: string;
  role: Role;
  flagged: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestWithUser {
  user: User;
}

export class UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  image: string;
  bio?: string;
  twitter?: string;

  @Exclude()
  visitorId?: string;
  role: Role;

  @Exclude()
  flagged: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserProfile>) {
    Object.assign(this, partial);
  }
}

export class UpdateUserDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  bio: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  twitter: string;
}
