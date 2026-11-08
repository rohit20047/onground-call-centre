// Test-only transport: never sends test calls to Exotel.
const original = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  if (String(url).startsWith("https://api.exotel.com/"))
    return new Response(
      JSON.stringify({
        Call: { Sid: "test-provider-call-id", Status: "in-progress" },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  return original(url, options);
};
