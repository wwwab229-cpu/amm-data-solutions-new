REVOKE SELECT ON TABLE public.review_feedback_submissions FROM anon, authenticated;
GRANT SELECT (submission_type, display_name, business, rating, message, status, created_at) ON TABLE public.review_feedback_submissions TO anon, authenticated;
