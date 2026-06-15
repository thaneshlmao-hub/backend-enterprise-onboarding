export enum ItemStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface Item {
  id: string;
  name: string;
  description: string | null;
  status: ItemStatus;
  companyId: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemData {
  name: string;
  description?: string;
  companyId: string;
  userId: string;
}

export interface UpdateItemData {
  name?: string;
  description?: string;
  status?: ItemStatus;
}

export interface IItemsRepository {
  findAll(companyId: string): Promise<Item[]>;
  findById(id: string, companyId: string): Promise<Item | null>;
  create(data: CreateItemData): Promise<Item>;
  update(id: string, companyId: string, userId: string, data: UpdateItemData): Promise<Item>;
  softDelete(id: string, companyId: string, userId: string): Promise<void>;
}