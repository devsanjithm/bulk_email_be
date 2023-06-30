import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { STATUS_CODE } from 'src/helpers/statusCode';
import { CreateJobDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaClient: PrismaService) {}
  create(CreateUserDto: CreateJobDTO) {
    console.log(CreateUserDto,"CreateUserDto");
    
    return new Promise(async (resolve, reject) => {
      try {
        let jobs = await this.prismaClient.$transaction(async (tx) => {
          let job = await tx.job.create({
            data: {
              jobid: CreateUserDto.job_id,
            },
            select: {
              id: true,
            },
          });
          let userData = [];
          CreateUserDto.user_data.map((ele) => {
            ele['job_id'] = job.id;
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

  // SendBulkMail(CreateUserDto: CreateJobDTO) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //     let getJob = await this.prismaClient.job.findFirst({where:{
  //       jobid:CreateUserDto.job_id
  //     }})

  //       
  //     } catch (error) {
  //       return reject(error);
  //     }
  //   });
  // }
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
