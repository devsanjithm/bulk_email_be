import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { SparkModule } from 'src/spark/spark.module';

@Module({
  imports: [PrismaModule,SparkModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
