ALTER TABLE public.review_feedback_submissions
  ADD COLUMN IF NOT EXISTS respondent_type text,
  ADD COLUMN IF NOT EXISTS client_id text,
  ADD COLUMN IF NOT EXISTS service_name text,
  ADD COLUMN IF NOT EXISTS publication_consent boolean,
  ADD COLUMN IF NOT EXISTS marketing_consent boolean,
  ADD COLUMN IF NOT EXISTS external_review_platform text,
  ADD COLUMN IF NOT EXISTS external_review_url text;

ALTER TABLE public.review_feedback_submissions
  DROP CONSTRAINT IF EXISTS review_feedback_respondent_type_check,
  ADD CONSTRAINT review_feedback_respondent_type_check
    CHECK (respondent_type IS NULL OR respondent_type IN ('client','public'));

ALTER TABLE public.review_feedback_submissions
  DROP CONSTRAINT IF EXISTS review_feedback_external_review_platform_check,
  ADD CONSTRAINT review_feedback_external_review_platform_check
    CHECK (external_review_platform IS NULL OR external_review_platform IN ('clutch','google','linkedin','facebook','other'));

REVOKE INSERT ON TABLE public.review_feedback_submissions FROM anon, authenticated;
GRANT INSERT (
  submission_type, display_name, business, rating, message, status,
  respondent_type, client_id, service_name, publication_consent,
  marketing_consent, external_review_platform, external_review_url
) ON TABLE public.review_feedback_submissions TO anon, authenticated;
