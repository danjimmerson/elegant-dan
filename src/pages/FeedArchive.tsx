import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Globe, ExternalLink, LayoutGrid, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import SwipeFeed from "@/components/SwipeFeed";

import { BLOG_POSTS } from "@/data/posts";

const COVER_STORY = BLOG_POSTS["the-future-of-brand-architecture"];

const ARCHIVE_POSTS = [
    BLOG_POSTS["revenue-systems-that-scale"],
    BLOG_POSTS["design-as-a-competitive-advantage"],
    BLOG_POSTS["the-psychology-of-user-retention"],
    BLOG_POSTS["building-for-the-spatial-web"],
    BLOG_POSTS["the-end-of-average"],
    BLOG_POSTS["minimalism-in-complex-systems"]
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

interface ArticlePost {
    id: string | number;
    title: string;
    category: string;
    image: string;
    excerpt?: string;
    date: string;
    slug?: string;
    type?: string;
    link?: string;
}

const ArticleCard = ({ post, isExternal = false }: { post: ArticlePost, isExternal?: boolean }) => (
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
