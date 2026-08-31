<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>مساعد الذكاء الاصطناعي العالمي</title>
  <style>
    :root{
      --bg:#0f172a;
      --card:#020617;
      --surface:#0b1120;
      --text:#e5e7eb;
      --accent:#22c55e;
      --accent-soft:rgba(34,197,94,.15);
    }

    body{
      margin:0;
      padding:1.5rem;
      background:var(--bg);
      font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      color:var(--text);
    }

    .ai-app{
      max-width:960px;
      margin:0 auto;
      background:var(--card);
      border-radius:20px;
      padding:1.5rem;
      box-shadow:0 20px 60px rgba(0,0,0,.6);
      border:1px solid rgba(148,163,184,.4);
    }

    .ai-header{
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:1rem;
      margin-bottom:1.25rem;
    }

    .ai-title{
      font-size:1.2rem;
      font-weight:700;
    }

    .ai-subtitle{
      font-size:.9rem;
      color:#9ca3af;
    }

    .ai-status{
      font-size:.85rem;
      color:#6b7280;
      text-align:left;
    }

    .ai-domains{
      display:flex;
      flex-wrap:wrap;
      gap:.5rem;
      margin-bottom:1rem;
    }

    .ai-domain{
      padding:.4rem .7rem;
      border-radius:999px;
      border:1px solid #374151;
      font-size:.85rem;
      cursor:pointer;
      background:#020617;
      color:#e5e7eb;
    }

    .ai-domain.active{
      border-color:var(--accent);
      background:var(--accent-soft);
      color:#bbf7d0;
    }

    .ai-messages{
      min-height:220px;
      max-height:420px;
      overflow-y:auto;
      display:flex;
      flex-direction:column;
      gap:.75rem;
      padding:.9rem;
      margin-bottom:1rem;
      background:var(--surface);
      border-radius:16px;
      border:1px solid #1f2937;
    }

    .ai-message{
      max-width:88%;
      padding:.7rem 1rem;
      border-radius:14px;
      line-height:1.7;
      white-space:pre-wrap;
      overflow-wrap:anywhere;
      font-size:.95rem;
    }

    .ai-message-assistant{
      align-self:flex-start;
      background:#020617;
      border:1px solid #1f2937;
    }

    .ai-message-user{
      align-self:flex-end;
      background:var(--accent);
      color:#022c22;
      font-weight:500;
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
      border:1px solid #374151;
      border-radius:14px;
      padding:.8rem;
      font:inherit;
      background:#020617;
      color:var(--text);
    }

    .ai-form .btn{
      border:0;
      cursor:pointer;
      min-height:52px;
      border-radius:14px;
      padding:0 1.1rem;
      font:inherit;
      font-weight:600;
      background:var(--accent);
      color:#022c22;
    }

    .ai-form button:disabled{
      opacity:.6;
      cursor:wait;
    }

    .ai-footer{
      margin-top:.6rem;
      font-size:.8rem;
      color
