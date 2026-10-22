# AMM Data Solutions — Supabase backend

This folder tracks the review/feedback backend schema changes and the deployed `amm-review-admin` Edge Function. The live Supabase project is `yvfumgrywsqhsvjfnmzu`.

## Security notes
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side in Supabase Edge Function secrets only. Never place it in website HTML or Vercel client environment variables.
- `amm-review-admin` requires JWT verification and independently checks the authenticated email against the AMM admin email.
- Public submissions remain anonymous and optional-name/optional-rating; they are inserted as `pending` and are not public until approved.
- Public roles have column-level SELECT/INSERT privileges rather than broad table-level access. RLS remains enabled and limits public reads to approved reviews and public inserts to pending submissions.
- `.vercelignore` excludes this folder from static-site deployment so backend source files are not published as website assets.

## Migration history
The two `least_privilege_public_review_*` migrations were applied to the live database on 2026-10-22 and are recorded in Supabase migration history. Earlier baseline migrations were applied before this folder was added to the repository; they are not recreated here.
