import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { CacheService } from 'src/cache/cache.service';
import { PrismaService } from 'src/database/prisma.service';
import { STATUS_CODE } from 'src/helpers/statusCode';
import { SparkService } from 'src/spark/spark.service';
import { CreateJobDTO } from './dto/create-user.dto';
import {worker} from 'src/WorkerThreads/worker';
@Injectable()
export class UsersService {
  constructor(
    private prismaClient: PrismaService,
    private sparkClient: SparkService,
    private cacheManager: CacheService,
  ) {}
  create(CreateUserDto: CreateJobDTO) {
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

  SendBulkMail(createJobDTO: CreateJobDTO) {
    return new Promise(async (resolve, reject) => {
      let { job_id } = createJobDTO;
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
        delete createJobDTO.job_id;
        let jobProcess = await this.prismaClient.job.update({
          where: {
            jobid: job_id,
          },
          data: createJobDTO,
        });
        let users = [];
        let newUsers = [];
        getUsers.map((ele: any) => {
          users.push({ address: ele.email_address });
        });
        if (
          createJobDTO.check_mode === 'once' &&
          createJobDTO.check_process === 'check&kill' &&
          createJobDTO.mode === 'bulk' &&
          createJobDTO.check_count.length >= 2
        ) {
          let checkCache = await this.cacheManager.get(`${job_id}`);
          if (checkCache) {
            let secondJob_Data = JSON.parse(checkCache);

            let secondJob = users.slice(
              parseInt(secondJob_Data.check_count[1], users.length),
            );
            let count = 0;
            for (let i = 0; i <= secondJob.length; i++) {
              count++;
              if (count === parseInt(createJobDTO.check_count[0]) + 1) {
                const newData = { address: createJobDTO.test_mail };
                let instance = parseInt(createJobDTO.instance);
                for (let i = 0; i < instance; i++) {
                  newUsers.push(newData);
                }
                count = 1;
              }
              if (secondJob[i]) {
                newUsers.push(secondJob[i]);
              }
            }
          } else {
            let payload: any = {
              check_count: createJobDTO.check_count,
            };
            payload = JSON.stringify(payload);
            let setCache = await this.cacheManager.set(`${job_id}`, payload);

            let firstJob = users.slice(
              0,
              parseInt(createJobDTO.check_count[1]),
            );
            let count = 0;
            for (let i = 0; i <= firstJob.length; i++) {
              count++;
              if (count === parseInt(createJobDTO.check_count[0]) + 1) {
                const newData = { address: createJobDTO.test_mail };
                let instance = parseInt(createJobDTO.instance);
                for (let i = 0; i < instance; i++) {
                  newUsers.push(newData);
                }
                count = 1;
              }
              if (firstJob[i]) {
                newUsers.push(firstJob[i]);
              }
            }
          }
        }
        if (
          createJobDTO.check_mode === 'once' &&
          createJobDTO.check_process === 'check' &&
          createJobDTO.mode === 'bulk'
        ) {
          //without killing process
          let count = 0;
          for (let i = 0; i <= users.length; i++) {
            count++;
            if (count === parseInt(createJobDTO.check_count[0]) + 1) {
              const newData = { address: createJobDTO.test_mail };
              let instance = parseInt(createJobDTO.instance);
              for (let i = 0; i < instance; i++) {
                newUsers.push(newData);
              }
              count = 1;
            }
            if (users[i]) {
              newUsers.push(users[i]);
            }
          }
        }
        if (
          createJobDTO.check_mode === 'once' &&
          createJobDTO.check_process === 'check' &&
          createJobDTO.mode === 'check'
        ) {
          //only for test mail
          newUsers.push({ address: createJobDTO.test_mail });
        }

        let MailData: any = {
          users: newUsers,
          jobDetails: createJobDTO,
        };

        // send multithread message use worker
        let workerData = {
          MailData,
          job_id,
        };
        let result = await (await worker)({
          name:"sendBatchMail",
          params:[workerData]
        })

        let sendMail = await this.sparkClient.sendBulkmail(MailData);
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
