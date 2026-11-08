# On-Ground.ai Call Centre

An original React + Node.js implementation of the supplied Call Centre reference. It brings the agent dashboard, ranked calling plan, lead details, calendar, and Pulse conversations into a responsive workspace. Real telephone calls use Exotel's server-side API; there is no simulated calling fallback.

## Live preview and repository

- Repository: https://github.com/rohit20047/onground-call-centre
- Temporary live preview: https://pcs-articles-refugees-indicate.trycloudflare.com
- A separate demo access code is required and is not committed to this repository.
- The temporary link depends on the local server/tunnel remaining running; it is not permanent hosting.
- Real telephone calling was verified on 8 November 2026: both phones rang, both participants answered, and the user confirmed two-way audio. Exotel reported both legs completed and 15 seconds of conversation.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm ci
cp .env.example .env
# Fill in server-only configuration in .env.
npm run dev
```

Open http://127.0.0.1:3000. Business screens work with sample data even before calling is configured. In this development workspace, the server can also read the private `.env` in the parent folder; a standalone clone should use its own `.env`.

Production:

```sh
npm run build
npm start
```

Set `HOST=0.0.0.0`, a platform-provided `PORT`, and `DEMO_ACCESS_TOKEN` on a hosting provider. The Node.js server serves both the compiled React frontend and the API. `/health` is the health check. A production server without a demo access code refuses API access rather than exposing billable calling.

## Stack and rationale

- React 19: reusable UI and explicit screen/state composition.
- Vite: small development/build setup; production output is served by Node.
- Node.js + Express 5: keeps provider credentials on the server and shares one origin with the frontend.
- Lucide: consistent accessible icon treatment. Charts use simple original CSS rather than adding a charting dependency.
- Local sample module: reproducible dashboard, lead, calendar, and channel data, as permitted by the assignment.
- Local browser storage: prototype messages and task decisions survive reloads; this is a single-browser demo, not a synchronized multi-agent chat service.
- Backend JSON store: real call records and manual outcomes survive a Node process restart. Use a persistent volume and one server instance for this prototype. A multi-instance production product would need a shared database and transactional call locks.

## Implemented

- Shared desktop sidebar and top bar, profile/calling setup, notification list, score details.
- Dashboard KPIs, progress, waiting queue, earnings, tasks, seven-day calls and CSAT charts.
- Ranked outgoing leads, expandable detail rows, and bounded pagination.
- Missed calls ranked by expected value, with callback entry points on every row.
- Recent calls, type filters, sample SOP review, real-call details, manual notes/outcomes.
- Month calendar, event dots, date selection, event details, previous/next month, Today, year rollover.
- Pulse home with AvaniBot, role/task agents, channels, Kudos, and direct-message entry points.
- Channel history, left/right chat bubbles, timestamps, working message composition, pinned input choices/replies, and related dashboard task completion.
- Leads modal from dashboard tasks, paging, ICP/intent scores, collapsible buying signals, and call entry point.
- Phone-width navigation and responsive layout.
- Bonus local microphone rehearsal with playback and self-review checklist. No audio is uploaded and no AI feedback is claimed.
- Server-side Exotel call initiation, approved-recipient validation, idempotency, concurrent-call guard, request cooldown, polling of real call details, and persistent call history.

## How real calling works

1. A person opens the app and selects Call from a lead, missed-call row, or the floating call button.
2. They select a masked, pre-approved demo recipient and confirm the recipient may be called now.
3. React sends an approved recipient identifier to Node. The calling form does not expose the full destination number, and React never receives the permanent Exotel API key/token.
4. Node validates the number, checks the allowlist, prevents duplicate/overlapping calls, and calls Exotel's `Calls/connect.json` endpoint using HTTP Basic authentication in a header.
5. Exotel calls `EXOTEL_AGENT_NUMBER` first. The agent answers on their phone. Exotel then calls the recipient and bridges the two phones.
6. The UI polls Node, which reads the real provider Call Details API. Final conversation duration is taken from Exotel’s detailed call record, with polling continuing while delayed terminal details settle. Status is never advanced by a fake timer. A provider `in-progress` status means Exotel is connecting/handling the call; it does not alone prove both parties answered.
7. Hang up on either phone to end the conversation. This API integration does not claim an in-app hangup capability. The configured provider time limit is three minutes.
8. Real records appear in Recent and accept manual outcome/notes. Duration and final values can arrive later from Exotel.

Recording is explicitly disabled. This version speaks through the agent's phone, not the laptop microphone. Exotel browser-to-phone WebRTC requires separate account enablement and credentials and remains pending. Human-to-human calling is the baseline. AI-to-human voice is not implemented.

### Required server configuration

| Variable                 | Meaning                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| `EXOTEL_ACCOUNT_SID`     | Exotel account identifier                                           |
| `EXOTEL_API_KEY`         | API username from API Settings                                      |
| `EXOTEL_API_TOKEN`       | API secret from API Settings                                        |
| `EXOTEL_API_HOST`        | Account region: `api.exotel.com` or `api.in.exotel.com`             |
| `EXOTEL_AGENT_NUMBER`    | Verified agent phone, e.g. country code + mobile number             |
| `EXOTEL_CALLER_ID`       | Account's assigned ExoPhone, in the format Exotel expects           |
| `EXOTEL_ALLOWED_NUMBERS` | Comma-separated approved recipient numbers, including country codes |
| `DEMO_ACCESS_TOKEN`      | Separate reviewer access code; required in production               |
| `CALLS_DATA_DIR`         | Optional persistent call-record directory                           |

The setup panel reports missing configuration without exposing secrets. Exotel trial accounts may restrict calls to verified users added to the account and may require KYC for broader access. Account enablement is not implied by the presence of API credentials. Provider errors remain visible. Timeouts or ambiguous provider failures are stored as `unknown` to prevent accidental repeat billable calls; reconcile the call in Exotel before retrying. There is intentionally no unauthenticated provider webhook; status is read through the authenticated provider API instead.

Official references: [Connect two numbers](https://developer.exotel.com/docs/voice-v1/api-reference/connect-two-numbers), [Call details](https://developer.exotel.com/docs/voice-v1/api-reference/call-details), [Trial restrictions](https://support.exotel.com/support/solutions/articles/110606-trial-accounts-how-do-i-test-outbound-calling-).

## Verification

```sh
npm test
npm run build
node server/check-provider.js
```

`npm test` exercises phone validation, terminal-state merging, provider error handling, access control, destination allowlisting, cross-site request blocking, idempotency, overlapping-call prevention, and outcome persistence. API tests use a fake transport and never contact Exotel. These tests are not proof of a real telephone conversation.

`check-provider.js` makes a read-only authenticated balance request and does not place calls. A real agent-to-recipient conversation was demonstrated with two verified account users on 8 November 2026. The provider record and participant confirmation are retained privately.

Browser verification performed: dashboard, lead modal and paging, row expansion/list paging, callback setup guard, call review, calendar navigation through December/January and Today, channel message sending, pinned task resolution, reload persistence, and desktop/phone-width overflow checks. Screenshots are under `docs/`.

## Real-call test result

The first attempt was rejected while the recipient was not yet a verified account user. After the second number was added and verified, Exotel accepted outbound API calls without a payment-card addition. One attempt ended before a conversation was established; the successful retry completed both call legs with 15 seconds of conversation, and the user confirmed both participants heard each other. This documents this account’s observed result, not a guarantee that every Exotel trial has the same permissions. Personal numbers, invitation emails, credentials, and raw provider responses are excluded from the repository.

## Deliberately not integrated

- Exotel WebRTC/browser audio and AI-to-human calling.
- Production CRM, WhatsApp, mailbox/calendar synchronization, LinkedIn posting, and real autonomous agents.
- AI transcription, sentiment, automatic SOP scoring, or practice scoring. Seeded review content is labeled as sample.
- Multi-user authentication and synchronized chat. Reviewer access is a shared demo code; allowlisted destinations and a three-minute cap limit the calling surface.

## AI tools and original work

OpenAI Codex assisted with requirements analysis, original implementation, documentation, and testing. The supplied HTML was inspected as a visual/interaction reference; its source was not copied into the application. Be prepared to explain the call lifecycle, access controls, state management, and prototype storage tradeoffs.

## Submission

Required: GitHub repository link, live demo link, and a screen recording no longer than two minutes showing an actual call to a telephone number. See `docs/DEMO_GUIDE.md` for the sequence and `docs/VERIFICATION.md` for the current evidence and outstanding gates. Do not submit a screen-only demonstration as proof of working calling.
