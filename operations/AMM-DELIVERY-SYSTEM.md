# AMM Data Solutions — Delivery System v1.0
**Purpose:** A reusable internal operating playbook for delivering client work consistently, safely, and efficiently. This is an internal operations document; it does not change the public website design.

## Operating rule
Every project must have: (1) an agreed scope, (2) named deliverables, (3) an owner, (4) acceptance checks, (5) client approval gates, and (6) a handover record. Never publish, send campaigns, spend ad budget, change production systems, or contact a client's customers without explicit client approval.

## 1. Standard project pipeline
1. **New request** — record client, service, business goal, deadline, market, contact, and source.
2. **Discovery** — collect the brief and existing assets; ask only questions needed to scope the work.
3. **Scope & quote** — document inclusions, exclusions, assumptions, dependencies, timeline, revisions, external costs, and acceptance criteria. Obtain written approval before starting.
4. **Access & setup** — request least-privilege access only when needed. Prefer client-owned accounts. Never store passwords, API keys, recovery codes, payment data, or private customer data in this playbook.
5. **Build** — follow the service SOP below; save drafts and versioned files in the agreed client workspace.
6. **Internal QA** — run the relevant checklist; record blockers and known limitations.
7. **Client review** — deliver a preview/staging version and ask for consolidated feedback. Do not publish or activate paid activity yet.
8. **Approval & release** — obtain explicit written approval for the exact final version and release action.
9. **Handover** — share final files, links, setup notes, ownership/access details, usage instructions, limitations, and support terms.
10. **Close & learn** — confirm receipt, record approved scope vs. delivered scope, and capture reusable improvements without retaining unnecessary client data.

### Project record template
- Project ID / client / service:
- Business goal and target audience:
- Scope included / explicitly excluded:
- Deliverables and file formats:
- Required client inputs and access:
- Timeline and dependencies:
- Quote approved (date / evidence):
- Draft review date / feedback:
- QA status and unresolved risks:
- Final approval (exact version / date):
- Release or handover link:
- Support window / next steps:
- Reusable learning (remove confidential details):

## 2. Service delivery SOPs

### A. AI business automation & intelligent agents
**Intake:** Map the current process, trigger, inputs, decisions, systems, exceptions, data sensitivity, expected output, human owner, and success measure.
**Build sequence:** (1) map current state, (2) design proposed flow, (3) agree rules and exception paths, (4) build in a test environment, (5) test normal/edge/failure cases, (6) demonstrate, (7) obtain approval, (8) deploy with rollback instructions.
**Deliverables:** workflow map; automation/agent configuration or source files where applicable; input/output schema; integration list; exception and escalation rules; test report; operator guide; maintenance notes.
**QA gate:** no duplicate actions on retry; clear failure alerts; access limited to required permissions; sensitive data minimized; human approval for consequential or external actions; rate/cost limits where supported; logs avoid secrets; rollback path documented.
**Acceptance:** agreed sample cases pass, exceptions are visible, client can operate the flow, and approved production behavior matches the signed scope.
**Boundary:** AI outputs may be wrong. Use human review for legal, financial, medical, safety-sensitive, or other consequential decisions.

### B. Website AI chatbots & customer support
**Intake:** approved source content, FAQs, service boundaries, business hours, lead fields, supported channels, escalation contact, prohibited answers, and data-retention expectations.
**Build sequence:** content inventory → knowledge base cleanup → conversation paths → lead capture (minimum fields) → fallback/escalation → test questions → client review → approved launch.
**Deliverables:** chatbot flow; approved knowledge base/FAQ; greeting and fallback copy; lead-capture fields; escalation rules; test transcript set; installation notes; update instructions.
**QA gate:** test correct answers, unknown questions, conflicting sources, prompt injection, personal-data requests, out-of-scope questions, mobile layout, broken links, and escalation. Bot must not invent policies, prices, guarantees, or availability.
**Acceptance:** agreed test set passes; fallback and human handoff work; client approves wording and deployment location.
**Boundary:** do not place customer secrets or unnecessary personal data in prompts/logs. Explain limitations and provide human escalation where needed.

### C. Data entry, data cleanup & data management
**Intake:** source files, target schema, definitions, allowed transformations, duplicate rules, required fields, volume, sensitivity, and final format.
**Build sequence:** preserve untouched source → profile sample → agree rules → process a copy → validate counts and field rules → review exceptions → deliver final + exception log.
**Deliverables:** cleaned/structured dataset; data dictionary or field mapping; transformation rules; duplicate/exception report; QA summary; import notes if applicable.
**QA gate:** source remains recoverable; row counts reconcile; required fields and formats validate; duplicates follow agreed rules; spot-check records against source; formulas/encoding/time zones are checked; no unsupported assumptions are silently applied.
**Acceptance:** agreed validation thresholds pass and exceptions are disclosed.
**Boundary:** transfer data securely, use minimum necessary access, and delete working copies according to the agreed retention plan.

### D. Digital advertising & campaign management
**Intake:** objective, audience, geography, offer, landing page, creative assets, budget, dates, conversion definition, account ownership, tracking, exclusions, and approval contact.
**Build sequence:** account/tracking audit → campaign plan → keyword/audience and placement plan → copy/creative variants → landing-page check → budget and schedule review → client approval → launch → scheduled monitoring/report.
**Deliverables:** campaign plan; account/campaign structure; approved ad copy and creative files; tracking checklist; launch QA record; performance report with spend, delivery, conversions and caveats; next-step recommendations.
**QA gate:** confirm account and geography; URLs/UTMs; pixel/tag events where permitted; budget caps; schedule; spelling and claims; landing-page function; policy eligibility; billing and client permissions. Verify current platform eligibility before promising a channel or ad format.
**Approval gate:** written approval of creative, targeting, budget, dates, and landing page before activation or material edits.
**Boundary:** client owns ad spend and account billing unless the contract explicitly says otherwise. Never guarantee leads, sales, ranking, or return on ad spend.

### E. Google SEO & AI search visibility (SEO/AEO/GEO)
**Intake:** site and business URLs, target market, service areas, priority services, conversion goals, CMS access if needed, Search Console/Analytics availability, and existing content.
**Build sequence:** baseline crawl and indexability review → technical/content/local/entity audit → prioritize by impact and effort → implement or prepare recommendations → validate → submit eligible URLs/sitemaps if authorized → measure baseline and follow-up.
**Deliverables:** prioritized audit report; keyword/topic and search-intent map; page-level recommendations; metadata/content briefs or approved edits; internal-link recommendations; structured-data validation where applicable; measurement sheet.
**QA gate:** no keyword stuffing or fabricated claims; titles/descriptions unique and relevant; canonical/index directives checked; broken links and mobile issues reviewed; schema matches visible page content; changes tested before publishing.
**Acceptance:** agreed audit items and artifacts delivered, with implementation status clearly distinguished from recommendations.
**Boundary:** rankings, indexing speed, AI citations, traffic, and conversions cannot be guaranteed. Report observable evidence and dates; do not claim a page is indexed without verification.

### F. Website design & digital solutions
**Intake:** audience, goals, sitemap, content, brand assets, required features, integrations, domains/hosting, accessibility needs, and ownership.
**Build sequence:** requirements → sitemap/wireframe → visual approval → responsive implementation → content and metadata → staging QA → client review → backup/release plan → written approval → deploy → smoke test.
**Deliverables:** agreed pages and components; source/repository handover where included; responsive layouts; metadata and sitemap basics; form/integration configuration; test record; deployment and maintenance notes.
**QA gate:** mobile/tablet/desktop; keyboard focus; contrast and labels; links and forms; loading/error states; 404/redirects; console/build checks; metadata/canonical; basic security headers and dependency review where applicable; backup and rollback path.
**Acceptance:** scoped pages/features work in agreed browsers/devices, forms route to the approved destination, and the client approves the release.
**Boundary:** domains, hosting, paid plugins, subscriptions, API usage, and ongoing maintenance are separate unless included in the quote.

### G. Creative design & digital content
**Intake:** objective, audience, platform and dimensions, brand kit, message, CTA, required assets, usage rights, language, and approval owner.
**Build sequence:** brief → concept options (as scoped) → draft design/copy → proofread and asset-rights check → client review → final export → handover.
**Deliverables:** approved creative files in agreed formats/sizes; editable source file if included; copy/caption variants if scoped; platform export set; asset/licence notes.
**QA gate:** dimensions, safe areas, legibility on mobile, contrast, spelling, brand consistency, CTA/URL, file quality, and rights/permissions for fonts, photos, music, and logos.
**Acceptance:** final assets match approved brief and export specs.
**Boundary:** no unlicensed assets, misleading claims, fake testimonials, or invented performance results.

## 3. Standard release checklist
- [ ] Deliverables match the approved scope and file formats.
- [ ] Internal QA completed and evidence saved.
- [ ] Client feedback resolved or explicitly listed as open.
- [ ] Exact final version approved in writing.
- [ ] No credentials, secrets, or unnecessary personal data in shared files.
- [ ] External costs and ongoing dependencies disclosed.
- [ ] Release/activation completed only after approval.
- [ ] Final links, operating instructions, limitations, and support terms handed over.
- [ ] Access is least-privilege; temporary access removed when no longer needed.
- [ ] Retention/deletion tasks completed as agreed.

## 4. Reusable client communication snippets

**Brief received:** “Thanks — we’ll review the requirements and confirm the deliverables, dependencies, timeline, and quote before work begins.”

**Scope approval request:** “Please confirm that the attached scope, deliverables, timeline, exclusions, and quoted amount are approved. Work begins after written approval and receipt of required inputs.”

**Review request:** “Please review this draft against the agreed scope and send one consolidated list of changes. This is a preview; it will not be published or activated until you approve the final version.”

**Release approval:** “Please approve this exact version and the release action described here. We will proceed only after written confirmation.”

**Handover:** “The agreed deliverables are ready. Included are the final files/links, operating notes, known limitations, access/ownership notes, and support next steps.”

## 5. Lightweight automation blueprint
Start with low-risk, reversible automations; keep human approval before client-facing or production actions.

**Suggested flow:** Intake form/email → create project record → classify service → generate the matching checklist → assign status/owner → draft client questions and scope → human review → approved work folder and tasks → QA checklist → client approval gate → handover checklist → closeout summary.

**Automate first:** project IDs, folder/file naming, task checklist creation, due-date reminders, draft report formatting, metadata checks, link checks, data validation, and handover packaging.

**Keep manual approval for:** quotes and contract scope; publishing website changes; activating or editing paid campaigns; sending outreach or customer messages; deleting/overwriting client data; granting access; and any action with financial, legal, privacy, or reputational impact.

**Failure handling:** every automation needs an owner, a visible error state, a retry policy that avoids duplicates, a manual fallback, and a log that excludes secrets. Test with sample/non-production data before client use.

## 6. Delivery metrics (internal, not marketing claims)
Track per project: time from approved scope to first draft; on-time handover; QA defects found before release; rework rounds; blocked days awaiting client input; acceptance on first review; and unresolved issues at close. Use the first few projects to establish a baseline before setting targets or publishing any numbers.

## 7. Definition of done
A workflow is “ready for delivery” only when it has: intake template, step-by-step SOP, reusable assets, QA checklist, explicit approval gates, failure/exception handling, sample test case, handover template, and a named human owner. Mark untested automation as **pilot**, not production-ready.
