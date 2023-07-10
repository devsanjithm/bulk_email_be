import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key:string): Promise<string> {
    return await this.cache.get(key);
  }

  async set(key:string, value:string) {
    await this.cache.set(key, value,0);
  }
}
