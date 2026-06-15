import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() makes PrismaService available in every module
// without needing to import PrismaModule repeatedly
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}