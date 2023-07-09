import { Injectable } from '@nestjs/common';
import * as SparkPost from 'sparkpost';
import { CreateJobDTO } from 'src/users/dto/create-user.dto';
const client = new SparkPost(process.env.SPARKPOST_API_KEY);

@Injectable()
export class SparkService {
  sendBulkmail(data: any) {
    console.log(data);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await client.transmissions.send({
          options: {
            click_tracking: true,
            open_tracking: true,
            inline_css: true,
          },
          content: {
            from: 'support@dynamicsdigital.info',
            subject: data.jobDetails.email_subject,
            html: data.jobDetails.mail_content,
          },
          recipients: data.users,
          return_path: data.jobDetails.return_path,
        });
        return resolve(response);
      } catch (error) {
        return reject(error);
      }
    });
  }
}
