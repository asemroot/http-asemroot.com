/**
 * AI Provider Interface
 *
 * أي نموذج أو مزود نريد إضافته إلى Son GPT
 * يجب أن يوفر نفس الواجهة.
 */

export class AIProvider {

  constructor(options = {}) {
    this.name = options.name || "unknown";
    this.model = options.model || "unknown";
  }

  async chat() {
    throw new Error(
      "AIProvider.chat() يجب أن يتم تنفيذه بواسطة المزود."
    );
  }
}


/**
 * Local Provider
 *
 * مزود تجريبي محلي لا يتصل بأي خدمة خارجية.
 * وجوده مهم لاختبار النظام قبل ربط نموذج حقيقي.
 */

export class LocalProvider extends AIProvider {

  constructor(options = {}) {

    super({
      name: "local",
      model: options.model || "local-test"
    });

  }

  async chat({
    messages = [],
    domain = "general",
    language = "ar"
  }) {

    const lastUserMessage =
      [...messages]
        .reverse()
        .find(
          message =>
            message?.role === "user"
        );

    if (!lastUserMessage) {
      return "لم تصل رسالة من المستخدم.";
    }

    return [
      "Son GPT — وضع الاختبار المحلي",
      "",
      `اللغة: ${language}`,
      `المجال: ${domain}`,
      "",
      "استلمت طلبك:",
      lastUserMessage.content,
      "",
      "هذه ليست إجابة نموذج ذكاء اصطناعي حقيقي بعد.",
      "إنها استجابة اختبار للتأكد من أن البنية تعمل."
    ].join("\n");
  }
}
