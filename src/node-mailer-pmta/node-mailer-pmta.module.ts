import { Module } from '@nestjs/common';
import { NodeMailerPmtaService } from './node-mailer-pmta.service';
import { SparkModule } from 'src/spark/spark.module';

@Module({
  imports:[SparkModule],
  providers: [NodeMailerPmtaService],
  exports:[NodeMailerPmtaService]
})
export class NodeMailerPmtaModule {}
