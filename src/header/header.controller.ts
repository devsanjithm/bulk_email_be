import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Logger,
} from '@nestjs/common';
import { HeaderService } from './header.service';
import { CreateHeaderDto, HeaderListDto } from './dto/create-header.dto';
import { UpdateHeaderDto } from './dto/update-header.dto';
import { Response } from 'express';
import response from '../helpers/response';
import { STATUS_CODE } from '../helpers/statusCode';
import * as _ from 'lodash';
import listParser, { prismaFilterOptions } from '../helpers/objectParser';

@Controller('header')
export class HeaderController {
  constructor(private readonly headerService: HeaderService) {}

  @Post()
  async create(
    @Body() createHeaderDto: CreateHeaderDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const header = await this.headerService.create(createHeaderDto);
      return res
        .status(STATUS_CODE.success)
        .json(
          await response(
            'Create Header Success',
            header,
            STATUS_CODE.success,
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
            `Create Header Failed`,
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

  @Post('list')
  async findAll(@Body() headerList: HeaderListDto, @Res() res: Response) {
    try {
      const payload: prismaFilterOptions = listParser(headerList);
      const header_list = await this.headerService.findAll(payload);
      return res
        .status(STATUS_CODE.success)
        .json(
          await response(
            'Get Header Success',
            header_list,
            STATUS_CODE.success,
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
            `Get Header Failed`,
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

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const header_list = await this.headerService.findOne(id);
      return res
        .status(STATUS_CODE.success)
        .json(
          await response(
            'Get Header Success',
            header_list,
            STATUS_CODE.success,
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
            `Get Header Failed`,
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHeaderDto: UpdateHeaderDto,
    @Res() res: Response,
  ) {
    try {
      const header_list = await this.headerService.update(id, updateHeaderDto);
      return res
        .status(STATUS_CODE.success)
        .json(
          await response(
            'Update Header Success',
            header_list,
            STATUS_CODE.success,
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
            `Update Header Failed`,
            {},
            _.has(error, 'code')
              ? error?.code
              : STATUS_CODE.internalServerError,
            false,
            error.message,
          ),
        );
    }
    return;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.headerService.remove(+id);
  }
}
