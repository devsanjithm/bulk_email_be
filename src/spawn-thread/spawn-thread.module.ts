import { Module } from '@nestjs/common';
import { SpawnThreadService } from './spawn-thread.service';
import { SparkModule } from '../spark/spark.module';
import { NodeMailerPmtaModule } from 'src/node-mailer-pmta/node-mailer-pmta.module';

@Module({
  imports: [SparkModule,NodeMailerPmtaModule],
  providers: [SpawnThreadService],
  exports: [SpawnThreadService],
})
export class SpawnThreadModule {}
