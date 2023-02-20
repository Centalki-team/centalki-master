import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    this.set = this.cache.set;
    this.get = this.cache.get;
    this.del = this.cache.del;
    this.reset = this.cache.reset;
    this.wrap = this.cache.wrap;
  }
  set: (key: string, value: unknown, ttl?: number) => Promise<void>;
  get: <T>(key: string) => Promise<T | undefined>;
  del: (key: string) => Promise<void>;
  reset: () => Promise<void>;
  wrap: <T>(key: string, fn: () => Promise<T>, ttl?: number) => Promise<T>;
}
