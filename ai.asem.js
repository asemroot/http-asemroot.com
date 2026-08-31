<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="مساعد ذكي عالمي للتعلم والبرمجة والمشروعات التقنية">
  <title>المساعد العالمي</title>

  <style>
    :root{
      --bg:#0f172a;
      --card:#020617;
      --surface:#0b1120;
      --surface-2:#111827;
      --text:#e5e7eb;
      --muted:#9ca3af;
      --border:#1f2937;
      --accent:#22c55e;
      --accent-soft:rgba(34,197,94,.15);
      --danger:#ef4444;
    }

    *{
      box-sizing:border-box;
    }

    html{
      scroll-behavior:smooth;
    }

    body{
      margin:0;
      min-height:100vh;
      padding:1rem;
      background:
        radial-gradient(circle at top right, rgba(34,197,94,.08), transparent 30%),
        var(--bg);
      font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      color:var(--text);
    }

    button,
    textarea{
      font:inherit;
    }

    button{
      -webkit-tap-highlight-color:transparent;
    }

    .ai-app{
      width:100%;
      max-width:960px;
      margin:0 auto;
      background:var(--card);
      border-radius:20px;
      padding:1.25rem;
      box-shadow:0 20px 60px rgba(0,0,0,.6);
      border:1px solid rgba(148,163,184,.25);
    }

    .ai-header{
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:1rem;
      margin-bottom:1.25rem;
    }

    .ai-title{
      font-size:1.3rem;
      font-weight:800;
    }

    .ai-subtitle{
      margin-top:.25rem;
      font-size:.9rem;
      color:var(--muted);
      line-height:1.6;
    }

    .ai-status{
      display:flex;
      align-items:center;
      gap:.4rem;
      white-space:nowrap;
      font-size:.8rem;
      color:#86efac;
    }

    .status-dot{
      width:8px;
      height:8px;
      border-radius:50%;
      background:var(--accent);
      box-shadow:0 0 10px var(--accent);
    }

    .ai-domains{
      display:flex;
      flex-wrap:wrap;
      gap:.5rem;
      margin-bottom:1rem;
    }

    .ai-domain{
      padding:.45rem .75rem;
      border-radius:999px;
      border:1px solid #374151;
      font-size:.85rem;
      cursor:pointer;
      background:#020617;
      color:var(--text);
      transition:.2s ease;
    }

    .ai-domain:hover{
      border-color:#4b5563;
      transform:translateY(-1px);
    }

    .ai-domain.active{
      border-color:var(--accent);
      background:var(--accent-soft);
      color:#bbf7d0;
    }

    .ai-messages{
      min-height:300px;
      max-height:500px;
      overflow-y:auto;
      display:flex;
      flex-direction:column;
      gap:.75rem;
      padding:.9rem;
      margin-bottom:1rem;
      background:var(--surface);
      border-radius:16px;
      border:1px solid var(--border);
      scroll-behavior:smooth;
    }

    .ai-message{
      max-width:88%;
      padding:.75rem 1rem;
      border-radius:14px;
      line-height:1.8;
      white-space:pre-wrap;
      overflow-wrap:anywhere;
      font-size:.95rem;
    }

    .ai-message-assistant{
      align-self:flex-start;
      background:#020617;
      border:1px solid var(--border);
    }

    .ai-message-user{
      align-self:flex-end;
      background:var(--accent);
      color:#022c22;
      font-weight:500;
    }

    .ai-message-meta{
      display:block;
      margin-bottom:.25rem;
      font-size:.7rem;
      opacity:.65;
    }

    .ai-form{
      display:flex;
      gap:.7rem;
      align-items:flex-end;
    }

    .ai-form textarea{
      flex:1;
      resize:vertical;
      min-height:60px;
      max-height:220px;
      border:1px solid #374151;
      border-radius:14px;
      padding:.8rem;
      outline:none;
      background:#020617;
      color:var(--text);
      transition:.2s ease;
    }

    .ai-form textarea:focus{
      border-color:var(--accent);
      box-shadow:0 0 0 3px var(--accent-soft);
    }

    .ai-form .btn{
      border:0;
      cursor:pointer;
      min-height:52px;
      border-radius:14px;
      padding:0 1.1rem;
      font-weight:700;
      background:var(--accent);
      color:#022c22;
      transition:.2s ease;
    }

    .ai-form .btn:hover{
      filter:brightness(1.05);
      transform:translateY(-1px);
    }

    .ai-form .btn:disabled{
      opacity:.6;
      cursor:wait;
      transform:none;
    }

    .ai-actions{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:1rem;
      margin-top:.7rem;
    }

    .ai-footer{
      font-size:.78rem;
      color:var(--muted);
      line-height:1.6;
    }

    .clear-btn{
      border:1px solid #374151;
      background:transparent;
      color:var(--muted);
      border-radius:10px;
      padding:.4rem .7rem;
      cursor:pointer;
    }

    .clear-btn:hover{
      color:#fff;
      border-color:#4b5563;
    }

    .typing{
      display:inline-flex;
      gap:4px;
      align-items:center;
    }

    .typing span{
      width:6px;
      height:6px;
      border-radius:50%;
      background:#9ca3af;
      animation:typing 1s infinite ease-in-out;
    }

    .typing span:nth-child(2){
      animation-delay:.15s;
    }

    .typing span:nth-child(3){
      animation-delay:.3s;
    }

    @keyframes typing{
      0%,80%,100%{
        opacity:.25;
        transform:translateY(0);
      }
      40%{
        opacity:1;
        transform:translateY(-3px);
      }
    }

    @media(max-width:650px){
      body{
        padding:.5rem;
      }

      .ai-app{
        padding:.85rem;
        border-radius:16px;
      }

      .ai-header{
        flex-direction:column;
      }

      .ai-status{
        align-self:flex-start;
      }

      .ai-message{
        max-width:94%;
      }

      .ai-form{
        flex-direction:column;
      }

      .ai-form textarea,
      .ai-form .btn{
        width:100%;
      }

      .ai-form .btn{
        min-height:48px;
      }
    }
  </style>
</head>

<body>

  <main class="ai-app">

    <header class="ai-header">
      <div>
        <div class="ai-title">🤖 المساعد العالمي</div>
        <div class="ai-subtitle">
          مساعد للتعلم والبرمجة وبناء المشروعات وتطوير قدرات الإنسان.
        </div>
      </div>

      <div class="ai-status">
        <span class="status-dot"></span>
        النظام جاهز
      </div>
    </header>

    <nav class="ai-domains" aria-label="مجالات المساعدة">
      <button class="ai-domain active" data-domain="general">
        🌍 عام
      </button>

      <button class="ai-domain" data-domain="learning">
        📚 تعلم
      </button>

      <button class="ai-domain" data-domain="programming">
        💻 برمجة
      </button>

      <button class="ai-domain" data-domain="projects">
        🏗️ مشروعات
      </button>

      <button class="ai-domain" data-domain="business">
        🏢 أعمال
      </button>
    </nav>

    <section
      class="ai-messages"
      id="messages"
      aria-live="polite"
      aria-label="المحادثة">
    </section>

    <form class="ai-form" id="chatForm">

      <textarea
        id="messageInput"
        placeholder="اكتب سؤالك أو فكرتك هنا..."
        aria-label="رسالتك"
        required></textarea>

      <button
        class="btn"
        id="sendButton"
        type="submit">
        إرسال
      </button>

    </form>

    <div class="ai-actions">
      <div class="ai-footer">
        الهدف: مساعدة الإنسان على التعلم والبناء والتطور.
      </div>

      <button
        class="clear-btn"
        id="clearButton"
        type="button">
        مسح المحادثة
      </button>
    </div>

  </main>

  <script>
    "use strict";

    const messages = document.getElementById("messages");
    const form = document.getElementById("chatForm");
    const input = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");
    const clearButton = document.getElementById("clearButton");
    const domainButtons = document.querySelectorAll(".ai-domain");

    let selectedDomain = "general";
    let conversation = [];

    const STORAGE_KEY = "global_ai_conversation_v1";

    function saveConversation(){
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(conversation)
      );
    }

    function loadConversation(){
      try{
        const saved = localStorage.getItem(STORAGE_KEY);

        if(saved){
          conversation = JSON.parse(saved);

          conversation.forEach(message => {
            renderMessage(
              message.role,
              message.content,
              false
            );
          });
        }
      }catch(error){
        console.error("تعذر تحميل المحادثة:", error);
        conversation = [];
      }
    }

    function renderMessage(role, content, scroll = true){

      const message = document.createElement("div");

      message.className =
        "ai-message " +
        (role === "user"
          ? "ai-message-user"
          : "ai-message-assistant");

      const meta = document.createElement("span");

      meta.className = "ai-message-meta";
      meta.textContent =
        role === "user"
          ? "أنت"
          : "المساعد";

      const text = document.createElement("div");
      text.textContent = content;

      message.appendChild(meta);
      message.appendChild(text);

      messages.appendChild(message);

      if(scroll){
        messages.scrollTop = messages.scrollHeight;
      }

      return message;
    }

    function addMessage(role, content){

      conversation.push({
        role,
        content,
        time: Date.now()
      });

      saveConversation();
      return renderMessage(role, content);
    }

    function showTyping(){

      const message = document.createElement("div");

      message.className =
        "ai-message ai-message-assistant";

      message.id = "typingMessage";

      message.innerHTML = `
        <span class="ai-message-meta">المساعد</span>
        <div class="typing" aria-label="جاري التفكير">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;

      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping(){
      document.getElementById("typingMessage")?.remove();
    }

    function getLocalResponse(userText){

      const text = userText.toLowerCase();

      if(
        text.includes("مرحبا") ||
        text.includes("السلام") ||
        text.includes("اهلا") ||
        text.includes("أهلا")
      ){
        return "أهلًا بك 🌍\nأنا هنا لمساعدتك في التعلم والبرمجة وبناء المشروعات. اكتب لي ما تريد أن تتعلمه أو تبنيه.";
      }

      if(selectedDomain === "programming"){
        return "ممتاز 💻\nتم اختيار مجال البرمجة.\n\nفي النسخة المتصلة بنموذج ذكاء اصطناعي حقيقي، سأحلل طلبك وأساعدك في فهم الكود وتصميم الحل وكتابته واختباره.\n\nطلبك الحالي:\n" + userText;
      }

      if(selectedDomain === "learning"){
        return "رائع 📚\nتم اختيار مجال التعلم.\n\nسأساعدك على تحويل الموضوع إلى خطوات وفهم تدريجي وتمارين ومشروعات عملية.\n\nالموضوع الذي اخترته:\n" + userText;
      }

      if(selectedDomain === "projects"){
        return "ممتاز 🏗️\nتم اختيار المشروعات.\n\nسنحوّل الفكرة إلى متطلبات ثم تصميم ثم تنفيذ ثم اختبار وتحسين.\n\nفكرة المشروع:\n" + userText;
      }

      if(selectedDomain === "business"){
        return "حسنًا 🏢\nتم اختيار مجال الأعمال.\n\nيمكن للنظام مساعدتك في تحليل الفكرة والمتطلبات والعمليات والتوثيق والحلول التقنية.\n\nطلبك:\n" + userText;
      }

      return "فهمت طلبك 🌍\n\nهذه حاليًا نسخة الواجهة الأساسية للمشروع، وليست نموذج ذكاء اصطناعي متصلًا بالخادم بعد.\n\nالخطوة التالية هي توصيل هذه الواجهة بمحرك ذكاء اصطناعي حقيقي بطريقة آمنة، بحيث تصبح الإجابات ناتجة عن نموذج فعلي بدل الرد التجريبي الحالي.";
    }

    async function handleSubmit(event){

      event.preventDefault();

      const userText = input.value.trim();

      if(!userText || sendButton.disabled){
        return;
      }

      addMessage("user", userText);

      input.value = "";
      sendButton.disabled = true;

      showTyping();

      try{

        /*
          مهم:
          هذه الدالة مؤقتة فقط لإثبات عمل الواجهة.

          في المرحلة التالية سيتم استبدالها بطلب إلى Backend آمن،
          والـ Backend هو الذي يتعامل مع نموذج الذكاء الاصطناعي.
        */

        await new Promise(resolve =>
          setTimeout(resolve, 700)
        );

        const response = getLocalResponse(userText);

        removeTyping();
        addMessage("assistant", response);

      }catch(error){

        console.error(error);

        removeTyping();

        addMessage(
          "assistant",
          "حدث خطأ غير متوقع. حاول مرة أخرى."
        );

      }finally{

        sendButton.disabled = false;
        input.focus();
      }
    }

    domainButtons.forEach(button => {

      button.addEventListener("click", () => {

        domainButtons.forEach(item =>
          item.classList.remove("active")
        );

        button.classList.add("active");

        selectedDomain =
          button.dataset.domain;
      });

    });

    clearButton.addEventListener("click", () => {

      conversation = [];

      localStorage.removeItem(STORAGE_KEY);

      messages.innerHTML = "";

      addMessage(
        "assistant",
        "تم بدء محادثة جديدة. كيف يمكنني مساعدتك؟"
      );
    });

    input.addEventListener("keydown", event => {

      if(event.key === "Enter" && !event.shiftKey){

        event.preventDefault();

        form.requestSubmit();
      }

    });

    form.addEventListener(
      "submit",
      handleSubmit
    );

    loadConversation();

    if(conversation.length === 0){

      addMessage(
        "assistant",
        "مرحبًا بك 🌍\n\nأنا الواجهة الأولى لمشروع المساعد العالمي.\n\nاختر مجالًا، ثم اكتب ما تريد تعلمه أو بناءه."
      );

    }

  </script>

</body>
</html>
