import dotenv from "dotenv";
import { exotelRequest } from "./calls.js";
dotenv.config({ path: [".env", "../.env"], quiet: true });
try {
  const data = await exotelRequest(
    {
      sid: process.env.EXOTEL_ACCOUNT_SID,
      key: process.env.EXOTEL_API_KEY,
      token: process.env.EXOTEL_API_TOKEN,
      host: process.env.EXOTEL_API_HOST || "api.exotel.com",
    },
    "Balance.json",
  );
  console.log(
    JSON.stringify({
      authenticated: true,
      responseType: Object.keys(data),
      balance: data.Balance?.Balance ?? data.Balance?.balance ?? null,
    }),
  );
} catch (e) {
  console.log(JSON.stringify({ authenticated: false, error: e.message }));
  process.exitCode = 1;
}
