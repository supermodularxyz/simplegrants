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
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  email: string;

  @ApiProperty({
    type: Date,
  })
  emailVerified?: Date;

  @ApiProperty({
    type: String,
  })
  image: string;

  @ApiProperty({
    type: String,
  })
  bio?: string;

  @ApiProperty({
    type: String,
  })
  twitter?: string;

  @Exclude()
  visitorId?: string;

  @ApiProperty({
    enum: Role,
  })
  role: Role;

  @Exclude()
  flagged: boolean;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
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
