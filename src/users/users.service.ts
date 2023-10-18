import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../database/prisma.service';
import { STATUS_CODE } from '../helpers/statusCode';
import { SparkService } from '../spark/spark.service';
import { CreateJobDTO } from './dto/create-user.dto';
import { Worker, isMainThread } from 'worker_threads';
import { EventEmitter2 } from '@nestjs/event-emitter';

import workerThreadFilePath from '../worker-threads/config';

@Injectable()
export class UsersService {
  worker: Worker;
  constructor(
    private prismaClient: PrismaService,
    private sparkClient: SparkService,
    private eventEmitter: EventEmitter2,
    private cacheManager: CacheService, // private workerPool: WorkerPool,
  ) {
    this.worker = null;
  }
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
        console.log(getUsers);

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

        try {
          this.worker = new Worker(workerThreadFilePath, {
            workerData: MailData,
          });
          this.worker.on('message', (result) => {
            console.log(result);

            if (_.has(result, 'message') && _.has(result, 'emailSentStatus')) {
              console.log('getting the event');

              this.eventEmitter.emit('sse.event', {
                message: result.message,
                emailSentStatus: result.emailSentStatus,
                sentCount:result.sentCount,
                balanceCount:result.balanceCount
              });
            } else {
              console.log(
                `$Email Sent Successfully : ${JSON.stringify(result)}`,
              );
            }
          });

          this.worker.on('error', (error) => {
            console.log(error);
          });
          this.worker.on('exit', (exitCode) => {
            console.log(`It exited with code ${exitCode}`);
          });
        } catch (error) {
          console.error(error);
          reject({ error: 'An error occurred' });
        }

        // let sendMail = await this.sparkClient.sendBulkmail(MailData);
        // console.log(sendMail);

        return resolve({
          statusCode: STATUS_CODE.success,
          message: 'Mail Sent Successfully',
          data: 'sendMail',
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Try to do a function with given code
   */
  // sendMail() {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       // Find unsent emails in batches
  //       const batchSize = 100; // Adjust batch size as needed
  //       let offset = 0;

  //       while (true) {
  //         const emails = await Email.find({ sent: false })
  //           .limit(batchSize)
  //           .skip(offset);

  //         if (emails.length === 0) {
  //           break; // No more unsent emails
  //         }

  //         // Send emails in the current batch
  //         for (const email of emails) {
  //           // Implement your email sending logic here (e.g., using Nodemailer)
  //           // Set email.sent to true after successful sending
  //           email.sent = true;
  //           await email.save();
  //         }

  //         offset += batchSize;
  //       }

  //       resolve({ message: 'Email sending completed' });
  //     } catch (error) {
  //       console.error(error);
  //       reject({ error: 'An error occurred' });
  //     }
  //   });
  // }

  // stopEmail() {
  //   return new Promise(async (resolve, reject) => {
  //     // Set the stopSending flag to true
  //     stopSending = true;
  //     resolve({ message: 'Email sending stopped' });

  //     // Inside the sending loop
  //     for (const email of emails) {
  //       // Check if the stopSending flag is set
  //       if (stopSending) {
  //         // Stop the sending process gracefully
  //         break;
  //       }

  //       // Implement your email sending logic here (e.g., using Nodemailer)
  //       // Set email.sent to true after successful sending
  //       email.sent = true;
  //       await email.save();
  //     }
  //   });
  // }

  checkMainThread() {
    Logger.log(
      'Are we on the Main Thread here ?',
      isMainThread ? 'Yes.' : 'No.',
    );
  }

  stopMailProcess() {
    this.worker.postMessage(true);
    return { message: 'Loop Stopped' };
  }
}
