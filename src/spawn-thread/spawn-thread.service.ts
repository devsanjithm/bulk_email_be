import { Injectable } from '@nestjs/common';
import { SparkService } from '../spark/spark.service';
import { parentPort } from 'worker_threads';

@Injectable()
export class SpawnThreadService {
  stopProcess: boolean;
  constructor(private sparkClient: SparkService) {
    this.stopProcess = false;
  }

  limitAndSkip(data: Array<any>, limit: number, skip: number) {
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

      const batchSize = 3; // Adjust batch size as needed
      let offset = 0;

      while (true) {
        if (this.stopProcess) {
          offset -= batchSize;
          resolve({ message: 'Email Stopped Successfully', status: true });
          this.sse(
            'Email Stopped',
            0,
            offset + 1,
            MainThreadData?.users?.length - offset - 1,
          );
          break;
        }
        let emails = this.limitAndSkip(MainThreadData.users, batchSize, offset);

        if (emails.length === 0) {
          offset -= batchSize;
          resolve({ message: 'Email Sent Successfully', status: true });
          this.sse(
            `All emails Sent Successfully`,
            1,
            offset + 1,
            MainThreadData?.users?.length - offset - 1,
          );
          break; // No more unsent emails
        }
        // Send emails in the current batch
        try {
          let sendMail = await this.sparkClient.sendBulkmail({
            jobDetails: MainThreadData.jobDetails,
            users: emails,
          });
          console.log(sendMail);
          console.log(emails.length, offset);
          this.sse(
            `${offset + 1} mail sent. \n balance ${
              MainThreadData?.users?.length - offset - 1
            } available`,
            2,
            offset + 1,
            MainThreadData?.users?.length - offset - 1,
          );
        } catch (error) {
          reject(error);
        }
        offset += batchSize;
      }
    });
  };

  async sse(
    message: string,
    status: number,
    sentCount: number,
    balanceCount: number,
  ) {
    try {
      parentPort.postMessage({
        message,
        emailSentStatus: status,
        sentCount,
        balanceCount,
      });
    } catch (error) {
      console.log('error');
    }
  }

  stopMailService() {
    return new Promise(async (resolve, reject) => {
      this.stopProcess = true;
      resolve({ message: 'Mail Stopped SuccessFully', status: true });
    });
  }
}
