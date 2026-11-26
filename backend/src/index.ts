import express, { type ErrorRequestHandler } from "express";
import shortUrlRoutes from "./routes/shortUrl.routes.js";

const app = express();
const port = Number(process.env["PORT"] ?? 3000);
const host = process.env["HOST"] ?? "0.0.0.0";

app.use(express.json());

app.use("/api", (request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.sendStatus(204);
    return;
  }

  next();
});

app.get("/", (_request, response) => {
  response.json({ message: "Welcome to the URL Shortener API." });
});

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use(shortUrlRoutes);

app.use((_request, response) => {
  response.status(404).json({ error: "Not found." });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof SyntaxError && "status" in error && error.status === 400) {
    response.status(400).json({ error: "Request body must be valid JSON." });
    return;
  }

  console.error("Unhandled backend error:", error);
  response.status(500).json({ error: "An unexpected error occurred." });
};

app.use(errorHandler);

app.listen(port, host, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
