import express from "express";
import shortUrlRoutes from "./routes/shortUrl.routes.js";

const app = express();
app.use(express.json());
const port = Number(process.env.PORT ?? 3000);

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use(shortUrlRoutes);

const host = process.env.HOST ?? "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Backend listening on http://${host}:${port}`);
});
