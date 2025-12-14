-- Add sort_order column to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS sort_order DOUBLE PRECISION DEFAULT 0;

-- Create an index for faster sorting
CREATE INDEX IF NOT EXISTS posts_sort_order_idx ON public.posts (sort_order);
