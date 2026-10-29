# AMM Data Solutions — Google Forms Order System

## What this adds
- One master Google Form for all six AMM services.
- A linked Google Sheets response tracker.
- Manual review workflow: each submitted request is marked **Pending review**.
- Internal columns for notes, quote (USD), and the date a confirmation is sent.
- A receipt message that says the request was received but is **not** an order confirmation.
- No paid services, no website changes, no automatic quote, no payment collection, and no order auto-approval.

## Files and branch
Branch: `feature/amm-ai-sales-agent`  
This setup is isolated from production. The website is not modified or deployed.

## Create the form in AMM's Google account
The connected tools do not provide direct Google Forms creation, so an authorised AMM account owner must run the included script once. It uses free Google Apps Script, Forms and Sheets services.

1. Sign in to the Google account that should own AMM order records.
2. Open [Google Apps Script](https://script.google.com/) and create a **New project**.
3. Replace the starter code in `Code.gs` with the contents of `order-system/google-apps-script/Code.gs` from this repository.
4. Save, choose `createAmmOrderSystem`, and click **Run**.
5. Review and authorise the requested Google Forms and Sheets permissions.
6. Open **Execution log** and copy the `ORDER FORM (share with clients)` and `ORDER TRACKER` URLs. Keep the edit-form URL private.
7. Submit a test request yourself. Confirm it appears in the response sheet with status **Pending review**.
8. Remove the test response from the tracker before sharing the form publicly, if desired.

If the script reports that the response tab was not ready, wait a few seconds and run `finishAmmOrderSystem` once.

## Manual order procedure
1. Check new requests in the linked spreadsheet.
2. Review project fit, requirements, timeline, and starting-price guidance on the AMM website.
3. Fill **AMM Internal Notes** and **AMM Quote (USD)** only after review.
4. Contact the client with follow-up questions or a tailored quote.
5. Change **AMM Review Status** to `Quote discussion`, `Awaiting client approval`, `Confirmed`, or `Declined` as appropriate.
6. Only mark `Confirmed` after scope, price, timeline, and applicable terms have been explicitly agreed. Use **AMM Confirmation Sent At** to record when confirmation was sent.

The form receipt message is not confirmation of paid work, a fixed price, or a delivery deadline.

## Privacy and access
- Restrict the response spreadsheet to authorised AMM personnel only.
- Do not ask clients for passwords, API keys, payment card details, or other credentials.
- Do not publish the spreadsheet or its edit link.
- The script does not send email confirmations or progress reports. Those can be added later only after testing and configuring an approved free route.

## QA checklist
- [ ] Form title, consent text, six service choices, and language choices are present.
- [ ] Required fields prevent incomplete requests.
- [ ] Invalid email is rejected.
- [ ] A test request lands in the linked sheet.
- [ ] New response is marked **Pending review**.
- [ ] Client-facing message says request received, not order confirmed.
- [ ] Spreadsheet sharing is restricted.
- [ ] No public website change or production deployment occurred.
