import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as moment from 'moment';
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

  sendBulkmail(data: any) {
    console.log(data);
    let data1 = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Mail Title</title>
        <style>
          /* Reset CSS */
          body, h1, h2, h3, h4, h5, h6, p, ol, ul, li {
            margin: 0;
            padding: 0;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          /* Main Styles */
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f2f2f2;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 10px;
          }
          .content {
            background-color: #fff;
            padding: 20px;
          }
          .content h2 {
            color: #333;
            font-size: 20px;
            margin-bottom: 10px;
          }
          .content p {
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #333;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
          }
          .footer {
            background-color: #f2f2f2;
            padding: 20px;
            text-align: center;
          }
          .footer p {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Mail Title</h1>
          </div>
          <div class="content">
            <h2>Hello,</h2>
            <p>This is the content of your email. You can include text, images, links, and other HTML elements here.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac efficitur lectus. Duis id dapibus neque. Nulla dapibus fringilla sapien at efficitur. Nam vel enim vel turpis faucibus vestibulum. Sed placerat hendrerit arcu, eu mollis tellus feugiat in.</p>
            <p>If you have any questions or need further assistance, feel free to contact us.</p>
            <a href="#" class="button">Click Me</a>
          </div>
          <div class="footer">
            <p>Best regards,<br>Your Name</p>
          </div>
        </div>
      </body>
      </html>`;
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

        const response = await client.transmissions.send({
          content: {
            from: 'support@dynamicsdigital.info',
            subject: 'Webwex testing',
            html: data1,
          },
          recipients: data.users,
        });
        return resolve(response);
      } catch (error) {
        console.log(error);

        return reject(error);
      }
    });
  }
}
