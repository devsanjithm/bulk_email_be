import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Logger } from '@nestjs/common';
import { SparkService } from './spark.service';
import { CreateSparkDto } from './dto/create-spark.dto';
import { UpdateSparkDto } from './dto/update-spark.dto';
import response from '../helpers/response';
import { STATUS_CODE } from '../helpers/statusCode';
import { Response } from 'express';
import * as _ from 'lodash';
@Controller('spark')
export class SparkController {
  constructor(private readonly sparkService: SparkService) {}
}
