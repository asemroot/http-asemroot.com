import http from "node:http";
import { URL } from "node:url";

 HEAD
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3000);

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 3002);
 (Improve layout and fix responsive design)

const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(
    req.url || "/",
    `https://asemroot.com`
);

    try {
        // --------------------------------------------------
        // Health check
        // --------------------------------------------------

        if (
            req.method === "GET" &&
            url.pathname === "/api/health"
        ) {
            return sendJson(res, 200, {
                status: "ok",
                service: "employment-ai",
                timestamp: new Date().toISOString()
            });
        }

        // --------------------------------------------------
        // AI endpoint
        // --------------------------------------------------

        if (
            req.method === "POST" &&
            url.pathname === "/api/ai"
        ) {
            const body = await readJsonBody(req);

            if (
                !body ||
                typeof body.message !== "string" ||
                !body.message.trim()
            ) {
                return sendJson(res, 400, {
                    success: false,
                    error: "AI message cannot be empty."
                });
            }

            const message = body.message.trim();

            /*
             * This is deliberately a backend placeholder.
             *
             * Put your actual AI provider call here.
             * API keys must remain on the server and must
             * never be placed in ai/ai.js or other frontend files.
             */

            const aiResponse = await processAIMessage(message);

            return sendJson(res, 200, {
                success: true,
                response: aiResponse
            });
        }

        // --------------------------------------------------
        // Location endpoint
        // --------------------------------------------------

        if (
            req.method === "GET" &&
            url.pathname === "/api/location"
        ) {
            return sendJson(res, 200, {
                success: true,
                location: {
                    hostname: req.headers.host,
                    ip: req.socket.remoteAddress
                }
            });
        }

        // --------------------------------------------------
        // Jobs endpoint
        // --------------------------------------------------

        if (
            req.method === "GET" &&
            url.pathname === "/api/jobs"
        ) {
            return sendJson(res, 200, {
                success: true,
                jobs: []
            });
        }
// --------------------------------------------------
        // Platform data endpoints
        // --------------------------------------------------

        if (
            req.method === "GET" &&
            url.pathname === "/api/tourism"
        ) {
            return sendJson(res, 200, {
                success: true,
                data: []
            });
        }

        if (
            req.method === "GET" &&
            url.pathname === "/api/businesses"
        ) {
            return sendJson(res, 200, {
                success: true,
                data: []
            });
        }

        if (
            req.method === "GET" &&
            url.pathname === "/api/products"
        ) {
            return sendJson(res, 200, {
                success: true,
                data: []
            });
        }

        if (
            req.method === "GET" &&
            url.pathname === "/api/projects"
        ) {
            return sendJson(res, 200, {
                success: true,
                data: []
            });
        }
        // --------------------------------------------------
        // 404
        // --------------------------------------------------

        return sendJson(res, 404, {
            success: false,
            error: "API endpoint not found."
        });
    } catch (error) {
        console.error("API error:", error);

        return sendJson(res, 500, {
            success: false,
            error: "Internal server error."
        });
    }
});


// ==========================================================
// AI processing
// ==========================================================

async function processAIMessage(message) {
    /*
     * Temporary response so you can test the complete
     * frontend -> backend connection immediately.
     *
     * Replace this function with your real AI provider.
     */

    return `Employment AI received: ${message}`;
}


// ==========================================================
// Read JSON request body
// ==========================================================

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.setEncoding("utf8");

        req.on("data", chunk => {
            body += chunk;

            // Prevent excessively large requests.
            if (body.length > 1_000_000) {
                reject(new Error("Request body is too large."));
                req.destroy();
            }
        });

        req.on("end", () => {
            if (!body.trim()) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error("Invalid JSON request."));
            }
        });

        req.on("error", reject);
    });
}


// ==========================================================
// JSON response
// ==========================================================

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
    });

    res.end(JSON.stringify(data));
}


// ==========================================================
// CORS
// ==========================================================

function setCorsHeaders(res) {
    res.setHeader(
        "Access-Control-Allow-Origin",
        process.env.CORS_ORIGIN || "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
}


// ==========================================================
// Server errors
// ==========================================================

server.on("error", error => {
    console.error("Server error:", error);

    if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
    }

    process.exit(1);
});


// ==========================================================
// Start
// ==========================================================

server.listen(PORT, HOST, () => {
    console.log("======================================");
    console.log(" Employment AI Backend");
    console.log("======================================");
    console.log(`Server:   http://${HOST}:${PORT}`);
    console.log(`Health:   http://${HOST}:${PORT}/api/health`);
    console.log(`AI:       http://${HOST}:${PORT}/api/ai`);
    console.log(`Location: http://${HOST}:${PORT}/api/location`);
    console.log("======================================");
});


// ==========================================================
// Graceful shutdown
// ==========================================================

function shutdown() {
    console.log("Shutting down Employment AI backend...");

    server.close(() => {
        console.log("Server stopped.");
        process.exit(0);
    });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
