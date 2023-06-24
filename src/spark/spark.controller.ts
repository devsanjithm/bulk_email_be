import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SparkService } from './spark.service';
import { CreateSparkDto } from './dto/create-spark.dto';
import { UpdateSparkDto } from './dto/update-spark.dto';

@Controller('spark')
export class SparkController {
  constructor(private readonly sparkService: SparkService) {}

  @Post()
  create(@Body() createSparkDto: CreateSparkDto) {
    return this.sparkService.create(createSparkDto);
  }

  @Get()
  findAll() {
    return this.sparkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sparkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSparkDto: UpdateSparkDto) {
    return this.sparkService.update(+id, updateSparkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sparkService.remove(+id);
  }
}
