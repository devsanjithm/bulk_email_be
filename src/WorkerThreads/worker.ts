// worker.ts 💼
import { define } from 'nanolith';
import { SparkService } from 'src/spark/spark.service';
export const worker = define({
  sendBatchMail: async (data: any) => {
    let sparkClient = new SparkService();
    let response = await sparkClient.sendBulkmail(data);
    return response;
  },
});
