import { Injectable } from '@nestjs/common';
import { SparkService } from 'src/spark/spark.service';
import axios from 'axios';
@Injectable()
export class SpawnThreadService {
  stopProcess: boolean;
  constructor(private sparkClient: SparkService) {
    this.stopProcess = false;
  }

  limitAndSkip(data:Array<any>, limit:number, skip:number) {
    if (!Array.isArray(data)) {
      throw new Error('Input data must be an array.');
    }

    if (typeof limit !== 'number' || typeof skip !== 'number') {
      throw new Error('Limit and skip must be numbers.');
    }

    if (limit < 0) {
      throw new Error('Limit cannot be negative.');
    }

    if (skip < 0) {
      throw new Error('Skip cannot be negative.');
    }

    return data.slice(skip, skip + limit);
  }

  runService = async (MainThreadData: any) => {
    return new Promise(async (resolve, reject) => {
      this.stopProcess = false;

      const batchSize = 1; // Adjust batch size as needed
      let offset = 0;

      while (true) {
        if (this.stopProcess) {
          resolve({ message: 'Email Stopped Successfully', status: true });
          break;
        }
        let emails = this.limitAndSkip(MainThreadData.users, batchSize, offset);

        if (emails.length === 0) {
          resolve({ message: 'Email Sent Successfully', status: false });
          break; // No more unsent emails
        }
        // Send emails in the current batch
        try {
          let sendMail = await this.sparkClient.sendBulkmail({
            jobDetails: MainThreadData.jobDetails,
            users: emails,
          });
          console.log(sendMail);
        } catch (error) {
          reject(error);
        }
        offset += batchSize;
      }
    });
  };

  stopMailService() {
    return new Promise(async (resolve, reject) => {
      this.stopProcess = true;
      resolve({ message: 'Mail Stopped SuccessFully', status: true });
    });
  }
}
