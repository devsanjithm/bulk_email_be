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
  console.log("going to run service...");

  parentPort.on('message', (message) => {
    console.log('Worker received a message from the main thread:', message);
    if (message==="true") {
      spawnThreadService.stopMailService();
    }
  });
  
  const fibonacciSum = await spawnThreadService.runService(MailData);  

  parentPort.postMessage(fibonacciSum);
}

run();
