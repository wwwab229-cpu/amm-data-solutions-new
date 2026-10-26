# AMM DS — QA, Release & Handover Checklist

Project ID:
Client:
Service:
Version/release:
QA owner:
Review date:

## A. Scope and completeness
- [ ] Every deliverable in the approved scope is present.
- [ ] Exclusions and limitations are documented.
- [ ] File names, formats, and destinations match the agreement.
- [ ] No unsupported claim, fabricated result, or unapproved content is included.
- [ ] Dependencies and third-party costs are disclosed.

## B. Service-specific QA
Select and complete the relevant checks.

### Website / digital solution
- [ ] Mobile, tablet, and desktop layout reviewed.
- [ ] Links, forms, destinations, and success/error states tested.
- [ ] Keyboard navigation, visible focus, labels, and contrast reviewed.
- [ ] Metadata, canonical, sitemap/robots behavior, and redirects checked where in scope.
- [ ] Build/deployment result and post-release smoke test checked.
- [ ] Backup/rollback route documented.

### AI automation / intelligent agent
- [ ] Normal path, invalid input, missing data, retry, and failure path tested.
- [ ] Duplicate execution risk assessed.
- [ ] Permissions are least-privilege.
- [ ] Human approval and escalation points work as agreed.
- [ ] Logs and outputs do not expose secrets or unnecessary personal data.
- [ ] Monitoring, cost/rate limits, and rollback/fallback documented where supported.

### AI chatbot / support
- [ ] Approved FAQs and source content verified.
- [ ] Unknown question triggers a safe fallback.
- [ ] Bot does not invent prices, policies, guarantees, or availability.
- [ ] Human escalation and lead delivery tested.
- [ ] Personal-data and prompt-injection tests performed.
- [ ] Client approved greeting, answers, and launch location.

### Data entry / data management
- [ ] Original source preserved.
- [ ] Row/record counts reconcile or differences are explained.
- [ ] Required fields, types, formats, duplicates, and formulas validated.
- [ ] Spot checks compared against original records.
- [ ] Exceptions and assumptions are listed.
- [ ] Final data shared only through the agreed secure destination.

### Digital advertising
- [ ] Correct client account, objective, geography, dates, and audience.
- [ ] Creative/copy, claims, destination URLs, and tracking reviewed.
- [ ] Spend caps, schedule, billing owner, and exclusions checked.
- [ ] Current platform eligibility/policy reviewed.
- [ ] Written approval for exact creative, budget, targeting, dates, and activation recorded.
- [ ] No performance guarantee is stated.

### SEO / AI search visibility
- [ ] Audit findings include evidence, priority, and affected URLs.
- [ ] Recommendations distinguished from implemented changes.
- [ ] Page titles, descriptions, headings, links, and technical directives checked where in scope.
- [ ] Structured data, if used, matches visible page content.
- [ ] No keyword stuffing or invented business facts.
- [ ] Indexing/ranking claims are backed by current verification and dated evidence.

### Creative design / content
- [ ] Dimensions, file formats, safe areas, and mobile legibility checked.
- [ ] Spelling, CTA, URLs, and brand assets checked.
- [ ] Fonts, images, audio, and other assets have appropriate usage rights.
- [ ] Editable source files included only if agreed.
- [ ] Final export compared with the client-approved draft.

## C. Risk and privacy
- [ ] No credentials, access tokens, or secrets in deliverables or logs.
- [ ] Personal/customer data is minimized and transferred securely.
- [ ] Temporary access is scheduled for removal when no longer needed.
- [ ] Open issues, limitations, and mitigations are documented.
- [ ] No external/public action has occurred without required approval.

## D. Client approval gate
- [ ] Preview/staging version shared.
- [ ] Feedback resolved or remaining items listed.
- [ ] Exact final version and release action approved in writing.
- Approval evidence/link:
- Approved version:
- Approval date:
- Approved by:

**Do not publish, activate paid campaigns, send customer-facing messages, or modify production systems before the required approval is recorded.**

## E. Handover package
- [ ] Final files, URLs, or repository links.
- [ ] Quick-start / operating instructions.
- [ ] Configuration and integration notes (no secrets).
- [ ] Ownership and access notes.
- [ ] Known limitations and troubleshooting.
- [ ] Maintenance/support terms and next steps.
- [ ] External subscriptions, API usage, hosting, and ad spend clarified.
- [ ] Data retention/deletion tasks completed as agreed.
- [ ] Client confirms receipt.

## F. Closeout
- What was delivered:
- What remains out of scope / open:
- Actual handover date:
- Support window:
- Reusable improvement (remove client confidential details):
- Project status: Complete / Blocked / Follow-up required
