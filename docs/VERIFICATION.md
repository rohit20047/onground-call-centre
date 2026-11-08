# Verification and remaining submission gates

## Confirmed

- Original React + Node.js implementation builds successfully.
- Backend tests pass against a test-only provider transport.
- Real Exotel credentials passed a read-only authenticated balance request.
- Browser walkthrough verified required main screens and core interactions.
- Phone-width and laptop-width checks found no horizontal page overflow.
- Chat messages and task resolution survive reload; resolved callback task disappears from Dashboard.
- Credentials are server-only, ignored by Git, and stored with owner-only filesystem permissions.

## Not yet proven

- Actual call test on 8 November 2026: the app reached Exotel, but the provider rejected it with “Your account is not yet KYC compliant. This is mandatory before making outbound calls.” No provider call ID was returned. A recipient is configured; account eligibility still needs resolution.
- Account caller ID/API permissions for trial calls: must be confirmed against Exotel before the real-call demo.
- Exotel WebRTC access: not enabled; use the documented phone bridge for baseline calling.
- Public repository published with user approval: https://github.com/rohit20047/onground-call-centre . Source ZIP and complete history bundle are also prepared.
- Temporary live URL: https://pcs-articles-refugees-indicate.trycloudflare.com . It forwards to the production Node server and requires that server/tunnel to stay running. Permanent hosting is not established.
- Screen recording with real calling: pending the verified real-call test.

Build/tests and authentication are not substitutes for proof that a real phone rang and an answered conversation worked. The assignment remains incomplete until the required real-call demonstration and submission artifacts are ready.

The requirement-by-requirement completion audit is in `SUBMISSION_CHECKLIST.md`. A local Git bundle was verified to contain the full history. The prepared ZIP was scanned against the stored API credentials and demo access code; none were included.
