import { db } from "../db/db.js";

export function createShortUrl(longUrl: string, shortCode: string) {
  return db.orm.public.ShortUrl.create({
    long_url: longUrl,
    short_code: shortCode,
    user_id: null,
  });
}

export function findShortUrl(shortCode: string) {
  return db.orm.public.ShortUrl.where({ short_code: shortCode }).first();
}
