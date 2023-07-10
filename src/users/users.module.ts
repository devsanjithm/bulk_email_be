import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { SparkModule } from 'src/spark/spark.module';
import { redisCacheModule } from 'src/cache/cache.module';

@Module({
  imports: [PrismaModule,SparkModule,redisCacheModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
