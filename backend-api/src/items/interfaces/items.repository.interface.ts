export interface Item {
  id: string;
  name: string;
  description: string;
  companyId: string;
  createdAt: Date;
}

export interface CreateItemData {
  name: string;
  description: string;
  companyId: string;
}

export interface IItemsRepository {
  findAll(companyId: string): Promise<Item[]>;
  findById(id: string, companyId: string): Promise<Item | null>;
  create(data: CreateItemData): Promise<Item>;
}