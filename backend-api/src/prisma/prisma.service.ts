import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');

    // Soft delete middleware
    // Automatically injects deletedAt: null on ALL read queries
    // for models that support soft delete
    // The rest of the codebase NEVER needs to remember to add this filter
    this.$use(async (params, next) => {
      const softDeleteModels = ['Item'];

      if (softDeleteModels.includes(params.model ?? '')) {
        if (
          params.action === 'findMany' ||
          params.action === 'findFirst' ||
          params.action === 'findUnique'
        ) {
          if (!params.args) params.args = {};
          if (!params.args.where) params.args.where = {};

          if (params.args.where.deletedAt === undefined) {
            params.args.where.deletedAt = null;
          }
        }
      }

      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}