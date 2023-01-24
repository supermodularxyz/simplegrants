import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdminPrivilegeDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  id: string;
}
