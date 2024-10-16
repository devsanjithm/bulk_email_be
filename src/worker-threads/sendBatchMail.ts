import { NestFactory } from '@nestjs/core';
import { workerData, parentPort } from 'worker_threads';
import { AppModule } from '../app.module';
import { SpawnThreadService } from '../spawn-thread/spawn-thread.service';
import { UsersService } from '../users/users.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);
  const spawnThreadService = app.get(SpawnThreadService);

  const MailData = workerData;

  userService.checkMainThread();
  console.log('going to run service...');

  parentPort.on('message', (message) => {
    console.log('Worker received a message from the main thread:', message);
    if (message) {
      spawnThreadService.stopMailService();
    }
  });

  spawnThreadService
    .runService(MailData)
    .then((data) => {
      parentPort.postMessage(data);
      parentPort.close;
    })
    .catch((error) => {
      console.error(error);
      parentPort.close();
    });
}

run();
