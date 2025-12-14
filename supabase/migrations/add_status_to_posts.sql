-- Add status column to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft';

-- Add check constraint to ensure valid status values
ALTER TABLE public.posts 
ADD CONSTRAINT posts_status_check 
CHECK (status IN ('published', 'draft', 'trash'));

-- Update existing posts to be 'published' so they don't disappear
UPDATE public.posts SET status = 'published' WHERE status = 'draft';
