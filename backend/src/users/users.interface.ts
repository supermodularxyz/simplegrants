import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';
import { Contribution } from 'src/contributions/contributions.interface';
import { GrantResponse } from 'src/grants/grants.interface';

export interface RequestWithUser {
  user: User;
}

export class User {
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
    nullable: true,
  })
  emailVerified: Date | null;

  @ApiProperty({
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

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export class UserProfile extends User {
  @ApiProperty({
    type: [Contribution],
  })
  contributions: Contribution[];

  @ApiProperty({
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
