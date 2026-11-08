export const terminal = new Set([
  "completed",
  "failed",
  "busy",
  "no-answer",
  "canceled",
  "cancelled",
]);
export function normalizePhone(input) {
  const value = String(input || "").replace(/[\s()-]/g, "");
  const normalized = /^[6-9]\d{9}$/.test(value)
    ? "+91" + value
    : /^0[6-9]\d{9}$/.test(value)
      ? "+91" + value.slice(1)
      : value;
  if (!/^\+[1-9]\d{7,14}$/.test(normalized))
    throw new Error(
      "Enter a valid phone number with country code, for example +91 followed by ten digits.",
    );
  return normalized;
}
export function mergeProvider(call, data) {
  const status = data.Status || data.status;
  if (!terminal.has(call.status) || terminal.has(status)) {
    if (status) call.status = status;
  }
  call.providerStatus = status || call.providerStatus;
  const conversationDuration =
    data.Details?.ConversationDuration ?? data.ConversationDuration;
  call.duration =
    Number(conversationDuration ?? data.Duration ?? call.duration) || 0;
  if (data.Details) {
    call.agentStatus = data.Details.Leg1Status || call.agentStatus;
    call.recipientStatus = data.Details.Leg2Status || call.recipientStatus;
  }
  call.finalized = terminal.has(call.status) && conversationDuration != null;
  if (terminal.has(call.status) && !call.terminalObservedAt)
    call.terminalObservedAt = new Date().toISOString();
  call.endedAt = data.EndTime || call.endedAt;
  call.updatedAt = new Date().toISOString();
  return call;
}
export async function exotelRequest(config, path, options = {}) {
  const response = await fetch(
    `https://${config.host}/v1/Accounts/${encodeURIComponent(config.sid)}/${path}`,
    {
      ...options,
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(config.key + ":" + config.token).toString("base64"),
        ...(options.headers || {}),
      },
      signal: AbortSignal.timeout(20000),
    },
  );
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      "Calling provider returned an unreadable response. Try again or check the Exotel dashboard.",
    );
  }
  if (!response.ok) {
    const error = new Error(
      String(
        data.RestException?.Message ||
          data.message ||
          "Exotel rejected this request.",
      ).slice(0, 400),
    );
    error.definiteRejection = response.status >= 400 && response.status < 500;
    throw error;
  }
  return data;
}
