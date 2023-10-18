import { PartialType } from '@nestjs/mapped-types';
import { CreateSparkDto } from './create-spark.dto';

export class UpdateSparkDto extends PartialType(CreateSparkDto) {}
