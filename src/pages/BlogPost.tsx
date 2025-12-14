import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import Navigation from "@/components/Navigation";
import Newsletter from "@/components/Newsletter";

import { BLOG_POSTS } from "@/data/posts";

const BlogPost = () => {
    const { slug } = useParams();

    // Default to first post if slug not found (or handle 404)
    // Default to first post if slug not found (or handle 404)
    const originalPost = BLOG_POSTS[slug || "the-future-of-brand-architecture"] || BLOG_POSTS["the-future-of-brand-architecture"];

    if (!originalPost) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-black">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                    <p className="text-gray-600">The requested article could not be loaded.</p>
                    <p className="text-xs text-gray-400 mt-4 font-mono">Slug: {slug}</p>
                    <Link to="/feed" className="mt-8 inline-block px-6 py-3 bg-black text-white rounded-full font-bold uppercase tracking-widest text-sm">Back to Feed</Link>
                </div>
            </div>
        );
    }

    // Create a shallow copy to avoid mutating the shared object
    const post = { ...originalPost };

    // Inject the long content if it's missing (for the new stubs)
    if (!post.content || post.content.length < 200) {
        post.content = `
    <p class="lead">This is a placeholder for the full article content. In a real application, this would be fetched from a CMS or markdown file.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <h2>The Core Concept</h2>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <blockquote>"Innovation distinguishes between a leader and a follower."</blockquote>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    `;
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-black selection:text-white">
            <Navigation alwaysShowBackground />

            <article className="pt-32 pb-20">
                {/* Header */}
                <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
                    <div className="flex items-center justify-between mb-8">
                        <Link
                            to="/feed"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Feed
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full">
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                                <Calendar className="w-4 h-4" /> {post.date}
                            </span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >

                        <h1 className="text-4xl lg:text-6xl font-serif font-bold leading-[1.1] mb-6 text-gray-900 tracking-tight">
                            {post.title}
                        </h1>

                        <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed mb-8 font-light">
                            {post.subtitle}
                        </p>

                        <div className="flex items-center justify-between border-t border-b border-gray-100 py-6 mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                    <img src="https://github.com/shadcn.png" alt={post.author} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{post.author}</div>
                                    <div className="text-xs text-gray-500">{post.readTime}</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="text-gray-400 hover:text-black transition-colors"><Twitter className="w-5 h-5" /></button>
                                <button className="text-gray-400 hover:text-black transition-colors"><Linkedin className="w-5 h-5" /></button>
                                <button className="text-gray-400 hover:text-black transition-colors"><Facebook className="w-5 h-5" /></button>
                                <button className="text-gray-400 hover:text-black transition-colors"><Share2 className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Featured Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="container mx-auto px-4 lg:px-8 mb-16 max-w-6xl"
                >
                    <div className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-sm">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-center mt-4 text-sm text-gray-400 italic">
                        Photography by Unsplash
                    </div>
                </motion.div>

                {/* Content */}
                <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="prose prose-lg md:prose-xl prose-slate max-w-none
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-black prose-headings:tracking-tight prose-headings:mb-8 prose-headings:mt-16
              prose-h2:text-4xl md:prose-h2:text-5xl prose-h2:leading-tight
              prose-h3:text-3xl md:prose-h3:text-4xl prose-h3:leading-tight
              prose-h4:text-2xl md:prose-h4:text-3xl prose-h4:leading-tight
              prose-h5:text-xl md:prose-h5:text-2xl prose-h5:leading-tight
              prose-h6:text-lg md:prose-h6:text-xl prose-h6:leading-tight prose-h6:uppercase prose-h6:tracking-widest
              prose-p:font-sans prose-p:text-[1.125rem] md:prose-p:text-[1.25rem] prose-p:leading-[1.9] prose-p:text-gray-900 prose-p:font-normal prose-p:tracking-normal prose-p:mb-8
              prose-a:text-black prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-8 prose-blockquote:py-4 prose-blockquote:my-12 prose-blockquote:italic prose-blockquote:text-2xl md:prose-blockquote:text-4xl prose-blockquote:font-serif prose-blockquote:text-black prose-blockquote:leading-tight
              prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-16
              prose-li:text-lg prose-li:text-gray-900 prose-li:leading-relaxed
              [&>.lead]:text-2xl md:[&>.lead]:text-3xl [&>.lead]:font-serif [&>.lead]:text-black [&>.lead]:leading-[1.4] [&>.lead]:mb-16 [&>.lead]:font-medium"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-32 border-t border-gray-100 pt-16">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="font-serif font-bold text-3xl">Keep Reading</h3>
                            <Link to="/feed" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-300 transition-all">
                                View Archive
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Card 1 */}
                            <Link to="/feed/brand-is-the-only-moat" className="group block h-full">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="h-full flex flex-col group"
                                >
                                    <div className="relative h-[300px] overflow-hidden rounded-2xl mb-6">
                                        <img
                                            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=2070"
                                            alt="Brand Strategy"
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3 flex-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono uppercase tracking-wider">
                                            <span className="text-black font-bold">Strategy</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span>Dec 12, 2025</span>
                                        </div>
                                        <h4 className="text-2xl font-serif font-bold text-gray-900 group-hover:underline decoration-1 underline-offset-4 decoration-gray-300 transition-all leading-tight">
                                            Brand is the Only Moat
                                        </h4>
                                        <p className="text-gray-500 line-clamp-2 leading-relaxed">
                                            When the cost of creating 'average' drops to zero, the value of 'trust' becomes infinite.
                                        </p>
                                    </div>
                                </motion.div>
                            </Link>

                            {/* Card 2 */}
                            <Link to="/feed/design-as-a-competitive-advantage" className="group block h-full">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="h-full flex flex-col group"
                                >
                                    <div className="relative h-[300px] overflow-hidden rounded-2xl mb-6">
                                        <img
                                            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2700"
                                            alt="Design Advantage"
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3 flex-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono uppercase tracking-wider">
                                            <span className="text-black font-bold">Design</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span>Sep 28, 2024</span>
                                        </div>
                                        <h4 className="text-2xl font-serif font-bold text-gray-900 group-hover:underline decoration-1 underline-offset-4 decoration-gray-300 transition-all leading-tight">
                                            Design as a Competitive Advantage
                                        </h4>
                                        <p className="text-gray-500 line-clamp-2 leading-relaxed">
                                            How design-led companies are outperforming the S&P 500 by over 200%.
                                        </p>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    </div>
                </div>
            </article>

            <Newsletter />
        </div>
    );
};

export default BlogPost;

