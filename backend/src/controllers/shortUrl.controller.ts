import type { Request, RequestHandler, Response } from "express";
import { nanoid } from "nanoid";
import {
  createShortUrl as persistShortUrl,
  findShortUrl,
} from "../models/shortUrl.model.js";

interface CreateShortUrlBody {
  url: string;
}

interface ShortCodeParams {
  shortCode: string;
}

export const createShortUrl: RequestHandler<
  Record<string, never>,
  unknown,
  CreateShortUrlBody
> = async (request, response) => {
  const shortCode = nanoid(8);
  const shortUrl = await persistShortUrl(request.body.url, shortCode);
  const publicUrl = process.env["PUBLIC_URL"]?.replace(/\/+$/, "");
  const host = request.get("host");

  if (!publicUrl && !host) {
    response.status(500).json({ error: "Unable to determine the public URL." });
    return;
  }

  response.status(201).json({
    shortCode: shortUrl.short_code,
    shortUrl: `${publicUrl ?? `${request.protocol}://${host}`}/${shortUrl.short_code}`,
    longUrl: shortUrl.long_url,
  });
};

export const redirectToLongUrl: RequestHandler<ShortCodeParams> = async (
  request: Request<ShortCodeParams>,
  response: Response,
) => {
  const shortUrl = await findShortUrl(request.params.shortCode);

  if (!shortUrl) {
    response.status(404).json({ error: "Short URL not found." });
    return;
  }

  if (shortUrl.expires_at && shortUrl.expires_at <= new Date()) {
    response.status(410).json({ error: "Short URL has expired." });
    return;
  }

  response.redirect(302, shortUrl.long_url);
};
