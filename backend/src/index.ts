import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

const host = process.env.HOST ?? "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Backend listening on http://${host}:${port}`);
});
