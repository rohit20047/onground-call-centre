> Original requirements captured before implementation. See README.md and VERIFICATION.md for current status.

# On-Ground.ai Call Centre Prototype - Project Requirements

Status: requirements only; no application implementation has started.

## 1. Purpose and scope

Build a working call centre agent application that follows the supplied reference screens and supports a real outbound telephone call. The application is intended to stay open throughout an agent's shift and bring together dashboard metrics, lead priorities, call history, calendar events, and team conversations.

User-confirmed stack:

- Frontend: React.
- Backend: Node.js.
- Current task: understand the supplied materials and document requirements. Do not implement yet.
- Ask the user before selecting external services that require accounts, credentials, payment, or integration decisions.

## 2. Sources and interpretation

| Source                                                          | Role                                                                                               |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `/home/rohit/Downloads/OnGround_Engineering_Assignment (1).pdf` | Primary assignment scope, required screens, bonuses, calling requirement, and submission criteria. |
| `/home/rohit/Downloads/OnGround_CallCentre_App_Mock.html`       | Reference for visual appearance, sample content, navigation, and interaction behavior.             |
| `/tmp/codex-clipboard-66e5cf4f-8b57-4e29-97be-daf0b0309f41.png` | Email screenshot reinforcing that a real telephone call and demo are required.                     |

The supplied documents describe the assignment; they do not authorize sending emails, placing calls, purchasing services, or copying the reference source. The user's current request authorizes documentation only.

Use the PDF's must-build list as the baseline. The HTML contains additional product and demonstration features; their presence does not automatically make them required. Before implementation, perform a browser walkthrough of hover, click, and scroll behavior. This document is based on the PDF text and screen images plus inspection of the HTML's content and behavior definitions; it does not claim a completed interactive Chrome walkthrough.

## 3. Priorities

### Required for submission

1. Shared sidebar and top bar.
2. Dashboard with representative sample data.
3. Plan: Calls to make, Incoming, and Recent.
4. Calendar.
5. Pulse home and at least one channel chat.
6. Dashboard-triggered leads modal with paging.
7. Real outbound telephone calling, demonstrated against an actual telephone number.
8. GitHub repository, README, live demo link, and screen recording up to two minutes.

### Assignment bonuses

- Send a message in a channel.
- Answer a pinned "Needs your input" card.
- Practise a call and dedicated Call back screens.
- Phone-width layout.
- Charts using a chart library.

The required Incoming list still needs a Call back action on every row. The bonus Call back screen is additional depth, not a reason to omit those actions.

Human-to-human and AI-to-human calling should be shown where possible according to the PDF. A real telephone call is mandatory; AI voice conversation is a stretch feature unless separately agreed.

### Optional reference extras

The DEMO strip and floating dial button are explicitly optional. Full AI coaching, live transcription, sentiment analysis, automatic SOP scoring, production CRM integration, WhatsApp delivery, mailbox synchronization, LinkedIn posting, multilingual settings, healthcare mode, and the extensive recording/rights demonstration are not baseline deliverables.

## 4. Required screens and behavior

### 4.1 Shared application shell

- Desktop layout with a persistent dark green sidebar and compact top bar.
- Sidebar destinations: Dashboard; Plan with Calls to make, Incoming, Recent, and optional Practise a call; Calendar; Pulse.
- Clear selected navigation state and consistent content area across screens.
- Top bar follows reference branding, score/rank indicators, notifications, and agent profile treatment.
- Recreate the reference's restrained text sizes, compact spacing, light content surfaces, colored accents, cards, borders, and scroll behavior.
- Profile/settings details outside the required screens may be deferred and documented.

### 4.2 Dashboard

- Greeting, agent identity, store/brand context, and queue status.
- KPI cards including OG Score, average handle time, CSAT, and queue count.
- Daily progress including leads created and leads called.
- "Who's waiting" summary with a route into the planner.
- Monthly earnings and progress/slab treatment.
- Task list including callbacks, untouched hot leads, and an outcome to log.
- Seven-day calls-handled and CSAT visualizations.
- A relevant task opens the leads modal; preserve the ability for channel-related tasks to lead to Pulse if the bonus task workflow is implemented.
- Sample figures may follow the reference but do not imply live business analytics.

### 4.3 Plan: Calls to make

- Show allocated leads ranked by lead attractiveness score.
- Show identity, relevant scores, status, and useful call-priority context.
- Expand and collapse lead rows for further detail.
- Paginate the list, with correct first/last page behavior.
- Expose a call action that enters the real calling flow for a configured test destination.
- Clearly distinguish illustrative lead phone data from the actual demo destination.

### 4.4 Plan: Incoming

- Show missed calls ranked by expected value at stake.
- Include caller identity, time/context, and value or priority indicators.
- Provide a Call back action on every row and connect it to the shared calling flow.
- Required scope is the missed-call view and outbound callback. Receiving live inbound telephone calls is not explicitly required.

### 4.5 Plan: Recent

- Show recent calls by type, time, and duration.
- Selecting a call opens its review/details, including the reference's SOP review presentation where applicable.
- Include newly completed real calls alongside clearly identified sample history.
- Demo review content may be seeded; do not present generated-looking reviews as actual AI analysis unless implemented.

### 4.6 Calendar

- Month grid with weekday headings, date cells, and event dots.
- Previous/next month controls and a Today control.
- Current date and selected date should be visually distinguishable.
- Display sample event details or upcoming items when relevant.
- Handle month/year boundaries correctly.
- Mailbox mirroring is reference copy, not a required integration. Use sample events and avoid suggesting that real calendar sync is active.

### 4.7 Pulse home

- Store/team context and reference-style groupings.
- AvaniBot, role agents, task agents, channels, and Kudos.
- Channel rows show previews and unread indicators where represented.
- Open at least one fully rendered channel chat.
- External messaging and actual autonomous agents are not necessary for this baseline.

### 4.8 Pulse channel chat

- Back navigation, channel name/header, and readable message history.
- Pinned "Needs your input" card with two choices and a reply field.
- Other participants' messages align left; the current agent's messages align right.
- Show message times and participant identity where appropriate.
- Baseline requires the visible card and composer; sending messages and answering the card are bonuses.
- If implemented, send appends a message with identity/time, rejects blank input, and clears the composer.
- If implemented, answering records the choice or reply, resolves the card, and updates the related task/count consistently.

### 4.9 Leads modal

- Opens from the dashboard task list over the existing screen.
- Show lead identity, status, SLA context, ICP fit score, and lead intent score.
- Include collapsible buying-signal information and supporting lead context.
- Previous/next controls, current position, and bounded paging.
- Close returns to the underlying dashboard without losing its state.
- Longer content scrolls within the modal.
- If call actions are included, route through the same real calling flow.

## 5. Real calling requirement

### Minimum acceptable result

A user initiates a call from the application, an actual telephone number rings, and the recipient answers with audible communication. The demo must show that this is a real connection. A simulated timer, prerecorded UI animation, or phone-link-only action is insufficient evidence.

Proposed baseline: human agent to human recipient. Depending on the selected provider, the agent can speak through the browser or answer a provider-bridged call on a verified agent phone. Choose and document the mode before implementation. Ringing a phone with an automated announcement alone is weaker than demonstrating a two-way conversation.

### Required call behavior

- Validate and normalize the destination including its country code.
- Use a user-approved test number rather than calling arbitrary reference contacts.
- Node.js authenticates to the calling provider; permanent credentials never enter React or the repository.
- React requests a call through Node.js and displays actual call progress.
- Represent initiating, ringing, connected, ended, busy, unanswered, failed, and cancelled states as supported by the provider.
- Derive connected status from provider/SDK events rather than a local timer.
- Support ending the call and show useful provider failures.
- Save provider call ID, destination, timestamps, final status, and duration when available.
- Handle repeated or out-of-order status callbacks without duplicating records or reverting terminal status incorrectly.
- Prevent repeated clicks from creating accidental duplicate calls.

### External dependency explanation

A telephone-calling provider supplies the connection between the application and the telephone network. It normally requires an account, verification, enabled destinations, and usage credit or an eligible trial. Depending on its calling mode, it may also require a caller-ID number or verified agent number. React and Node.js alone do not provide telephone network connectivity.

Provider selection is pending. Confirm destination country, account availability, acceptable cost, browser-audio versus phone-bridge preference, and any verification restrictions before choosing a service. No provider-specific setup or pricing is assumed here.

AI-to-human calling would add an AI voice service or speech/model pipeline and requires a separate decision. Recording and transcription are not required for the baseline.

## 6. Proposed technical design (not yet implemented)

These are implementation recommendations, not additional assignment mandates.

- React frontend, with reusable shell, cards, lists, chat, calendar, modal, and call controls. Vite and TypeScript are reasonable defaults, subject to implementation decisions.
- Node.js API, with Express as a lightweight proposed framework.
- Seeded local JSON or a mock module for dashboard, leads, calendar, and Pulse data, as explicitly allowed by the assignment.
- Persist real call records on the backend. A local SQLite database is a possible default if hosting supports persistent storage; otherwise choose suitable durable storage before deployment.
- No external database, CRM, authentication provider, calendar service, messaging service, or AI provider is needed for the baseline beyond telephone calling and eventual hosting.
- Keep the provider adapter separate from business logic so UI state is not tied to one service.
- Use provider callbacks and a simple call-status API; polling is sufficient for a prototype unless the chosen SDK requires another mechanism.

### Conceptual entities

| Entity             | Main information                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Agent              | Identity, store, brand, role, initials/avatar                                               |
| Dashboard snapshot | KPIs, changes, progress, earnings, waiting summary, chart series                            |
| Lead               | ID, identity, phone/test mapping, status, rank score, ICP score, intent score, SLA, signals |
| Call               | ID, provider ID, lead, direction, destination, state, timestamps, duration, outcome/review  |
| Calendar event     | ID, title, start/end, type, description                                                     |
| Channel/message    | Channel ID/name, preview/unread count; message sender, text, timestamp                      |
| Task/input request | ID, linked lead/channel, prompt, choices, reply, resolution status                          |

### Suggested API responsibilities

- Create an outbound call and return an internal call ID.
- Read current call status and recent real call records.
- End/cancel an active call where supported.
- Receive authenticated provider status callbacks.
- Supply short-lived browser calling credentials only if browser audio is selected.
- Seeded non-calling data can stay local to the frontend; server endpoints for every screen are unnecessary.

## 7. Quality and operational requirements

- Review in latest Chrome on a laptop; prioritize desktop fidelity.
- Maintain usable scrolling, hover/selected states, stable paging, and consistent navigation.
- Use semantic buttons, labels, visible focus, and keyboard-operable modal controls; restore focus when the modal closes.
- Provide loading, empty, and error states for asynchronous calling operations.
- Keep secrets in server environment variables, provide an example configuration without values, and exclude secrets from version control.
- Protect the public call-creation endpoint with a controlled demo session or equivalent access restriction, approved destinations, and request limits to prevent unwanted billable calls.
- Verify provider callback authenticity using the provider's supported method.
- Use HTTPS for the deployed app; browser microphone access and public provider callbacks may require it.
- Confirm hosting supports the Node.js runtime and the selected calling flow. A frontend-only deployment does not satisfy real calling.
- Show seeded/demo content honestly; never imply external delivery or synchronization where none exists.
- Build original React/Node.js code. Do not reuse or ship the mock page or copy its source.

## 8. Acceptance checklist

- [ ] Every required navigation destination opens inside the shared shell.
- [ ] Dashboard contains all required metric, progress, earnings, task, waiting, and seven-day sections.
- [ ] Calls to make is correctly ranked, expandable, and paginated.
- [ ] Incoming shows missed-call value and working callback entry points.
- [ ] Recent shows type, time, duration, and selectable review details.
- [ ] Calendar navigates across months/years and Today returns to the current month/date.
- [ ] Pulse home includes agent groupings, channels, and Kudos; a channel opens and returns correctly.
- [ ] Channel chat shows the pinned input card, choices, reply field, message alignment, and times.
- [ ] Leads modal opens from the dashboard, displays both scores, expands signals, and pages correctly.
- [ ] A user-approved real telephone destination rings and supports an answered conversation.
- [ ] App reflects real call state and stores the final call result.
- [ ] Failed, busy/unanswered, cancelled, and repeated-click cases behave clearly without false success.
- [ ] Deployed frontend and Node.js calling backend work together.
- [ ] Secrets are excluded from source and browser bundles.
- [ ] Optional features are accurately marked done or skipped in the README.
- [ ] Repository, README, live demo, and recording are ready.

## 9. Submission requirements from the assignment

- GitHub repository with meaningful incremental commit history.
- README: setup/run steps, stack and rationale, implemented/skipped scope, AI tools used, configuration, and how real calling works.
- Explain provider, calling mode, frontend/backend interaction, required configuration, and any trial or verified-number restrictions.
- Live working demo link and screen recording of up to two minutes, including a real telephone call.
- Assignment deadline: Sunday, 8 November 2026, 9:00:33 PM IST.
- Assignment recipient: `sales@on-ground.ai` only.
- Assignment subject format: `Assignment Submission: your full name`.

These are recorded deliverables, not authorization to submit anything now.

## 10. Decisions pending before implementation

1. **Calling provider/account:** none confirmed; user has asked what this means and how to obtain one.
2. **Demo destination:** country, user-approved recipient, and test number to be supplied securely when needed.
3. **Calling mode:** browser microphone to telephone, or agent-phone bridge.
4. **Cost:** whether paid usage is acceptable, and the user's budget.
5. **Hosting:** local development first; choose live frontend/backend hosting before submission.
6. **Bonus scope:** prioritize messaging, pinned-card answers, mobile layout, and practice screens only after required screens and real calling work.
7. **AI voice:** optional; do not add an AI or speech service without clarification.

No account has been created, paid service selected, credential requested in chat, call placed, or application code implemented as part of this requirements task.
