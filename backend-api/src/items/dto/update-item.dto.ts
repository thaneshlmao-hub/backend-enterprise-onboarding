import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
} from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({
    description: 'The name of the item',
    example: 'Updated Laptop',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'A description of the item',
    example: 'An updated description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}