import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type {
  IItemsRepository,
  Item,
  CreateItemData,
} from './interfaces/items.repository.interface';

@Injectable()
export class ItemsService {
  constructor(
    @Inject('IItemsRepository')
    private readonly itemsRepository: IItemsRepository,
  ) {}

  async findAll(companyId: string): Promise<Item[]> {
    return this.itemsRepository.findAll(companyId);
  }

  async findById(id: string, companyId: string): Promise<Item> {
    const item = await this.itemsRepository.findById(id, companyId);
    if (!item) {
      throw new NotFoundException(`Item ${id} not found`);
    }
    return item;
  }

  async create(data: CreateItemData): Promise<Item> {
    return this.itemsRepository.create(data);
  }
}