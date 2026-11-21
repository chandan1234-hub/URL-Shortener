import type { RequestHandler } from "express";
import { z } from "zod";

export const createShortUrlSchema = z.object({
  url: z.url({ protocol: /^https?$/ }),
});

export const validateUrl: RequestHandler = (request, response, next) => {
  const result = createShortUrlSchema.safeParse(request.body);

  if (!result.success) {
    response.status(400).json({
      error: "A valid HTTP or HTTPS URL is required.",
      details: result.error.issues.map((issue) => issue.message),
    });
    return;
  }

  request.body = result.data;
  next();
};
