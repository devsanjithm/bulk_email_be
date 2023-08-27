import { Injectable } from '@nestjs/common';
import { resolve } from 'path';

import Piscina from 'piscina';
const pool:any= "";
// const pool =  new Piscina({
//   filename: resolve(__dirname, 'workers/index.js'),
// });

@Injectable()
export class WorkerPool {
//   private pool: Piscina;
  constructor() {}

  public async sendBatchMail(data: any): Promise<any> {
    return await pool.run(data, { name: 'fib' });
  }
}
