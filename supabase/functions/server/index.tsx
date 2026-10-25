import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-892fa6af/health", (c) => c.json({ status: "ok" }));

// GET /db/:key — fetch a data collection
app.get("/make-server-892fa6af/db/:key", async (c) => {
  const key = c.req.param("key");
  const value = await kv.get(key);
  return c.json({ data: value ?? null });
});

// POST /db/:key — save a data collection
app.post("/make-server-892fa6af/db/:key", async (c) => {
  const key = c.req.param("key");
  const body = await c.req.json();
  await kv.set(key, body.data);
  return c.json({ ok: true });
});

Deno.serve(app.fetch);
