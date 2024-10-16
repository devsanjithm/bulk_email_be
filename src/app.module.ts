import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './helpers/jwt/jwt.stratergy';
import { AppLoggerMiddleware } from './helpers/responseTime';
import { UsersModule } from './users/users.module';
import { SparkModule } from './spark/spark.module';
import { HeaderModule } from './header/header.module';
import { redisCacheModule } from './cache/cache.module';
import { AdminModule } from './admin/admin.module';
import { BullModule } from '@nestjs/bull';
import { SpawnThreadModule } from './spawn-thread/spawn-thread.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NodeMailerPmtaService } from './node-mailer-pmta/node-mailer-pmta.service';
import { NodeMailerPmtaModule } from './node-mailer-pmta/node-mailer-pmta.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
    }),
    SparkModule,
    HeaderModule,
    redisCacheModule,
    AdminModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    SpawnThreadModule,
    EventEmitterModule.forRoot(),
    NodeMailerPmtaModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, NodeMailerPmtaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
