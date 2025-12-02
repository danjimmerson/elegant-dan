import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Globe, ExternalLink, LayoutGrid, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import SwipeFeed from "@/components/SwipeFeed";

const COVER_STORY = {
    id: 1,
    title: "The Future of Brand Architecture",
    slug: "the-future-of-brand-architecture",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070",
    excerpt: "How modern companies are rethinking their structural identity in a decentralized world. The monolithic structures of the past are giving way to more fluid, decentralized ecosystems.",
    date: "Nov 28, 2025",
    readTime: "5 min read",
    type: "created"
};

const ARCHIVE_POSTS = [
    {
        id: 2,
        title: "Revenue Systems that Scale",
        slug: "revenue-systems-that-scale",
        category: "Business",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070",
        excerpt: "Building automated pipelines that turn passive attention into active revenue streams.",
        date: "Nov 25, 2025",
        readTime: "4 min read",
        type: "created"
    },
    {
        id: 3,
        title: "Design as a Competitive Advantage",
        slug: "design-as-a-competitive-advantage",
        category: "Design",
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2700",
        excerpt: "Why aesthetic excellence is no longer optional for market leaders in the AI era.",
        date: "Nov 22, 2025",
        readTime: "6 min read",
        type: "created"
    },
    {
        id: 4,
        title: "The Psychology of User Retention",
        slug: "the-psychology-of-user-retention",
        category: "Product",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070",
        excerpt: "Understanding the cognitive biases that keep users coming back to your application.",
        date: "Nov 18, 2025",
        readTime: "7 min read",
        type: "created"
    },
    {
        id: 5,
        title: "Building for the Spatial Web",
        slug: "building-for-the-spatial-web",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=2070",
        excerpt: "Preparing your design system for an immersive, 3D-first internet.",
        date: "Nov 15, 2025",
        readTime: "5 min read",
        type: "created"
    },
    {
        id: 101,
        title: "The End of Average",
        slug: "the-end-of-average",
        category: "Inspiration",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=2068",
        excerpt: "A compelling look at why standard metrics fail to capture individual potential. Found this incredibly relevant to modern team building.",
        date: "Nov 27, 2025",
        readTime: "External",
        type: "curated",
        link: "https://example.com/end-of-average"
    },
    {
        id: 102,
        title: "Minimalism in Complex Systems",
        slug: "minimalism-in-complex-systems",
        category: "Architecture",
        image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=2070",
        excerpt: "Great breakdown of how complex backends can still maintain minimal, maintainable frontends.",
        date: "Nov 20, 2025",
        readTime: "External",
        type: "curated",
        link: "https://example.com/minimalism"
    }
];

const FeedArchive = () => {
    const [activeTab, setActiveTab] = useState<'created' | 'curated'>('created');
    const [viewMode, setViewMode] = useState<'list' | 'swipe'>('list');

    const filteredPosts = ARCHIVE_POSTS.filter(post => post.type === activeTab);

    // For swipe mode, we might want to include the cover story in the stack if it matches the type
    const swipePosts = activeTab === 'created' ? [COVER_STORY, ...filteredPosts] : filteredPosts;

    return (
        <div className="min-h-screen bg-cream text-gray-900 selection:bg-black selection:text-white">
            <Navigation alwaysShowBackground />

            <main className="pt-32 pb-24 px-6 lg:px-12">
                <div className="container mx-auto max-w-6xl">

                    {/* Header */}
                    <div className="mb-16 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-accent font-semibold tracking-wide uppercase text-xs mb-4 block font-sans">
                                The Archive
                            </span>
                            <h1 className="text-6xl lg:text-9xl font-serif font-bold text-cream-foreground mb-8 tracking-tighter">
                                Intellectual Capital
                            </h1>
                            <p className="text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal font-sans mb-12">
                                A collection of thoughts on strategy, design, and technology.
                            </p>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                {/* Content Toggle */}
                                <div className="inline-flex items-center bg-white p-1.5 rounded-full border-2 border-black shadow-sm">
                                    <button
                                        onClick={() => setActiveTab('created')}
                                        className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'created'
                                            ? 'bg-black text-white shadow-md'
                                            : 'text-gray-500 hover:text-black'
                                            }`}
                                    >
                                        Created
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('curated')}
                                        className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'curated'
                                            ? 'bg-black text-white shadow-md'
                                            : 'text-gray-500 hover:text-black'
                                            }`}
                                    >
                                        Curated
                                    </button>
                                </div>

                                {/* View Mode Toggle */}
                                <div className="inline-flex items-center bg-white p-1.5 rounded-full border-2 border-black shadow-sm">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 rounded-full transition-all duration-300 ${viewMode === 'list'
                                            ? 'bg-black text-white shadow-md'
                                            : 'text-gray-500 hover:text-black'
                                            }`}
                                        title="List View"
                                    >
                                        <LayoutGrid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('swipe')}
                                        className={`p-3 rounded-full transition-all duration-300 ${viewMode === 'swipe'
                                            ? 'bg-black text-white shadow-md'
                                            : 'text-gray-500 hover:text-black'
                                            }`}
                                        title="Swipe View"
                                    >
                                        <Layers className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {viewMode === 'list' ? (
                        <>
                            {/* Cover Story (Only show on Created tab in List mode) */}
                            {activeTab === 'created' && (
                                <section className="mb-24">
                                    <Link to={`/feed/${COVER_STORY.slug}`} className="group block">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, duration: 0.6 }}
                                            className="relative overflow-hidden rounded-[2rem] bg-white shadow-sm border-2 border-black group-hover:shadow-2xl transition-all duration-500"
                                        >
                                            <div className="grid lg:grid-cols-12 gap-0">
                                                <div className="lg:col-span-7 relative h-[400px] lg:h-[600px] overflow-hidden">
                                                    <img
                                                        src={COVER_STORY.image}
                                                        alt={COVER_STORY.title}
                                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    />
                                                    <div className="absolute top-8 left-8">
                                                        <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-xs font-bold uppercase tracking-widest rounded-full text-black shadow-sm">
                                                            Cover Story
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="lg:col-span-5 p-10 lg:p-16 flex flex-col justify-center bg-white relative">
                                                    <div className="mb-6 flex items-center gap-3 text-sm font-medium text-gray-400 font-mono">
                                                        <span className="text-accent uppercase tracking-wider font-bold">{COVER_STORY.category}</span>
                                                        <span>•</span>
                                                        <span>{COVER_STORY.date}</span>
                                                    </div>
                                                    <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 leading-[1.1] group-hover:text-accent transition-colors duration-300 tracking-tight">
                                                        {COVER_STORY.title}
                                                    </h2>
                                                    <p className="text-lg text-gray-600 mb-8 leading-relaxed font-sans">
                                                        {COVER_STORY.excerpt}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-black uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                                                        Read Article <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </section>
                            )}

                            {/* Feed List (Single Column) */}
                            <section className="max-w-3xl mx-auto space-y-8">
                                {filteredPosts.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                    >
                                        {post.type === 'created' ? (
                                            <Link to={`/feed/${post.slug}`} className="group block">
                                                <ArticleCard post={post} />
                                            </Link>
                                        ) : (
                                            <a href={post.link} target="_blank" rel="noopener noreferrer" className="group block">
                                                <ArticleCard post={post} isExternal />
                                            </a>
                                        )}
                                    </motion.div>
                                ))}

                                {filteredPosts.length === 0 && (
                                    <div className="text-center py-20 text-gray-500 font-mono">
                                        No posts found in this category yet.
                                    </div>
                                )}
                            </section>

                            {/* Pagination / Load More */}
                            <div className="mt-24 text-center">
                                <button className="px-10 py-5 bg-white border border-black/10 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                                    Load More Articles
                                </button>
                            </div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="py-12"
                        >
                            <SwipeFeed posts={swipePosts} />
                        </motion.div>
                    )}

                </div>
            </main>
        </div>
    );
};

const ArticleCard = ({ post, isExternal = false }: { post: any, isExternal?: boolean }) => (
    <article className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-[2rem] border-2 border-black shadow-sm group-hover:shadow-xl transition-all duration-300">
        <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-square overflow-hidden rounded-2xl relative shadow-inner border border-black/5">
            <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {isExternal && (
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm p-2 rounded-full text-white">
                    <Globe className="w-3 h-3" />
                </div>
            )}
        </div>
        <div className="w-full md:w-2/3 flex flex-col">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 font-mono">
                <span className="text-accent">{post.category}</span>
                <span>•</span>
                <span>{post.date}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors duration-300 leading-tight">
                {post.title}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4 font-sans text-base line-clamp-2">
                {post.excerpt}
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                {isExternal ? (
                    <>Visit Source <ExternalLink className="w-4 h-4" /></>
                ) : (
                    <>Read Story <ArrowRight className="w-4 h-4" /></>
                )}
            </div>
        </div>
    </article>
);

export default FeedArchive;
