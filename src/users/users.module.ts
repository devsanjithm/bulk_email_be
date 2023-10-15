import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../database/prisma.module';
import { SparkModule } from '../spark/spark.module';
import { redisCacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule,SparkModule,redisCacheModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
