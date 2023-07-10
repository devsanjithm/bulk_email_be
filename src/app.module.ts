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

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
    }),
    SparkModule,
    HeaderModule,
    redisCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
