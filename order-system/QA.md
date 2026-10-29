# QA — AMM Google Forms order workflow

## Static review completed
- [x] One master form definition includes six service choices.
- [x] Languages include English, Roman Urdu, Hindi, Arabic, and Other.
- [x] Includes contact, goal, requirements, current tools, budget, start timing, references, and consent.
- [x] Receipt copy explicitly states the request is not an order confirmation.
- [x] Review columns cover status, internal notes, quote, and confirmation date.
- [x] No paid third-party APIs or email providers are required.
- [x] No production website files are changed by this implementation.

## Must be tested in the authorised Google account
- [ ] Script authorisation succeeds.
- [ ] Form and linked response sheet are created.
- [ ] Email validation works.
- [ ] A submitted test response appears in the sheet.
- [ ] Submit trigger writes Pending review.
- [ ] Internal columns remain intact on subsequent submissions.
- [ ] Spreadsheet is private to authorised AMM personnel.

## Known boundary
The currently connected tools cannot create or verify a Google Form inside the user's Google account. The script creates it only after the authorised account owner runs it. Do not claim a live form exists until the execution log provides its URLs and a test submission passes.
