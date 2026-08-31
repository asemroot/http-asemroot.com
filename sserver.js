import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "./src/config.js";
import { AIRouter } from "./src/ai/router.js";


dotenv.config();


const app = express();

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);


/*
 * Middleware
 */

app.use(
  express.json({
    limit: "2mb"
  })
);


/*
 * Static frontend
 */

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);


/*
 * AI Router
 */

const aiRouter =
  new AIRouter(config);


/*
 * Health
 */

app.get(
  "/api/health",
  (req, res) => {

    res.json({
      ok: true,
      project: "Son GPT",
      version: "0.2.0",
      aiProvider:
        config.ai.defaultProvider
    });

  }
);


/*
 * Chat
 */

app.post(
  "/api/chat",
  async (req, res) => {

    try {

      const {
        messages,
        domain = "general",
        language = "ar",
        provider
      } = req.body || {};


      /*
       * Validation
       */

      if (!Array.isArray(messages)) {

        return res.status(400).json({
          ok: false,
          error:
            "messages يجب أن تكون مصفوفة."
        });

      }


      if (
        messages.length >
        config.limits.maxMessages
      ) {

        return res.status(400).json({
          ok: false,
          error:
            "عدد الرسائل تجاوز الحد المسموح."
        });

      }


      for (const message of messages) {

        if (
          !message ||
          typeof message.content !== "string"
        ) {

          return res.status(400).json({
            ok: false,
            error:
              "صيغة الرسالة غير صحيحة."
          });

        }


        if (
          message.content.length >
          config.limits.maxMessageCharacters
        ) {

          return res.status(400).json({
            ok: false,
            error:
              "الرسالة طويلة جدًا."
          });

        }

      }


      /*
       * AI
       */

      const answer =
        await aiRouter.chat({

          messages,
          domain,
          language,
          provider

        });


      res.json({

        ok: true,

        answer,

        provider:
          provider ||
          config.ai.defaultProvider

      });


    } catch (error) {

      console.error(
        "Son GPT error:",
        error
      );


      res.status(500).json({

        ok: false,

        error:
          "حدث خطأ أثناء معالجة الطلب."

      });

    }

  }
);


/*
 * Start
 */

app.listen(
  config.port,
  () => {

    console.log(
      `Son GPT يعمل على http://localhost:${config.port}`
    );

  }
);
