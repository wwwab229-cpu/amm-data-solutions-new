CREATE INDEX IF NOT EXISTS idx_review_feedback_public_approved_created_at ON public.review_feedback_submissions (created_at DESC) WHERE submission_type = 'review' AND status = 'approved';
CREATE INDEX IF NOT EXISTS idx_review_feedback_admin_status_created_at ON public.review_feedback_submissions (status, created_at DESC);
