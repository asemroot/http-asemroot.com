import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AiService } from './ai.service.js';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
  ) {}

  @Post()
  async askAI(
    @Body() body: { message?: string },
  ) {
    if (
      typeof body?.message !== 'string' ||
      !body.message.trim()
    ) {
      throw new BadRequestException(
        'AI message cannot be empty.',
      );
    }

    return this.aiService.ask(
      body.message,
    );
  }
}
