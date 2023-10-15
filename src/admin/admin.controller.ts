import {
  Controller,
  Post,
  Body,
  Logger,
  Res,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import response from '../helpers/response';
import { STATUS_CODE } from '../helpers/statusCode';
import { Response } from 'express';
import * as _ from 'lodash';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async create(
    @Body() createUserDto: any,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const user = await this.adminService.login(createUserDto);
      return res
        .status(STATUS_CODE.created)
        .json(
          await response(
            `User logged in Successfully`,
            { user },
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
            `Login Failed`,
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
