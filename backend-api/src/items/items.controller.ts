import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
} from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemResponseDto } from './dto/item-response.dto';
import { ApiResponse } from '../common/api-response.dto';

@ApiTags('items')
@Controller('v1/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items for the current company' })
  @SwaggerResponse({ status: 200, type: ItemResponseDto, isArray: true })
  async findAll(): Promise<ApiResponse<ItemResponseDto[]>> {
    const items = await this.itemsService.findAll();
    return ApiResponse.success(items);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @SwaggerResponse({ status: 200, type: ItemResponseDto })
  @SwaggerResponse({ status: 404, description: 'Item not found' })
  async findById(
    @Param('id') id: string,
  ): Promise<ApiResponse<ItemResponseDto>> {
    const item = await this.itemsService.findById(id);
    return ApiResponse.success(item);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @SwaggerResponse({ status: 201, type: ItemResponseDto })
  async create(
    @Body() dto: CreateItemDto,
  ): Promise<ApiResponse<ItemResponseDto>> {
    const item = await this.itemsService.create(dto);
    return ApiResponse.success(item);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an item' })
  @SwaggerResponse({ status: 200, type: ItemResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
  ): Promise<ApiResponse<ItemResponseDto>> {
    const item = await this.itemsService.update(id, dto);
    return ApiResponse.success(item);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete an item' })
  @SwaggerResponse({ status: 204, description: 'Item soft deleted' })
  async softDelete(@Param('id') id: string): Promise<void> {
    await this.itemsService.softDelete(id);
  }
}