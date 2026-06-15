import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { PrismaModule } from './prisma/prisma.module';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';

@Module({
  imports: [
    PrismaModule,  // Global — PrismaService available everywhere
    ItemsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}