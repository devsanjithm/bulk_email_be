import { Injectable } from '@nestjs/common';
import * as SparkPost from 'sparkpost';
const client = new SparkPost(process.env.SPARKPOST_API_KEY);

@Injectable()
export class SparkService {
  async sendMail(data: any): Promise<any> {
    console.log('ss');
    return client.transmissions.send({
      content: {
        from: 'support@dynamicsdigital.info',
        subject: 'test',
        html: 'test',
      },
      recipients: [{ address: 'apraveenkumar1245@gmail.com' }],
    });
  }

  sendBulkmail(data: Array<{ address: string }>) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await client.transmissions.send({
          content: {
            from: 'support@dynamicsdigital.info',
            subject: 'test',
            html: 'test',
          },
          recipients: data,
        });
        return resolve(response);
      } catch (error) {
        return reject(error);
      }
    });
  }
}
