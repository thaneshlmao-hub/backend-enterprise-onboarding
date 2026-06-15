import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;
}

export class ApiError {
  @ApiProperty({ example: 'ITEM_NOT_FOUND' })
  code: string;

  @ApiProperty({ example: 'Item 99 not found' })
  message: string;
}

export class ApiResponse<T> {
  @ApiProperty()
  data: T | null;

  @ApiProperty({ required: false })
  meta?: PaginationMeta;

  @ApiProperty({ required: false, type: [ApiError] })
  errors?: ApiError[];

  static success<T>(data: T, meta?: PaginationMeta): ApiResponse<T> {
    const response = new ApiResponse<T>();
    response.data = data;
    response.meta = meta;
    return response;
  }

  static error<T>(code: string, message: string): ApiResponse<T> {
    const response = new ApiResponse<T>();
    response.data = null;
    response.errors = [{ code, message }];
    return response;
  }
}