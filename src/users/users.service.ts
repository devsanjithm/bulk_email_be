import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { PrismaService } from 'src/database/prisma.service';
import { STATUS_CODE } from 'src/helpers/statusCode';
import { SparkService } from 'src/spark/spark.service';
import { CreateJobDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prismaClient: PrismaService,
    private sparkClient: SparkService,
  ) {}
  create(CreateUserDto: CreateJobDTO) {
    console.log(CreateUserDto, 'CreateUserDto');

    return new Promise(async (resolve, reject) => {
      try {
        let jobs = await this.prismaClient.$transaction(async (tx) => {
          let job = await tx.job.create({
            data: {
              jobid: CreateUserDto.job_id,
            },
            select: {
              jobid: true,
            },
          });
          let userData = [];
          CreateUserDto.user_data.map((ele) => {
            ele['job_id'] = job.jobid;
            userData.push(ele);
          });
          let users = await tx.users.createMany({
            data: userData,
          });
          return users;
        });
        return resolve({
          statusCode: STATUS_CODE.created,
          message: 'Create User Success',
          data: jobs,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  SendBulkMail(job_id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        let getUsers = await this.prismaClient.users.findMany({
          where: {
            job_id,
          },
        });
        if (_.isEmpty(getUsers)) {
          return reject({
            statusCode: STATUS_CODE.notFound,
            message: 'No Users Found',
            data: {},
          });
        }
        let users = [];
        getUsers.map((ele) => {
          users.push({ address: ele.email_address });
        });
        let sendMail = await this.sparkClient.sendBulkmail(users);
        return resolve({
          statusCode: STATUS_CODE.success,
          message: 'Mail Sent Successfully',
          data: sendMail,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
