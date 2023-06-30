import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Logger } from '@nestjs/common';
import { SparkService } from './spark.service';
import { CreateSparkDto } from './dto/create-spark.dto';
import { UpdateSparkDto } from './dto/update-spark.dto';
import response from 'src/helpers/response';
import { STATUS_CODE } from 'src/helpers/statusCode';
import { Response } from 'express';
import * as _ from 'lodash';
@Controller('spark')
export class SparkController {
  constructor(private readonly sparkService: SparkService) {}

  @Post()
  async SendMail(
    @Body() createUserDto: any,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const user = await this.sparkService.sendMail(createUserDto);
      return res
        .status(STATUS_CODE.created)
        .json(
          await response(
            `Job completed successfully`,
            { user },
            STATUS_CODE.created,
            true,
            '',
          ),
        );
    } catch (error) {    
      Logger.error(error);
      return res
        .status(
          _.has(error, 'code') ? error?.code : STATUS_CODE.internalServerError,
        )
        .json(
          await response(
            `Job Failed`,
            {},
            _.has(error, 'code')
              ? error?.code
              : STATUS_CODE.internalServerError,
            false,
            error.message,
          ),
        );
    }
  }
}
