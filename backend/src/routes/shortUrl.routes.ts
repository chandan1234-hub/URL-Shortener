import { Router } from "express";
import {
  createShortUrl,
  redirectToLongUrl,
} from "../controllers/shortUrl.controller.js";
import { validateUrl } from "../middlewares/validateUrl.middleware.js";

const router = Router();

router.post("/api/shorten", validateUrl, createShortUrl);
router.get("/:shortCode", redirectToLongUrl);

export default router;
