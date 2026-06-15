import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  IItemsRepository,
  Item,
  CreateItemData,
  UpdateItemData,
} from '../interfaces/items.repository.interface';

@Injectable()
export class PrismaItemsRepository implements IItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(companyId: string): Promise<Item[]> {
    // companyId is ALWAYS included — it is a security boundary not an optional filter
    // Prisma middleware automatically adds deletedAt: null
    // so soft-deleted items are NEVER returned
    return this.prisma.item.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<Item[]>;
  }

  async findById(id: string, companyId: string): Promise<Item | null> {
    // Both id AND companyId must match
    // This prevents IDOR — Company B cannot access Company A's item
    // even if they somehow know the ID
    return this.prisma.item.findFirst({
      where: { id, companyId },
    }) as Promise<Item | null>;
  }

  async create(data: CreateItemData): Promise<Item> {
    // $transaction ensures item creation AND audit log
    // both succeed or both fail — atomically
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.item.create({
        data: {
          name: data.name,
          description: data.description,
          companyId: data.companyId,
        },
      });

      // AuditLog written in the SAME transaction
      // If this fails, item creation is rolled back automatically
      await tx.auditLog.create({
        data: {
          companyId: data.companyId,
          userId: data.userId,
          entityType: 'Item',
          entityId: item.id,
          action: 'CREATE',
          before: undefined,
          after: item as any,
        },
      });

      return item;
    }) as Promise<Item>;
  }

  async update(
    id: string,
    companyId: string,
    userId: string,
    data: UpdateItemData,
  ): Promise<Item> {
    // Fetch current state first for the "before" snapshot in AuditLog
    const existing = await this.findById(id, companyId);
    if (!existing) {
      throw new NotFoundException(`Item ${id} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.item.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.status && { status: data.status as any }),
        },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId,
          entityType: 'Item',
          entityId: id,
          action: 'UPDATE',
          before: existing as any,
          after: updated as any,
        },
      });

      return updated;
    }) as Promise<Item>;
  }

  async softDelete(
    id: string,
    companyId: string,
    userId: string,
  ): Promise<void> {
    const existing = await this.findById(id, companyId);
    if (!existing) {
      throw new NotFoundException(`Item ${id} not found`);
    }

    await this.prisma.$transaction(async (tx) => {
      // Set deletedAt timestamp — NEVER hard delete
      await tx.item.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId,
          entityType: 'Item',
          entityId: id,
          action: 'DELETE',
          before: existing as any,
          after: undefined,
        },
      });
    });
  }
}