import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('v1/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll() {
    // hardcoded companyId for now — comes from JWT on Day 6
    return this.itemsService.findAll('company-1');
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.itemsService.findById(id, 'company-1');
  }

  @Post()
  async create(@Body() body: { name: string; description: string }) {
    return this.itemsService.create({
      name: body.name,
      description: body.description,
      companyId: 'company-1',
    });
  }
}