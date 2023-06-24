import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateJobDTO, CreateUserDto } from './dto/create-user.dto';
import response from 'src/helpers/response';
import { STATUS_CODE } from 'src/helpers/statusCode';
import { Response } from 'express';
import * as _ from 'lodash';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateJobDTO,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const user = await this.usersService.create(createUserDto);
      return res
        .status(STATUS_CODE.created)
        .json(
          await response(
            `Create User Success`,
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
            `Create User Failed`,
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

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

}
