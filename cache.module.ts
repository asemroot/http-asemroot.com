import { Module } from '@nestjs/common';
import { CacheService } from './cache.service.js';
import { CacheController } from './modules/cache/cache.controller.js';

@Module({
  controllers: [CacheController],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
