import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type {
  IItemsRepository,
  Item,
} from './interfaces/items.repository.interface';
import { ItemResponseDto } from './dto/item-response.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CompanyContextService } from '../common/context/company-context.service';

@Injectable()
export class ItemsService {
  constructor(
    @Inject('IItemsRepository')
    private readonly itemsRepository: IItemsRepository,
    private readonly companyContext: CompanyContextService,
  ) {}

  private toResponseDto(item: Item): ItemResponseDto {
    const dto = new ItemResponseDto();
    dto.id = item.id;
    dto.name = item.name;
    dto.description = item.description ?? '';
    dto.createdAt = item.createdAt;
    return dto;
  }

  async findAll(): Promise<ItemResponseDto[]> {
    // companyId always comes from CompanyContext — never from request body
    const companyId = this.companyContext.companyId;
    const items = await this.itemsRepository.findAll(companyId);
    return items.map((item) => this.toResponseDto(item));
  }

  async findById(id: string): Promise<ItemResponseDto> {
    const companyId = this.companyContext.companyId;
    const item = await this.itemsRepository.findById(id, companyId);
    if (!item) {
      throw new NotFoundException(`Item ${id} not found`);
    }
    return this.toResponseDto(item);
  }

  async create(dto: CreateItemDto): Promise<ItemResponseDto> {
    const companyId = this.companyContext.companyId;
    const userId = this.companyContext.userId;
    const item = await this.itemsRepository.create({
      name: dto.name,
      description: dto.description,
      companyId,
      userId,
    });
    return this.toResponseDto(item);
  }

  async update(id: string, dto: UpdateItemDto): Promise<ItemResponseDto> {
    const companyId = this.companyContext.companyId;
    const userId = this.companyContext.userId;
    const item = await this.itemsRepository.update(id, companyId, userId, {
      name: dto.name,
      description: dto.description,
    });
    return this.toResponseDto(item);
  }

  async softDelete(id: string): Promise<void> {
    const companyId = this.companyContext.companyId;
    const userId = this.companyContext.userId;
    await this.itemsRepository.softDelete(id, companyId, userId);
  }
}