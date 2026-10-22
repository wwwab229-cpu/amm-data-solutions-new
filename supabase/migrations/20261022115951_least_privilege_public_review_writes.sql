REVOKE INSERT ON TABLE public.review_feedback_submissions FROM anon, authenticated;
GRANT INSERT (submission_type, display_name, business, rating, message, status) ON TABLE public.review_feedback_submissions TO anon, authenticated;
