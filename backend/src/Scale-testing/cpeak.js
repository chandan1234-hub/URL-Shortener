import cpeak, { cors, parseJSON } from "cpeak";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  createShortUrl as persistShortUrl,
  findShortUrl,
} from "../models/shortUrl.model.js";

const server = cpeak();
const port = Number(process.env.CPEAK_PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";

const createShortUrlSchema = z.object({
  url: z.url({ protocol: /^https?$/ }),
});

server.beforeEach(parseJSON({ limit: 1024 * 1024 }));
server.beforeEach(cors({
  origin: "*",
  methods: "POST, OPTIONS",
  allowedHeaders: "Content-Type",
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

server.route("get", "/", async (_request, response) => {
  return response.json({ message: "Welcome to the URL Shortener API." });
});

server.route("get", "/health", async (_request, response) => {
  return response.json({ status: "ok" });
});

server.route("post", "/api/shorten", async (request, response) => {
  const result = createShortUrlSchema.safeParse(request.body);

  if (!result.success) {
    return response.status(400).json({
      error: "A valid HTTP or HTTPS URL is required.",
      details: result.error.issues.map((issue) => issue.message),
    });
  }

  const shortCode = nanoid(8);
  const shortUrl = await persistShortUrl(result.data.url, shortCode);
  const publicUrl = process.env.PUBLIC_URL?.replace(/\/+$/, "");
  const hostHeader = request.headers.host;

  if (!publicUrl && !hostHeader) {
    return response.status(500).json({
      error: "Unable to determine the public URL.",
    });
  }

  const protocol = request.socket.encrypted ? "https" : "http";

  return response.status(201).json({
    shortCode: shortUrl.short_code,
    shortUrl: `${publicUrl ?? `${protocol}://${hostHeader}`}/${shortUrl.short_code}`,
    longUrl: shortUrl.long_url,
  });
});

server.route("get", "/:shortCode", async (request, response) => {
  const shortUrl = await findShortUrl(request.params.shortCode);

  if (!shortUrl) {
    return response.status(404).json({ error: "Short URL not found." });
  }

  if (shortUrl.expires_at && shortUrl.expires_at <= new Date()) {
    return response.status(410).json({ error: "Short URL has expired." });
  }

  return response.redirect(shortUrl.long_url);
});

server.fallback(async (_request, response) => {
  return response.status(404).json({ error: "Not found." });
});

server.handleErr((error, _request, response) => {
  console.error("Unhandled backend error:", error);

  if (error instanceof SyntaxError) {
    return response.status(400).json({
      error: "Request body must be valid JSON.",
    });
  }

  return response.status(500).json({
    error: "An unexpected error occurred.",
  });
});

server.listen(port, host, () => {
  console.log(`Cpeak backend listening on http://localhost:${port}`);
});
