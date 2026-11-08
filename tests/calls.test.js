import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizePhone,
  mergeProvider,
  exotelRequest,
} from "../server/calls.js";
test("normalizes Indian local and international phone numbers", () => {
  assert.equal(normalizePhone("98765 43210"), "+919876543210");
  assert.equal(normalizePhone("09876543210"), "+919876543210");
  assert.equal(normalizePhone("+1 (415) 555-0123"), "+14155550123");
  for (const input of ["", "1234", "not a number", "++919876543210"])
    assert.throws(() => normalizePhone(input));
});
test("a late progress update cannot undo a terminal status", () => {
  const call = { status: "completed", duration: 30 };
  mergeProvider(call, { Status: "in-progress" });
  assert.equal(call.status, "completed");
  assert.equal(call.duration, 30);
  mergeProvider(call, { Status: "completed", ConversationDuration: 45 });
  assert.equal(call.duration, 45);
});
test("provider errors are useful and permanent credentials stay in authentication headers", async () => {
  const original = globalThis.fetch;
  let received;
  globalThis.fetch = async (url, options) => {
    received = { url, options };
    return new Response(
      JSON.stringify({
        RestException: { Message: "Account is not yet KYC compliant." },
      }),
      { status: 403 },
    );
  };
  try {
    await assert.rejects(
      exotelRequest(
        {
          sid: "test",
          key: "test-key",
          token: "test-token",
          host: "api.exotel.com",
        },
        "Balance.json",
      ),
      (e) => e.definiteRejection && e.message.includes("KYC"),
    );
    assert.ok(!received.url.includes("test-key"));
    assert.match(received.options.headers.Authorization, /^Basic /);
  } finally {
    globalThis.fetch = original;
  }
});

test("final conversation duration uses both-party time rather than total call setup time", () => {
  const call = { status: "in-progress", duration: 0 };
  mergeProvider(call, {
    Status: "completed",
    Duration: 30,
    Details: { ConversationDuration: null },
  });
  assert.equal(call.finalized, false);
  mergeProvider(call, {
    Status: "completed",
    Duration: 30,
    Details: {
      ConversationDuration: 15,
      Leg1Status: "completed",
      Leg2Status: "completed",
    },
  });
  assert.equal(call.duration, 15);
  assert.equal(call.finalized, true);
  assert.equal(call.agentStatus, "completed");
  assert.equal(call.recipientStatus, "completed");
});
