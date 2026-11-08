import express from "express";
import dotenv from "dotenv";
import { randomUUID, timingSafeEqual } from "node:crypto";
import {
  readFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  renameSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  normalizePhone,
  mergeProvider,
  exotelRequest,
  terminal,
} from "./calls.js";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({
  path: [resolve(root, ".env"), resolve(root, "../.env")],
  quiet: true,
});
const config = {
  sid: process.env.EXOTEL_ACCOUNT_SID,
  key: process.env.EXOTEL_API_KEY,
  token: process.env.EXOTEL_API_TOKEN,
  host: process.env.EXOTEL_API_HOST || "api.exotel.com",
};
if (!["api.exotel.com", "api.in.exotel.com"].includes(config.host))
  throw new Error("Unsupported Exotel API host");
const agentPhone = process.env.EXOTEL_AGENT_NUMBER || "";
const callerId = process.env.EXOTEL_CALLER_ID || "";
const approved = (process.env.EXOTEL_ALLOWED_NUMBERS || "")
  .split(",")
  .filter(Boolean)
  .map(normalizePhone);
const configured = !!(
  config.sid &&
  config.key &&
  config.token &&
  agentPhone &&
  callerId &&
  approved.length
);
const runtime = process.env.CALLS_DATA_DIR
  ? resolve(process.env.CALLS_DATA_DIR)
  : resolve(root, ".runtime");
mkdirSync(runtime, { recursive: true, mode: 0o700 });
const storePath = resolve(runtime, "calls.json");
let calls = existsSync(storePath)
  ? JSON.parse(readFileSync(storePath, "utf8"))
  : [];
const persist = () => {
  writeFileSync(storePath + ".tmp", JSON.stringify(calls, null, 2), {
    mode: 0o600,
  });
  renameSync(storePath + ".tmp", storePath);
};
const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "no-referrer");
  if (req.path.startsWith("/api/")) res.set("Cache-Control", "no-store");
  next();
});
const secureEqual = (a, b) => {
  const x = Buffer.from(a || ""),
    y = Buffer.from(b || "");
  return x.length === y.length && timingSafeEqual(x, y);
};
app.use("/api", (req, res, next) => {
  const token = process.env.DEMO_ACCESS_TOKEN;
  if (token && !secureEqual(req.get("X-Demo-Token"), token))
    return res
      .status(401)
      .json({ error: "Enter the demo access code to use this workspace." });
  if (process.env.NODE_ENV === "production" && !token)
    return res
      .status(503)
      .json({ error: "Demo access is not configured on this server." });
  if (
    req.method !== "GET" &&
    req.get("Origin") &&
    new URL(req.get("Origin")).host !== req.get("host")
  )
    return res.status(403).json({ error: "Cross-site request blocked." });
  next();
});
app.get("/api/config", (req, res) =>
  res.json({
    provider: "Exotel",
    mode: "phone-bridge",
    configured,
    agentPhone: agentPhone
      ? agentPhone.slice(0, 3) + "••••••" + agentPhone.slice(-4)
      : null,
    allowedNumbers: approved.map((n, index) => ({
      id: "recipient-" + index,
      label: n.slice(0, 3) + " •••••• " + n.slice(-4),
    })),
    missing: [
      !config.key && "API credentials",
      !agentPhone && "verified agent phone",
      !callerId && "ExoPhone caller ID",
      !approved.length && "approved recipient",
    ].filter(Boolean),
    browserCalling: false,
  }),
);
app.get("/api/calls", (req, res) => res.json(calls));
let initiating = false,
  lastCallAt = 0;
const inFlight = new Map();
app.post("/api/calls", async (req, res) => {
  if (!configured)
    return res.status(503).json({
      error:
        "Real calling needs a verified agent phone, ExoPhone caller ID, and approved recipient. Configure these on the server first.",
    });
  let to;
  try {
    const selected = req.body.recipientId;
    if (selected != null) {
      const match = /^recipient-(\d+)$/.exec(String(selected));
      if (!match || !approved[Number(match[1])])
        throw new Error("Choose an approved demo recipient.");
      to = approved[Number(match[1])];
    } else to = normalizePhone(req.body.to);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  if (!approved.includes(to))
    return res.status(403).json({
      error:
        "This number is not approved for the demo. Choose a configured recipient.",
    });
  if (to === normalizePhone(agentPhone))
    return res
      .status(400)
      .json({ error: "The recipient must be different from the agent phone." });
  const key = String(req.get("Idempotency-Key") || "").slice(0, 100);
  if (key && calls.some((c) => c.requestKey === key))
    return res.json(calls.find((c) => c.requestKey === key));
  if (initiating || calls.some((c) => !terminal.has(c.status)))
    return res.status(409).json({
      error:
        "A call is already being placed or is active. Finish it before starting another.",
    });
  if (Date.now() - lastCallAt < 15000)
    return res
      .status(429)
      .json({ error: "Wait a few seconds before placing another call." });
  initiating = true;
  lastCallAt = Date.now();
  const call = {
    id: randomUUID(),
    name: String(req.body.name || "Demo recipient").slice(0, 80),
    leadId: String(req.body.leadId || "").slice(0, 50),
    to,
    requestKey: key,
    status: "initiating",
    createdAt: new Date().toISOString(),
    duration: 0,
    type: "outgoing",
    sample: false,
  };
  calls.unshift(call);
  persist();
  try {
    const params = new URLSearchParams({
      From: normalizePhone(agentPhone),
      To: to,
      CallerId: callerId,
      TimeLimit: "180",
      TimeOut: "30",
      Record: "false",
      CallType: "trans",
      CustomField: call.id,
    });
    const data = await exotelRequest(config, "Calls/connect.json", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    if (!data.Call?.Sid)
      throw new Error(
        "Exotel did not return a call identifier. Check the dashboard before retrying.",
      );
    call.providerId = data.Call.Sid;
    mergeProvider(call, data.Call);
    persist();
    res.status(201).json(call);
  } catch (e) {
    call.status = e.definiteRejection ? "failed" : "unknown";
    call.error = !e.definiteRejection
      ? "Provider response timed out. Check Exotel before placing another call."
      : e.message;
    persist();
    res.status(502).json({ error: call.error, call });
  } finally {
    initiating = false;
  }
});
app.get("/api/calls/:id", async (req, res) => {
  const call = calls.find((c) => c.id === req.params.id);
  if (!call) return res.status(404).json({ error: "Call not found." });
  if (
    call.providerId &&
    (!terminal.has(call.status) ||
      (!call.finalized &&
        Date.now() - Date.parse(call.terminalObservedAt || call.createdAt) <
          180000))
  ) {
    try {
      if (!inFlight.has(call.id))
        inFlight.set(
          call.id,
          exotelRequest(
            config,
            `Calls/${encodeURIComponent(call.providerId)}.json?details=true`,
          ).finally(() => inFlight.delete(call.id)),
        );
      const data = await inFlight.get(call.id);
      mergeProvider(call, data.Call || data);
      call.syncError = null;
      persist();
    } catch (e) {
      return res.json({ ...call, syncError: e.message });
    }
  }
  res.json(call);
});
app.patch("/api/calls/:id/outcome", (req, res) => {
  const call = calls.find((c) => c.id === req.params.id);
  if (!call) return res.status(404).json({ error: "Call not found." });
  if (
    !["Converted", "Callback", "Not interested", "Follow up"].includes(
      req.body.outcome,
    )
  )
    return res.status(400).json({ error: "Choose a valid outcome." });
  call.outcome = req.body.outcome;
  call.notes = String(req.body.notes || "").slice(0, 2000);
  persist();
  res.json(call);
});
app.get("/health", (_req, res) => res.json({ ok: true }));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(resolve(root, "dist")));
  app.get("/{*path}", (_req, res) =>
    res.sendFile(resolve(root, "dist/index.html")),
  );
} else {
  const { createServer } = await import("vite");
  const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}
app.use((err, req, res, next) => {
  console.error("Request failed:", err.name);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});
const port = Number(process.env.PORT || 3000);
app.listen(port, process.env.HOST || "127.0.0.1", () =>
  console.log(`On-Ground workspace: http://127.0.0.1:${port}`),
);
