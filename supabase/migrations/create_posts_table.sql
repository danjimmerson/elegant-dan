-- Create posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    image TEXT,
    excerpt TEXT,
    date TEXT,
    "readTime" TEXT, -- Case-sensitive column name to match TypeScript interface
    author TEXT,
    content TEXT,
    type TEXT DEFAULT 'created', -- 'created' or 'curated'
    link TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'trash'))
);

-- Note: The "readTime" column is quoted to preserve camelCase, matching your frontend code.
-- The id is TEXT to support your existing custom IDs (like 'local-seo-is-dead') as well as auto-generated UUIDs.
