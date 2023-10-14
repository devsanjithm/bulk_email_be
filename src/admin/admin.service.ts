import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { STATUS_CODE } from '../helpers/statusCode';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AdminService {
  constructor(
    private prismaClient: PrismaService,
    private jwtService: JwtService,
  ) {}
  login(payload: any) {
    return new Promise(async (resolve, reject) => {
      try {
        let prevUser = await this.prismaClient.admin.findFirst({
          where: {
            email_address: payload.email_address,
          },
        });

        if (_.isEmpty(prevUser)) {
          return reject({
            message: "User Doesn't Exists!",
            code: STATUS_CODE.badRequest,
          });
        }

        const checkPassword = bcrypt.compare(
          payload.password,
          prevUser.password,
        );

        if (!checkPassword) {
          return reject({
            message: 'Wrong Password!',
            code: STATUS_CODE.badRequest,
          });
        }

        prevUser['password'] = null;
        
        return resolve({
          user: prevUser,
          token: this.jwtService.sign(prevUser),
        });
      } catch (error) {
        console.log(error)
        return reject(error);
      }
    });
  }
}
