-- Add sort_order column to testimonials table
ALTER TABLE public.testimonials 
ADD COLUMN IF NOT EXISTS sort_order double precision DEFAULT 0;

-- Initialize sort_order based on creation time (or id) to give some stable initial order
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as r
  FROM public.testimonials
)
UPDATE public.testimonials
SET sort_order = ranked.r
FROM ranked
WHERE public.testimonials.id = ranked.id;
