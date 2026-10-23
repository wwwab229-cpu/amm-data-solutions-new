# AMM Data Solutions — Combined Website, SEO & Launch-Readiness Audit

**Audit date:** 23 October 2026  
**Inputs:** Claude source-level audit notes and the seven-page Website & SEO Audit supplied by AMM Data Solutions  
**Implementation PR:** [#39](https://github.com/wwwab229-cpu/amm-data-solutions-new/pull/39) — merged 23 October 2026
**Production merge commit:** `d58485a79e501fb7868272e78297ebb43edb18cd`  
**Scope:** Preserve the existing homepage design system, theme, colors, layout, service cards, contact flow and feedback experience while fixing verifiable issues.

## Executive assessment

The two source audits agree on the main opportunities: service discovery, mobile enquiry access, performance, metadata/social sharing and trust. The supplied Lighthouse results are snapshots from one run per device, not real-user Core Web Vitals. The 63/100 editorial score is the report author's rubric, not a Google score.

This implementation adds service-specific crawlable URLs and metadata, compiles Tailwind at build time instead of running the browser CDN, improves workflow contrast and keyboard access, aligns the workflow heading with its four visible stages, and strengthens response headers. These changes are designed to keep the homepage's existing purple/lavender, white and lime-green identity and layout intact.

**Important status:** The remediation PR is merged. The GitHub build/static SEO workflow completed successfully on the PR head, and Vercel reported the preview deployment as Ready. This confirms build/deployment readiness, not visual parity or full production behaviour. Production smoke tests, post-change Lighthouse, Search Console indexing and end-to-end production tests remain outstanding.

## Source findings consolidated

### Claude source audit
- The source crawl covered only two URLs, not a full crawl.
- Service detail content was concentrated in JavaScript dialogs rather than standalone service URLs.
- A custom domain was recommended to improve brand credibility and establish a stable canonical domain; domain availability/ownership was not verified.
- The homepage's conceptual H1, Tailwind Play CDN and missing social preview image were identified as improvement areas.
- Organization/schema and favicon edits existed only in Claude's local workspace at the time; they were not treated as deployed fixes.

### Website & SEO Audit PDF (23 October 2026)
- Editorial homepage score: 63/100; weakest dimensions were Trust (4/10) and Acquisition (5/10).
- Lighthouse lab scores: mobile 78, desktop 90. Mobile FCP 3.2s, LCP 3.5s, TBT 150ms and CLS 0.136; desktop FCP 0.8s, LCP 0.9s, TBT 240ms and CLS 0.006.
- Sitemap listed only the homepage and privacy page.
- The hero's first mobile screen had no direct enquiry action.
- Workflow heading said “Three Stages” while the animation showed four stages.
- Workflow title/intro text contrast was reported at 2.32:1 against white.
- The social preview lacked `og:image`.
- The visible one-line anonymous review lacked project context.
- The PDF explicitly did not test Search Console, full-site crawling, live form submission, keyboard operation or Supabase RLS.

## Remediation implemented in the review branch

| Area | Change | Expected benefit | Verification status |
|---|---|---|---|
| Service discovery | Added six dedicated service pages with unique titles, descriptions, canonical URLs, visible service details and FAQs | Search engines and visitors can reach each service directly | CI build/static checks passed on PR head |
| Internal discovery | Service dialog now links to its matching full page; service cards and homepage layout remain | Connects existing card UX to crawlable URLs without redesigning cards | Vercel preview deployed; visual regression not independently verified |
| Sitemap / AI discovery | Added all six service URLs to XML sitemap and updated `llms.txt` and human-readable sitemap | More complete public URL inventory | Sitemap and metadata static checks passed on PR head |
| On-page metadata | Refined homepage title/description; added Open Graph and Twitter metadata | Clearer page summary and share metadata | Source updated; external preview validation pending |
| Favicon | Added a branded SVG favicon file and linked it from the homepage | Replaces data-URI favicon with a stable asset | Browser verification pending |
| Structured data | Added FAQPage JSON-LD for the visible homepage FAQs; kept existing Organization JSON-LD | Better machine-readable page context | JSON-LD validation pending |
| Mobile enquiry | Made the existing hero support line a keyboard-accessible link to the existing contact section; no new visible button or layout element | Provides an above-the-fold contact path while preserving appearance | Browser/tap testing pending |
| Accessibility | Darkened workflow headings/supporting text and added visible focus treatment to the hero enquiry link | Better text contrast and keyboard discoverability | Re-measure contrast and keyboard-test after deployment |
| Workflow consistency | Changed “Three Stages” to “Four Stages” to match the four visible workflow cards | Removes a factual inconsistency without changing the animation layout | Source updated |
| Performance | Added a pinned Tailwind 3.4.17 build and changed the homepage to load generated local CSS instead of the browser Tailwind CDN | Removes the runtime CDN from the critical rendering path | CI and Vercel preview passed; Lighthouse gain not yet measured |
| Security headers | Added HSTS and explicit noindex response header for `/admin.html`; disallowed admin page in robots.txt | More consistent HTTPS policy and reduced crawler discovery of admin URL | Config updated; production header checks pending |
| Continuous checks | Added CI build/static checks and extended scheduled production smoke checks to the six service pages | Detects build, sitemap and endpoint regressions earlier | CI passed; production smoke workflow must run successfully |

## Live Supabase review/feedback check

The connected database reports `public.review_feedback_submissions` has RLS enabled. The final policy inventory contains:
- **SELECT:** public roles can read only rows where `submission_type = 'review'` and `status = 'approved'`.
- **INSERT:** the existing public insert policy permits `review` or `feedback` submissions only when `status = 'pending'`; optional rating remains nullable and is constrained to 1–5 when provided.
- Public roles have column-level SELECT/INSERT grants rather than broad table-level privileges.
- The admin Edge Function independently checks the signed-in email and uses the service-role key only server-side.

The audit-time migration history and matching source files record the approved-review read policy and cleanup of a duplicate insert policy. The duplicate was removed; the existing pending-only insert policy was retained. This check does **not** by itself prove that the public form succeeds end-to-end; submit and read behaviour must be smoke-tested without exposing pending submissions.

Supabase's security advisor also reports **Leaked Password Protection Disabled**. This setting remains outstanding and should be enabled in the Supabase Auth password-security settings. It is an account configuration task, not a website CSS change.

## Remaining risks / external dependencies

1. **Production build and visual regression:** CI and Vercel preview builds passed. Compare the production homepage at desktop and 390px mobile against the existing look; the preview was not independently visually inspected in this audit.
2. **Performance re-test:** rerun Lighthouse at least three times per device after deployment. Compare median LCP/CLS/TBT with the original single-run baseline; do not claim an improvement until measured.
3. **Live form tests:** test Formspree contact delivery and anonymous feedback insertion, optional name/rating, success/error states, and public display of approved reviews. Do not create fake reviews or publish unapproved feedback.
4. **Security verification:** confirm HSTS and all security headers on production, run Supabase advisors again, test that anonymous clients cannot read pending feedback or set status to approved, and verify admin login/approval flow.
5. **Search Console:** verify property ownership, sitemap processing, indexed URL inventory, manual actions and crawl/indexing errors. This was not accessible from the supplied report.
6. **Custom domain:** not changed because domain ownership and DNS configuration are not available in the repository. Choose and connect a domain before switching canonical URLs; then update sitemap, metadata, allowed Edge Function origins and Search Console together.
7. **Social preview asset:** an SVG preview image is supplied. Some social platforms have inconsistent SVG support; verify actual previews and replace with a PNG/JPEG if any target platform does not render it.
8. **Trust content:** do not turn the illustrative workflow into a customer case study. Publish only authentic, permissioned feedback with sufficient context. No client outcomes or metrics have been invented.
9. **Content strategy:** the homepage H1 remains visually unchanged to preserve the creative hero. Dedicated service pages provide clearer service intent, but a later copy test may evaluate a more descriptive visible H1 without changing the design system.
10. **CSP hardening:** the current static page still needs inline script/style allowances. A stricter nonce/hash-based CSP requires a separate script/style externalization effort and full regression testing; do not remove these allowances without that work.

## Launch decision

**Status: REMEDIATION MERGED; FINAL LAUNCH APPROVAL STILL PENDING.**

The merged release contains substantial fixes, but final production approval depends on:
- green CI and Vercel preview build;
- visual parity checks on desktop/mobile;
- successful live contact and feedback tests;
- confirmation of public RLS boundaries and admin moderation;
- production security-header checks;
- repeat Lighthouse runs and Search Console verification.

No traffic, ranking, lead, or performance uplift is claimed before measurement.
