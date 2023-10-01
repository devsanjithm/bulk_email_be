import { Injectable } from '@nestjs/common';
import { SparkService } from 'src/spark/spark.service';
@Injectable()
export class SpawnThreadService {
  stopProcess: boolean;
  constructor(private sparkClient: SparkService) {
    this.stopProcess = false;
  }

  splitArrayByLimitAndSkip(array, limit:number, skip:number) {
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
      result.push(chunk[0]);
      startIndex += limit + skip;
    }

    return result;
  }

  runService = async (MainThreadData: any) => {
    console.log("--");
    
    return new Promise(async (resolve, reject) => {
      this.stopProcess = true;

      const batchSize = 1; // Adjust batch size as needed
      let offset = 0;

      while (true) {        
        if (!this.stopProcess) {
          resolve({ message: 'Email Stopped Successfully', status: true });
          break;
        }
        let emails = this.splitArrayByLimitAndSkip(
          MainThreadData.users,
          batchSize,
          offset,
        );

        console.log(MainThreadData);

        if (emails.length === 0) {          
          resolve({ message: 'Email Sent Successfully', status: false });
          break; // No more unsent emails
        }

        console.log("emaisl ===========0",emails);
        
        // Send emails in the current batch
        try {
          let sendMail = await this.sparkClient.sendBulkmail({jobDetails:MainThreadData.jobDetails,users:emails});
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
