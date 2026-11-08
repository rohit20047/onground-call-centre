# Assignment completion audit

This checklist preserves the PDF's full submission scope. Implementation or a passing build does not prove that a telephone call worked.

| Assignment requirement | Current evidence | Result |
| --- | --- | --- |
| Sidebar and top bar | `App` and `Nav` in `src/main.jsx`; desktop screenshot | Implemented; browser checked |
| Dashboard metrics, progress, waiting, earnings, tasks, seven-day charts | `Dashboard`, `BarChart`; `docs/desktop-dashboard.png` | Implemented; browser checked |
| Calls to make ranked by score, expandable rows, paging | `Plan`, sample lead ordering; observed row expansion and page change | Implemented; browser checked |
| Incoming missed calls, value at stake, callback on each row | `Plan`; observed five callback buttons and calling setup guard | Implemented; browser checked |
| Recent calls by type/time/duration and selectable review | `Plan`, `CallReview`; observed sample SOP review | Implemented; browser checked; real record awaits real call |
| Month calendar, event dots, Today and month switcher | `Calendar`; observed December/January rollover and return to current month | Implemented; browser checked |
| Pulse home, role/task agents, channels and Kudos | `Pulse`; observed channel list and agent groupings | Implemented; browser checked |
| Channel back/header, pinned input card, two choices/reply, bubbles and times | `Pulse`; observed message send and pinned callback resolution | Implemented; browser checked |
| Leads modal from dashboard, ICP/intent, collapsible signals, bounded paging | `LeadsModal`; observed dashboard entry and next lead | Implemented; browser checked |
| Working real telephone call with a demo | Node Exotel adapter; read-only provider authentication passed; test transport passes | NOT COMPLETE: approved recipient configured; actual API attempt rejected for account KYC; no answered conversation evidence |
| Original code, restrained reference styling, own Git history | Source in this repository; four local implementation commits; inspected reference separately | Implemented; reference was not shipped |
| README, run steps, stack/rationale, done/skipped, AI usage, calling explanation | `README.md` | Prepared |
| GitHub repository link | Local source repository and complete Git bundle available | Published with user approval: https://github.com/rohit20047/onground-call-centre |
| Live working demo link | Local development and production processes; Node hosting manifest prepared | NOT COMPLETE: external hosting is not verified |
| Screen recording up to two minutes including real calling | `docs/DEMO_GUIDE.md` gives the recording sequence | NOT COMPLETE: real-call recording pending |

## Bonuses

- Channel message send: implemented and verified, including saved state after reload.
- Answer Needs your input: implemented and verified, including removal of the related Dashboard task.
- Phone-width layout: implemented; 390px and laptop overflow checks passed.
- Practise a call: implemented local microphone recording/playback; script navigation inspected. Microphone capture has not been tested end to end.
- Dedicated Call back screen: callback entry points share the real calling dialog; no separate page.
- Charting library: not used; charts are original CSS.
- AI-to-human calling: not implemented; optional where possible in the assignment.

## External actions still needed

1. Resolve Exotel's KYC rejection; the user has now supplied a distinct approved recipient. Confirm recipient verification/API eligibility.
2. Place and answer a real test call with both people ready; retain provider evidence without exposing secrets.
3. GitHub publication approval was received and the prepared source was published successfully. Keep credentials and private call data excluded from subsequent pushes.
4. Publish and verify a live Node-backed demo using an approved hosting route, without adding payment details.
5. Record the actual working call and brief screen walkthrough; keep the recording at or below two minutes.
6. Prepare final links and submission contents for the user. The attached assignment's email instruction alone does not authorize sending mail.
