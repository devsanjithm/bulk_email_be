import { Injectable } from '@nestjs/common';
import * as SparkPost from 'sparkpost';
import { CreateJobDTO } from 'src/users/dto/create-user.dto';
import * as CryptoJS from 'crypto-js';
import * as quotedPrintable from 'quoted-printable';
import * as base64 from 'base64-js';
const client = new SparkPost(process.env.SPARKPOST_API_KEY);

@Injectable()
export class SparkService {
  HeaderEncryption(headerValue: string, creativeType: string): string {
    // Choose an encryption key based on the creative type
    let encryptionKey = 'encryptionKey1';
    // Encrypt the header value using the encryption key
    const encryptedValue = CryptoJS.AES.encrypt(
      headerValue,
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
    console.log(data);
    return new Promise(async (resolve, reject) => {
      try {
        let encryptedHeader = this.HeaderEncryption(
          data.header_content,
          data.creative_type,
        );
        console.log(encryptedHeader);
        
        const response = await client.transmissions.send({
          options: {
            click_tracking: true,
            open_tracking: true,
            inline_css: true,
          },
          content: {
            from: `<${data.jobDetails.email_from}> '+' ${data.jobDetails.from_email}`,
            subject: data.jobDetails.email_subject,
            html: data.jobDetails.mail_content,
            // headers: String(encryptedHeader),
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
