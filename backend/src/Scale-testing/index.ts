import Fastify, { type FastifyError } from "fastify";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  createShortUrl as persistShortUrl,
  findShortUrl,
} from "../models/shortUrl.model.js";

const fastify = Fastify();
const port = Number(3001);
const host = process.env["HOST"] ?? "0.0.0.0";

const createShortUrlSchema = z.object({
  url: z.url({ protocol: /^https?$/ }),
});

fastify.addHook("onRequest", async (_request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  reply.header("Access-Control-Allow-Headers", "Content-Type");
});

fastify.options("/api/shorten", async (_request, reply) => {
  return reply.status(204).send();
});

fastify.get("/", async () => {
  return { message: "Welcome to the URL Shortener API." };
});

fastify.get("/health", async () => {
  return { status: "ok" };
});

fastify.post("/api/shorten", async (request, reply) => {
  const result = createShortUrlSchema.safeParse(request.body);

  if (!result.success) {
    return reply.status(400).send({
      error: "A valid HTTP or HTTPS URL is required.",
      details: result.error.issues.map((issue) => issue.message),
    });
  }

  const shortCode = nanoid(8);
  const shortUrl = await persistShortUrl(result.data.url, shortCode);
  const publicUrl = process.env["PUBLIC_URL"]?.replace(/\/+$/, "");
  const hostHeader = request.headers.host;

  if (!publicUrl && !hostHeader) {
    return reply.status(500).send({
      error: "Unable to determine the public URL.",
    });
  }

  return reply.status(201).send({
    shortCode: shortUrl.short_code,
    shortUrl: `${publicUrl ?? `${request.protocol}://${hostHeader}`}/${shortUrl.short_code}`,
    longUrl: shortUrl.long_url,
  });
});

fastify.get<{ Params: { shortCode: string } }>(
  "/:shortCode",
  async (request, reply) => {
    const shortUrl = await findShortUrl(request.params.shortCode);

    if (!shortUrl) {
      return reply.status(404).send({ error: "Short URL not found." });
    }

    if (shortUrl.expires_at && shortUrl.expires_at <= new Date()) {
      return reply.status(410).send({ error: "Short URL has expired." });
    }

    return reply.redirect(shortUrl.long_url, 302);
  },
);

fastify.setNotFoundHandler(async (_request, reply) => {
  return reply.status(404).send({ error: "Not found." });
});

fastify.setErrorHandler(async (error: FastifyError, _request, reply) => {
  fastify.log.error(error);

  if (error.statusCode === 400) {
    return reply.status(400).send({
      error: "Request body must be valid JSON.",
    });
  }

  return reply.status(500).send({
    error: "An unexpected error occurred.",
  });
});

try {
  await fastify.listen({ port, host });
  console.log(`Fastify backend listening on http://localhost:${port}`);
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}
