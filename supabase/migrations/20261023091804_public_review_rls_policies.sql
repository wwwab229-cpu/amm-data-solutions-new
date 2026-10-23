ALTER TABLE public.review_feedback_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read approved reviews only"
ON public.review_feedback_submissions;

CREATE POLICY "Public can read approved reviews only"
ON public.review_feedback_submissions
FOR SELECT
TO anon, authenticated
USING (
  submission_type = 'review'
  AND status = 'approved'
);

-- The existing "Public can submit review feedback" policy is intentionally
-- retained. It allows review/feedback submissions only when status = pending.
