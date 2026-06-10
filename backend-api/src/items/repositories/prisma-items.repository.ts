import { Injectable } from '@nestjs/common';
import {
  IItemsRepository,
  Item,
  CreateItemData,
} from '../interfaces/items.repository.interface';

@Injectable()
export class PrismaItemsRepository implements IItemsRepository {
  // Hardcoded data for now — real Prisma queries come on Day 5
  private items: Item[] = [
    {
      id: '1',
      name: 'Item One',
      description: 'First hardcoded item',
      companyId: 'company-1',
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Item Two',
      description: 'Second hardcoded item',
      companyId: 'company-1',
      createdAt: new Date(),
    },
  ];

  async findAll(companyId: string): Promise<Item[]> {
    return this.items.filter((item) => item.companyId === companyId);
  }

  async findById(id: string, companyId: string): Promise<Item | null> {
    return (
      this.items.find(
        (item) => item.id === id && item.companyId === companyId,
      ) ?? null
    );
  }

  async create(data: CreateItemData): Promise<Item> {
    const newItem: Item = {
      id: String(this.items.length + 1),
      name: data.name,
      description: data.description,
      companyId: data.companyId,
      createdAt: new Date(),
    };
    this.items.push(newItem);
    return newItem;
  }
}