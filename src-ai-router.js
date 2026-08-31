import {
  LocalProvider
} from "./provider.js";


/**
 * AI Router
 *
 * مسؤول عن اختيار المزود المناسب.
 *
 * لاحقًا يمكن إضافة:
 *
 * - OpenAIProvider
 * - OpenSourceProvider
 * - LocalLLMProvider
 * - CloudProvider
 * - ResearchProvider
 *
 * بدون تغيير الواجهة الأمامية.
 */

export class AIRouter {

  constructor(config) {

    this.config = config;

    this.providers = new Map();

    this.register(
      new LocalProvider({
        model: config.ai.model
      })
    );

  }


  register(provider) {

    if (!provider?.name) {
      throw new Error(
        "لا يمكن تسجيل AI Provider بدون اسم."
      );
    }

    this.providers.set(
      provider.name,
      provider
    );

  }


  getProvider(name) {

    const provider =
      this.providers.get(name);

    if (!provider) {

      throw new Error(
        `AI Provider غير موجود: ${name}`
      );

    }

    return provider;
  }


  async chat(request) {

    const providerName =
      request.provider ||
      this.config.ai.defaultProvider;

    const provider =
      this.getProvider(providerName);

    return provider.chat(request);

  }

}
