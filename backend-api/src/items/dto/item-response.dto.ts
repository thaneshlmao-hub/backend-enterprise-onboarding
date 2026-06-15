import { ApiProperty } from '@nestjs/swagger';

export class ItemResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'Laptop' })
  name: string;

  @ApiProperty({ example: 'A high performance laptop' })
  description: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;
}