import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as moment from 'moment';
import * as SparkPost from 'sparkpost';
import { CreateJobDTO } from 'src/users/dto/create-user.dto';
import * as CryptoJS from 'crypto-js';
import * as quotedPrintable from 'quoted-printable';
import * as base64 from 'base64-js';
const client = new SparkPost(process.env.SPARKPOST_API_KEY);

@Injectable()
export class SparkService {
  contentEncryption(mailContent: string, creativeType: string): string {
    // Choose an encryption key based on the creative type
    let encryptionKey = 'encryptionKey1';
    // Encrypt the header value using the encryption key
    const encryptedValue = CryptoJS.AES.encrypt(
      mailContent,
      encryptionKey,
    ).toString();
    let encodedValue: string;
    if (creativeType === 'QuatedPrinatble') {
      encodedValue = quotedPrintable.encode(encryptedValue);
    } else if (creativeType === 'base64') {
      const encryptedBytes = base64.toByteArray(encryptedValue);
      encodedValue = base64.fromByteArray(encryptedBytes);
    } else if ((creativeType = 'Normal')) {
      encodedValue = encryptedValue;
    }
    return encodedValue;
  }

  sendBulkmail(data: any) {
    console.log(data,'sparkservice34');
    return new Promise(async (resolve, reject) => {
      try {
        const messageData = await axios.get(
          'https://api.sparkpost.com/api/v1/metrics/deliverability/domain?from=2023-07-04T08:00&metrics=count_targeted,count_sent',
          {
            headers: {
              Authorization: process.env.SPARKPOST_API_KEY,
            },
          },
        );
        console.log(messageData.data);
        let encryptedMailContent = this.contentEncryption(
          data.jobDetails.mail_content,
          data.jobDetails.creative_type,
        );
        console.log(encryptedMailContent);
        const response = await client.transmissions.send({
          options: {
            click_tracking: true,
            open_tracking: true,
            inline_css: true,
          },
          content: {
            from:"support@dynamicsdigital.info",
            subject: data.jobDetails.email_subject,
            html: data.jobDetails.mail_content,
            // headers: {
            //   'Content-Type':data.jobDetails.header_type,
            //   'X-Custom-Header': data.jobDetails.header_content,
            //  'X-Encrypted-HTML':encryptedMailContent
            // },
          },
          recipients: data.users,
          // return_path: data.jobDetails.return_path, //valid domian only supported
        });
        return resolve(response);
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }
}
