import { Module } from '@nestjs/common';
import { LocationController } from './location.controller.js';

@Module({
  controllers: [LocationController],
})
export class LocationModule {}
> cat location.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('location')
export class LocationController {
  @Get()
  location() {
    return {
      status: 'ok',
      service: 'location',
      mode: 'test',
    };
  }
}
