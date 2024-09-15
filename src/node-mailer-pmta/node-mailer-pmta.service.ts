import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import { SparkService } from 'src/spark/spark.service';
console.log(nodemailer);

@Injectable()
export class NodeMailerPmtaService {
  private transporter;

  constructor(private readonly sparkService: SparkService) {
    // Use nodemailer-for-pmta transport
    this.transporter = nodemailer.createTransport({
      host: 'pmta.royalgadgethouse.online ', // Replace with your PowerMTA host
      port: 2525, // Adjust the port according to your PowerMTA configuration
      secure: false,
      auth: {
        user: 'pmtasmtpuser', // Replace with your PowerMTA username
        pass: 'reset@678', // Replace with your PowerMTA password
      },
      // tls: {
      //   rejectUnauthorized: false,
      // },
    });
  }

  async sendBulkmail(data: any) {
    console.log(data);
    
    return new Promise(async (resolve, reject) => {
      try {
        let encryptedMailContent = this.sparkService.contentEncryption(
          data.jobDetails.mail_content,
          data.jobDetails.creative_type,
        );

        const sender = {
          email:data.jobDetails.from_email ,
          name:data.jobDetails.email_from ,
        };
        console.log('go to PMTA', data);

        // Use nodemailer to send the email
        const response = await this.transporter.sendMail({
          from: `"${sender.name}" <${sender.email}>`,
          subject: data.jobDetails.email_subject,
          html: data.jobDetails.mail_content,
          headers: {
            'X-Custom-Header': data.jobDetails.header_content,
            'X-Encrypted-HTML': encryptedMailContent,
          },
          to: data.users,
        });
        console.log(response, 'response==');
        return resolve(response);
      } catch (error) {
        console.log(error, 'ERROr from Nodemailer');
        return reject(error);
      }
    });
  }
}
