const { workerData, parentPort } = require('worker_threads');
const { SparkService } = require('./spark/spark.service.ts');

const sparkClient = new SparkService();
let stopProcess = false;

function splitArrayByLimitAndSkip(array, limit, skip) {
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
    result.push(chunk);
    startIndex += limit + skip;
  }

  return result;
}

const runService = async () => {
  return new Promise(async (resolve, reject) => {
    let MainThreadData = workerData;

    const batchSize = 40; // Adjust batch size as needed
    let offset = 0;

    while (true) {
      if (!stopProcess) {
        resolve({ message: 'Email Stopped Successfully', status: true });
        break;
      }
      let emails = splitArrayByLimitAndSkip(MainThreadData, offset, batchSize);

      if (emails.length === 0) {
        resolve({ message: 'Email Sent Successfully', status: false });
        break; // No more unsent emails
      }

      // Send emails in the current batch
      try {
        let sendMail = await sparkClient.sendBulkmail(emails);
        console.log(sendMail);
      } catch (error) {
        reject(error);
      }
      offset += batchSize;
    }
    return;
  });
};

const run = async () => {
  parentPort.on('message', (message) => {
    console.log('Worker received a message from the main thread:', message);
    if (message) {
      console.log('Email is stopped');

      stopProcess = message;
    }
    // Perform actions based on the received message
  });
  const result = await runService();
  console.log(JSON.stringify(result));
  parentPort.postMessage({ messaage: 'Email Sent Successfully', status: true });
};

run().catch((err) => console.error(err));
