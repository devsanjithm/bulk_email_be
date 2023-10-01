import { Injectable } from '@nestjs/common';
import { SparkService } from 'src/spark/spark.service';
@Injectable()
export class SpawnThreadService {
  stopProcess: boolean;
  constructor(private sparkClient: SparkService) {
    this.stopProcess = false;
  }

  splitArrayByLimitAndSkip(array, limit, skip) {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }

    if (
      typeof limit !== 'number' ||
      limit <= 0 ||
      typeof skip !== 'number' ||
      skip < 0
    ) {
      throw new Error('Invalid limit or skip values');
    }

    const result = [];
    let startIndex = 0;

    while (startIndex < array.length) {
      const chunk = array.slice(startIndex, startIndex + limit);
      result.push(chunk);
      startIndex += limit + skip;
    }

    return result;
  }

  runService = async (MainThreadData: any) => {
    return new Promise(async (resolve, reject) => {
      this.stopProcess = true;

      const batchSize = 40; // Adjust batch size as needed
      let offset = 0;

      while (true) {
        if (!this.stopProcess) {
          resolve({ message: 'Email Stopped Successfully', status: true });
          break;
        }
        let emails = this.splitArrayByLimitAndSkip(
          MainThreadData,
          offset,
          batchSize,
        );

        if (emails.length === 0) {
          resolve({ message: 'Email Sent Successfully', status: false });
          break; // No more unsent emails
        }

        // Send emails in the current batch
        try {
          let sendMail = await this.sparkClient.sendBulkmail(emails);
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
