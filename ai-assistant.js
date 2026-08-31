"use strict";

(() => {
  const root = document.querySelector("#ai-chat");
  if (!root) return;

  // طبقة لغات عالمية — قابلة للتوسّع لأي لغة في العالم
  const i18n = {
    ar: {
      welcome: "مرحبًا! كيف يمكنني مساعدتك في منصة ASEM؟",
      placeholder: "اكتب سؤالك هنا...",
      send: "إرسال",
      thinking: "جاري التفكير...",
      error: "تعذر الاتصال بالمساعد الآن. حاول مرة أخرى بعد قليل.",
      statusError: "حدث خطأ في الاتصال."
    },
    en: {
      welcome: "Hello! How can I assist you on ASEM platform?",
      placeholder: "Type your question here...",
      send: "Send",
      thinking: "Thinking...",
      error: "Unable to reach the assistant now. Please try again later.",
      statusError: "A connection error occurred."
    },
    fr: {
      welcome: "Bonjour ! Comment puis-je vous aider sur la plateforme ASEM ?",
      placeholder: "Écrivez votre question ici...",
      send: "Envoyer",
      thinking: "Réflexion en cours...",
      error: "Impossible de contacter l'assistant pour le moment.",
      statusError: "Une erreur de connexion s'est produite."
    }
  };

  // اكتشاف لغة المستخدم تلقائيًا
  const userLangRaw = navigator.language || "en";
  const userLang = userLangRaw.split("-")[0].toLowerCase();
  const t = i18n[userLang] || i18n.en;

  // واجهة المساعد العالمية
  root.innerHTML = `
    <div class="ai-assistant" dir="auto">
      <div class="ai-messages" id="aiMessages" role="log" aria-live="polite" aria-label="AI conversation">
        <div class="ai-message ai-message-assistant">${t.welcome}</div>
      </div>

      <form class="ai-form" id="aiForm">
        <label class="sr-only" for="aiInput">${t.placeholder}</label>
        <textarea id="aiInput" rows="2" maxlength="2000" placeholder="${t.placeholder}" required></textarea>
        <button class="btn" id="aiSend" type="submit">${t.send}</button>
      </form>

      <p class="ai-status" id="aiStatus" role="status" aria-live="polite"></p>
    </div>
  `;

  const messages = document.querySelector("#aiMessages");
  const form = document.querySelector("#aiForm");
  const input = document.querySelector("#aiInput");
  const send = document.querySelector("#aiSend");
  const status = document.querySelector("#aiStatus");

  // إضافة رسالة للمحادثة
  function addMessage(text, role) {
    const element = document.createElement("div");
    element.className = `ai-message ai-message-${role}`;
    element.textContent = text;
    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;
  }

  // استخراج الرد من الـ API
  function getReply(data) {
    if (typeof data === "string") return data;
    return (
      data?.reply ||
      data?.answer ||
      data?.message ||
      data?.text ||
      data?.content ||
      "لم تصل إجابة واضحة من المساعد."
    );
  }

  // إرسال الرسالة
  form.addEventListener("submit", async event => {
    event.preventDefault();

    const message = input.value.trim();
    if (!message || send.disabled) return;

    addMessage(message, "user");
    input.value = "";
    send.disabled = true;
    input.disabled = true;
    status.textContent = t.thinking;

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          message,
          lang: userLang,        // اللغة العالمية للمستخدم
          userAgent: navigator.userAgent,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      });

      if (!response.ok) throw new Error(`AI request failed: ${response.status}`);

      const data = await response.json();
      addMessage(getReply(data), "assistant");
      status.textContent = "";
    } catch (error) {
      console.error("ASEM AI:", error);
      addMessage(t.error, "assistant");
      status.textContent = t.statusError;
    } finally {
      send.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });
})();
