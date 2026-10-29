# AMM custom website AI assistant

This is a separate, review-only implementation for the AMM Data Solutions website. It does not alter the production site until this branch is approved and merged/deployed.

## Components
- `assets/amm-webbot.css`: isolated responsive chat UI; no global site selectors.
- `assets/amm-webbot.js`: chat controls, language selector (English, Roman Urdu, Hindi, Arabic), quick prompts, memory-in-tab only, and a transparent basic-help fallback.
- `supabase/functions/amm-webbot/index.ts`: public Edge Function that calls Cloudflare Workers AI server-side. The provider token is never sent to the browser.
- `order-system/..`: not changed by this work.

## Free-only AI provider
Cloudflare Workers AI currently documents a free allocation of 10,000 Neurons per day; usage above that fails on the Free plan instead of charging unless the account is upgraded. Use a model documented as eligible for Workers Free (currently configured as `@cf/zai-org/glm-4.7-flash`). Re-check the official limits/model catalog before deployment because quotas and model eligibility can change:
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers-ai/platform/limits/
- https://developers.cloudflare.com/workers-ai/models/

Do not upgrade the Cloudflare account or add billing for this project. If the free allocation is exhausted, the AI endpoint should fail closed and the front-end shows basic help instead of incurring usage charges.

## Deployment prerequisites (not performed)
1. Create/use a Cloudflare account on the Free plan and obtain an account ID plus an API token scoped only to Workers AI inference. Do not put either value in GitHub or website JavaScript.
2. In the Supabase project `yvfumgrywsqhsvjfnmzu`, add Edge Function secrets `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, and optionally `AMM_ALLOWED_ORIGINS` (comma-separated exact origins).
3. Deploy only the new `amm-webbot` function with JWT verification disabled because website visitors are anonymous. The function enforces its own origin allowlist and validates request size. Do not change or redeploy `amm-review-admin`.
4. Test the endpoint on a Vercel preview before adding the chat UI to production. The current front-end endpoint points to the Supabase project, so the actual AI reply is not available until the new function is deployed and secrets are configured.

## Privacy and security
- The browser sends the last few chat turns only for the current request; the widget does not write chat history to local storage or a database.
- The backend does not store chat content. Provider responses are not returned verbatim on provider errors.
- The public endpoint has message-size and history limits plus origin checks. Origin checks are not robust abuse protection and do not replace server-side rate limiting. Before public production launch, add a free abuse-control layer (for example Cloudflare Turnstile and/or a database-backed rate limit) and verify privacy disclosures.
- Never request passwords, payment details, IDs, or sensitive data through chat.
- Bot answers are informational. They do not confirm a quote, order, booking, or live system state.
- If AI is unavailable, the widget shows a limited FAQ fallback and labels it “Basic help mode”.

## Build and verification
The existing build copies the widget assets into `dist/assets`. Run the repository's existing build and CI checks after the branch is reviewed. Manual end-to-end AI verification still requires Cloudflare credentials and a deployed preview Edge Function.
