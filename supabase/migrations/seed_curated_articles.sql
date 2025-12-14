-- Seed Curated Marketing Articles
-- Fixed schema: description -> excerpt, source -> author
INSERT INTO public.posts (title, slug, date, category, image, excerpt, type, status, link, author, content, "readTime")
VALUES
    (
        'The End of Digital Marketing',
        'the-end-of-digital-marketing',
        'Dec 14, 2025',
        'Strategy',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200',
        'Why the traditional funnel is dead and what replaces it in the age of AI agents.',
        'curated',
        'published',
        'https://hbr.org/2025/12/the-future-of-marketing',
        'Harvard Business Review',
        'A provocative look at how AI agents are dismantling the traditional conversion funnel. The author argues that we are moving from "Search" to "Answer" engines, and brands must optimize for being the source of truth, not just the best SEO optimized page.',
        '8 min read'
    ),
    (
        'Community is the New Moat',
        'community-is-the-new-moat',
        'Dec 12, 2025',
        'Growth',
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200',
        'In a world of zero marginal content cost, only human connection retains value. Here is how to build it.',
        'curated',
        'published',
        'https://a16z.com/2025/community-growth',
        'a16z',
        'A deep dive into community-led growth metrics. This piece breaks down the distinction between "Audience" (people who listen) and "Community" (people who talk to each other). Essential reading for 2026 strategy.',
        '12 min read'
    ),
    (
        'The AI Creative Revolution',
        'the-ai-creative-revolution',
        'Dec 10, 2025',
        'Tech',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200',
        'Generative AI isn''t replacing creatives; it''s replacing the "average." How top agencies are adapting.',
        'curated',
        'published',
        'https://techcrunch.com/2025/12/ai-creative-agencies',
        'TechCrunch',
        'An analysis of 50 top design firms and how they are integrating Midjourney and Sora into their workflows. The key takeaway: The "Idea" is now the bottleneck, not the execution.',
        '6 min read'
    ),
    (
        'First Principles Branding',
        'first-principles-branding',
        'Dec 08, 2025',
        'Brand',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200',
        'Deconstructing the biggest brands of the decade to find the raw psychological truths they are built on.',
        'curated',
        'published',
        'https://www.marketingweek.com/first-principles-branding',
        'Marketing Week',
        'A masterclass in stripping away the fluff. This article argues that modern "Purpose Branding" has gone too far, and we need to return to the core promise of the product.',
        '10 min read'
    ),
    (
        'Metrics That Actually Matter',
        'metrics-that-actually-matter',
        'Dec 05, 2025',
        'Data',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200',
        'Why "Impressions" are a vanity metric and "Attention Time" is the only currency left.',
        'curated',
        'published',
        'https://moz.com/blog/metrics-2026',
        'Moz',
        'An actionable guide to configuring GA4 for the new web. It suggests ditching "Bounce Rate" entirely in favor of "Engagement Rate" and "Scroll Depth."',
        '15 min read'
    );
