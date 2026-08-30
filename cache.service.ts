import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS } from './redis.module.js';

@Injectable()
export class CacheService {
  constructor(
    @Inject(REDIS)
    private readonly redis: Redis,
  ) {}

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      return this.redis.set(key, value, 'EX', ttl);
    }

    return this.redis.set(key, value);
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async delete(key: string) {
    return this.redis.del(key);
  }

  async ping() {
    return this.redis.ping();
  }
}
