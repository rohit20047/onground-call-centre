# Verification results and limits

## Confirmed

- Original React + Node.js implementation builds successfully.
- Backend tests pass against a test-only provider transport.
- Real Exotel credentials passed a read-only authenticated balance request.
- Browser walkthrough verified required main screens and core interactions.
- Phone-width and laptop-width checks found no horizontal page overflow.
- Chat messages and task resolution survive reload; resolved callback task disappears from Dashboard.
- Credentials are server-only, ignored by Git, and stored with owner-only filesystem permissions.

- Successful real telephone conversation on 8 November 2026: provider status completed, both call legs completed, 15 seconds of conversation; the user confirmed both phones rang and two-way audio worked. Raw provider records are kept privately.

## Delivery and limits

- Initial KYC rejection was resolved for the verified-user trial flow. Actual two-way calling is now proven by provider details and participant confirmation.
- Trial caller ID/API eligibility has been demonstrated with two verified users.
- Exotel WebRTC access: not enabled; use the documented phone bridge for baseline calling.
- Public repository published with user approval: https://github.com/rohit20047/onground-call-centre . Source ZIP and complete history bundle are also prepared.
- Temporary live URL: https://pcs-articles-refugees-indicate.trycloudflare.com . It forwards to the production Node server and requires that server/tunnel to stay running. Permanent hosting is not established.
- Screen recording completed and saved at `media/OnGround_Prototype_Demo.mp4`: 114.53 seconds, H.264 video, no audio track. Sampled frames were visually inspected for correct app capture and absence of full phone numbers, emails, or credentials.
- The call captured in the recording completed both provider legs and reported 19 seconds of conversation.

Build/tests and authentication are not substitutes for proof that a real phone rang and an answered conversation worked. The real-call test is complete; the screen recording and source package are ready for the owner’s review. No submission email was sent.

The requirement-by-requirement completion audit is in `SUBMISSION_CHECKLIST.md`. A local Git bundle was verified to contain the full history. The prepared ZIP was scanned against the stored API credentials and demo access code; none were included.
