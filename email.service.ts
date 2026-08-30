import { Module } from '@nestjs/common';
import { EmailService } from './email.service.js';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
> cat email.service.ts
import { Injectable } from '@nestjs/common';
import { emailQueue } from './email.queue.js';

@Injectable()
export class EmailService {
  async queueEmail(payload) {
    return emailQueue.add('sendEmail', payload);
  }
}
