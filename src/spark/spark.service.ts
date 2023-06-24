import { Injectable } from '@nestjs/common';
import { CreateSparkDto } from './dto/create-spark.dto';
import { UpdateSparkDto } from './dto/update-spark.dto';

@Injectable()
export class SparkService {
  create(createSparkDto: CreateSparkDto) {
    return 'This action adds a new spark';
  }

  findAll() {
    return `This action returns all spark`;
  }

  findOne(id: number) {
    return `This action returns a #${id} spark`;
  }

  update(id: number, updateSparkDto: UpdateSparkDto) {
    return `This action updates a #${id} spark`;
  }

  remove(id: number) {
    return `This action removes a #${id} spark`;
  }
}
