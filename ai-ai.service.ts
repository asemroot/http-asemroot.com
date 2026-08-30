import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async ask(message: string) {
    const cleanMessage = message.trim();

    /*
     * Temporary response.
     *
     * This proves the complete:
     *
     * GitHub Pages
     *      ↓
     * /api/ai
     *      ↓
     * NestJS
     *      ↓
     * AiService
     *
     * connection.
     *
     * The real AI provider can be connected here later.
     */

    return {
      success: true,
      response: `Employment AI received: ${cleanMessage}`,
    };
  }
}
