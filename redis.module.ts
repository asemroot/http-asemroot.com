import { Global, Module } from '@nestjs/common';
import { redisClient } from './redis.client.js';

export const REDIS = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS,
      useValue: redisClient,
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
