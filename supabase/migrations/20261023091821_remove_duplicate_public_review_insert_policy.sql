-- The first audit-time migration briefly added a second insert policy
-- with the same pending-only intent. Remove the duplicate and retain the
-- pre-existing "Public can submit review feedback" policy.
DROP POLICY IF EXISTS "Public can submit pending feedback only"
ON public.review_feedback_submissions;
