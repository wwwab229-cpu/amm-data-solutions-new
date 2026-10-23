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

-- This temporary duplicate policy was removed by the next migration.
DROP POLICY IF EXISTS "Public can submit pending feedback only"
ON public.review_feedback_submissions;

CREATE POLICY "Public can submit pending feedback only"
ON public.review_feedback_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND submission_type IN ('review', 'feedback')
);
