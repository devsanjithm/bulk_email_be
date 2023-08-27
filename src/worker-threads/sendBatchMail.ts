import { SparkService } from '../spark/spark.service';
export default async function sendBatchMail(data) {
  let sparkClient = new SparkService();
  let response = await sparkClient.sendBulkmail(data);
  return response;
}
