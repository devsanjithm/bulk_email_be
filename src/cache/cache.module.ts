import { CacheService } from './cache.service';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  providers: [CacheService],
})
export class redisCacheModule {}
