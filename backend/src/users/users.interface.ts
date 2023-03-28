import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';
import { Contribution } from 'src/contributions/contributions.interface';
import { GrantResponse } from 'src/grants/grants.interface';

export interface RequestWithUser {
  user: User;
}

export class User {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: String,
  })
  name: string;

  @ApiResponseProperty({
    type: String,
  })
  email: string;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  emailVerified: Date | null;

  @ApiResponseProperty({
    type: String,
  })
  image: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  bio: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  twitter: string | null;

  @Exclude()
  visitorId: string | null;

  @ApiResponseProperty({
    enum: Role,
  })
  role: Role;

  @Exclude()
  flagged: boolean;

  @ApiResponseProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiResponseProperty({
    type: Date,
  })
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export class UserProfile extends User {
  @ApiResponseProperty({
    type: [Contribution],
  })
  contributions: Contribution[];

  @ApiResponseProperty({
    type: [GrantResponse],
  })
  grants: GrantResponse[];

  constructor(partial: Partial<UserProfile>) {
    super(partial);
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
