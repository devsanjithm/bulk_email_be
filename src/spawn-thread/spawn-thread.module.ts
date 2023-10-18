import { Module } from '@nestjs/common';
import { SpawnThreadService } from './spawn-thread.service';
import { SparkModule } from '../spark/spark.module';

@Module({
  imports: [SparkModule],
  providers: [SpawnThreadService],
  exports: [SpawnThreadService],
})
export class SpawnThreadModule {}
