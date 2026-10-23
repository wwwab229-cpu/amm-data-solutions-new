# AMM Data Solutions — Combined Website, SEO & Launch-Readiness Audit

**Audit date:** 23 October 2026  
**Inputs:** Claude source-level audit notes and the seven-page Website & SEO Audit supplied by AMM Data Solutions  
**Implementation PR:** [#39](https://github.com/wwwab229-cpu/amm-data-solutions-new/pull/39) — merged 23 October 2026
**Production merge commit:** `d58485a79e501fb7868272e78297ebb43edb18cd`  
**Scope:** Preserve the existing homepage design system, theme, colors, layout, service cards, contact flow and feedback experience while fixing verifiable issues.

## Executive assessment

The two source audits agree on the main opportunities: service discovery, mobile enquiry access, performance, metadata/social sharing and trust. The supplied Lighthouse results are snapshots from one run per device, not real-user Core Web Vitals. The 63/100 editorial score is the report author's rubric, not a Google score.

This implementation adds service-specific crawlable URLs and metadata, compiles Tailwind at build time instead of running the browser CDN, improves workflow contrast and keyboard access, aligns the workflow heading with its four visible stages, and strengthens response headers. These changes are designed to keep the homepage's existing purple/lavender, white and lime-green identity and layout intact.

**Updated verification (23 October 2026):** The remediation is merged and the production smoke workflow passed. A Playwright browser audit also passed for all nine routes at 390px mobile and 1365px desktop widths: all pages returned HTTP 200, each had the expected H1/title, no horizontal overflow or missing image-alt attributes were detected, service-page canonical/description checks passed, no uncaught page errors were recorded, the mobile Get in touch link reached the business contact section, and feedback-form open/close, 3-star selection and suggestion-pill interactions passed at both viewport sizes. This is automated browser coverage, not a full visual comparison or a Lighthouse measurement. Live form delivery, feedback submission/approval end-to-end, Search Console indexing and post-change Lighthouse remain outstanding.

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
| Mobile enquiry | Made the existing hero support line a keyboard-accessible link to the existing contact section; no new visible button or layout element | Provides an above-the-fold contact path while preserving appearance | Automated mobile menu navigation passed; hero-link keyboard/tap usability still needs manual confirmation |
| Accessibility | Darkened workflow headings/supporting text and added visible focus treatment to the hero enquiry link | Better text contrast and keyboard discoverability | Re-measure contrast and keyboard-test after deployment |
| Workflow consistency | Changed “Three Stages” to “Four Stages” to match the four visible workflow cards | Removes a factual inconsistency without changing the animation layout | Source updated |
| Performance | Added a pinned Tailwind 3.4.17 build and changed the homepage to load generated local CSS instead of the browser Tailwind CDN | Removes the runtime CDN from the critical rendering path | CI and Vercel preview passed; Lighthouse gain not yet measured |
| Security headers | Added HSTS and explicit noindex response header for `/admin.html`; disallowed admin page in robots.txt | More consistent HTTPS policy and reduced crawler discovery of admin URL | Production smoke check passed for CSP, HSTS and `X-Content-Type-Options: nosniff`; admin noindex header should be separately rechecked if deployment configuration changes |
| Continuous checks | Added CI build/static checks, production smoke checks and Playwright browser regression checks | Detects build, SEO, endpoint and mobile-layout regressions earlier | Build/static SEO, production smoke, and browser UX audit all passed on commit `214dfaf6e1242a9f313386e8d6a4be6ce6968751` |

## Live Supabase review/feedback check

The connected database reports `public.review_feedback_submissions` has RLS enabled. The final policy inventory contains:
- **SELECT:** public roles can read only rows where `submission_type = 'review'` and `status = 'approved'`.
- **INSERT:** the existing public insert policy permits `review` or `feedback` submissions only when `status = 'pending'`; optional rating remains nullable and is constrained to 1–5 when provided.
- Public roles have column-level SELECT/INSERT grants rather than broad table-level privileges.
- The admin Edge Function independently checks the signed-in email and uses the service-role key only server-side.

The live `pg_policies` inspection on 23 October reconfirmed exactly two policies on this table: public INSERT for `review`/`feedback` only with `status='pending'` and a nullable-or-1-to-5 rating; public SELECT only for `submission_type='review' AND status='approved'`. The performance advisor returned no findings. This database-policy inspection does **not** prove that the public form succeeds end-to-end; submit and read behaviour must still be tested through the real client flow without exposing pending submissions.

Supabase's security advisor also reports **Leaked Password Protection Disabled**. This setting remains outstanding and should be enabled in the Supabase Auth password-security settings. It is an account configuration task, not a website CSS change.

## Remaining risks / external dependencies

1. **Visual regression and accessibility:** automated browser checks passed on production at 390px mobile and 1365px desktop, with no horizontal overflow, missing image alt attributes, uncaught JavaScript errors, or broken mobile Get in touch navigation detected. Feedback panel open/close, cumulative star selection and suggestion pills also passed; the test did not submit or create production feedback. A human visual comparison, keyboard-only review, and screen-reader pass remain outstanding.
2. **Performance re-test:** rerun Lighthouse at least three times per device after deployment. Compare median LCP/CLS/TBT with the original single-run baseline; do not claim an improvement until measured.
3. **Live form tests:** Formspree contact delivery and feedback submission/approval are not yet end-to-end verified. Test contact inbox delivery, anonymous feedback with and without a rating/name, success/error states, admin approval, and approved-only public display. Do not publish unapproved feedback.
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
- green build/static SEO, production smoke and automated browser UX workflows;
- manual visual parity, keyboard and screen-reader checks on desktop/mobile;
- successful live contact and feedback end-to-end tests;
- admin approval/login verification and confirmation of public RLS boundaries;
- resolve or formally accept the Supabase leaked-password-protection warning;
- post-change Lighthouse and Search Console checksration;
- production security-header checks;
- repeat Lighthouse runs and Search Console verification.

No traffic, ranking, lead, or performance uplift is claimed before measurement.

## Second-pass verification — 23 October 2026

This section records a second pass after the latest main-branch commit, `9bf4cc2a3400063185750c8c82fc95432e728bf1`. It supersedes earlier statements that the production smoke workflow had not yet run, but does not replace the outstanding manual checks below.

### Verified in source / database
- All six service pages exist, each has one H1, a unique title, meta description, canonical URL, and two JSON-LD blocks that parse as valid JSON.
- All six service pages are linked from the homepage, present in `sitemap.xml`, and referenced in `llms.txt`.
- Homepage has one H1, a title, meta description, canonical URL, two parseable JSON-LD blocks, Formspree contact endpoint, Supabase feedback endpoint, and the requested feedback confirmation string.
- The homepage contains no `tel:` or `wa.me` contact links. WhatsApp appears in informational FAQ copy only, not as a contact channel.
- The review table has RLS enabled. The only public SELECT policy filters to `submission_type = 'review'` and `status = 'approved'`. The public INSERT policy accepts only `review` or `feedback` with `status = 'pending'`; optional ratings are null or 1–5.
- Supabase performance advisor returned no findings. Security advisor still reports `auth_leaked_password_protection` as a warning.

### Automated production checks — passed
- GitHub Actions [Production smoke monitoring](https://github.com/wwwab229-cpu/amm-data-solutions-new/actions/runs/39947045692) completed successfully on 23 October 2026.
- The workflow returned HTTP 200 for the homepage, admin page, privacy page, and all six service pages; required Content-Security-Policy, HSTS, and `X-Content-Type-Options: nosniff` headers were present.
- The workflow confirmed that the production HTML contains the expected Formspree and Supabase integrations and that the approved-review API responds HTTP 200.
- GitHub Actions [Website build and static SEO checks](https://github.com/wwwab229-cpu/amm-data-solutions-new/actions/runs/39947043804) completed successfully on the same commit, including dependency installation, Tailwind production CSS build, and page metadata checks.
- The production smoke workflow now also runs on pushes to `main`, in addition to its scheduled checks and manual trigger.

### Still required before calling the site fully launch-verified
1. Enable Supabase Auth leaked-password protection in the project’s Auth security/password settings; the available database and project tools cannot change this Auth dashboard setting.
2. Perform one real contact-form submission and confirm delivery to the intended inbox. The smoke check verifies the integration markup, not email delivery.
3. Perform one real feedback submission and verify the pending row, success/error UI, and approved-only public display end-to-end. Do not publish test feedback or any pending submission.
4. Re-run Lighthouse on production mobile and desktop, test keyboard-only navigation and reduced-motion behaviour, and inspect actual phone layouts. CI does not measure Core Web Vitals or visual parity.
5. Verify the sitemap and indexed URLs in Google Search Console. Search Console access and a custom domain are not part of the repository checks.

**Updated status:** source-level audit, database policy review, production HTTP/header smoke checks, and build/static SEO checks are complete and green. Final launch sign-off remains conditional on the manual checks and the outstanding Supabase Auth warning above. No ranking or performance uplift is claimed without measurements.


## Latest run links

- [Production smoke monitoring — passed](https://github.com/wwwab229-cpu/amm-data-solutions-new/actions/runs/39949561762)
- [Website build and static SEO checks](https://github.com/wwwab229-cpu/amm-data-solutions-new/actions/runs/39949561699)
- [Browser UX regression audit — passed](https://github.com/wwwab229-cpu/amm-data-solutions-new/actions/runs/39949561693)


## Latest feedback UI regression test

The Playwright browser workflow now exercises feedback form opening/closing, 3-star selection (expects three filled stars and one selected radio), and a suggestion pill populating the text field on mobile and desktop. [Latest run passed](https://github.com/wwwab229-cpu/amm-data-solutions-new/actions/runs/39949729708). This verifies client-side interactions only; it intentionally does not create production submissions.

Supabase advisors rechecked after this run: performance advisor returned no findings; security advisor still reports `auth_leaked_password_protection` disabled. That setting remains an outstanding account-level action.
