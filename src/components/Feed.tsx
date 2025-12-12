import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import feedIllustration from "@/assets/feed-illustration.jpg";

import { BLOG_POSTS } from "@/data/posts";

const FEATURED_POST = BLOG_POSTS["the-future-of-brand-architecture"];

const RECENT_POSTS = [
    BLOG_POSTS["revenue-systems-that-scale"],
    BLOG_POSTS["design-as-a-competitive-advantage"],
    BLOG_POSTS["the-psychology-of-micro-interactions"]
];

const Feed = () => {
    return (
        <section className="pt-12 lg:pt-16 pb-24 lg:pb-32 bg-cream relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-12 lg:mb-16 gap-8 lg:gap-12 relative">
                    <div className="max-w-2xl">
                        <span className="text-accent font-bold tracking-widest uppercase mb-4 block">
                            Intellectual Capital
                        </span>
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-cream-foreground mb-4 tracking-tight leading-tight">
                            The Feed
                        </h2>
                        <p className="text-lg lg:text-xl text-gray-600 leading-relaxed font-normal mb-8">
                            Curated thoughts on strategy, design systems, and the architecture of digital business.
                        </p>
                        <Link
                            to="/feed"
                            className="hidden lg:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-black/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <span>View Full Feed</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <img
                        src={feedIllustration}
                        alt="Sketch of Dan working"
                        className="hidden lg:block absolute top-[-2rem] right-6 w-44 lg:static lg:w-auto lg:h-80 mix-blend-multiply scale-x-[-1] opacity-90 grayscale contrast-125 mb-[-8px] lg:translate-y-4"
                    />
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Featured Post (Left - 7 cols) */}
                    <div className="lg:col-span-7">
                        <Link to={`/feed/${FEATURED_POST.slug}`} className="group block h-full">
                            <div
                                className="h-full flex flex-col rounded-3xl overflow-hidden bg-white shadow-sm border-2 border-black group-hover:shadow-xl transition-all duration-500"
                            >
                                <div className="relative h-[250px] lg:h-[350px] overflow-hidden">
                                    <img
                                        src={FEATURED_POST.image}
                                        alt={FEATURED_POST.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                    <div className="absolute top-6 left-6">
                                        <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-xs font-bold uppercase tracking-widest rounded-full text-black shadow-sm">
                                            Featured
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 lg:p-10 flex flex-col gap-4 flex-1">
                                    <div className="flex items-center gap-3 text-sm text-gray-500 font-mono">
                                        <span className="text-accent font-bold uppercase">{FEATURED_POST.category}</span>
                                        <span>•</span>
                                        <span>{FEATURED_POST.date}</span>
                                    </div>
                                    <h3 className="text-2xl lg:text-4xl font-serif font-bold text-gray-900 group-hover:text-accent transition-colors duration-300 leading-tight">
                                        {FEATURED_POST.title}
                                    </h3>
                                    <p className="text-base lg:text-lg text-gray-600 leading-relaxed font-sans max-w-2xl">
                                        {FEATURED_POST.excerpt}
                                    </p>
                                    <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-bold text-black uppercase tracking-wide group-hover:gap-4 transition-all">
                                        Read Story <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Posts (Right - 5 cols) */}
                    <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-6">
                        {RECENT_POSTS.map((post, index) => (
                            <Link key={post.id} to={`/feed/${post.slug}`} className="group block flex-1">
                                <div
                                    className="flex gap-4 lg:gap-6 p-5 lg:p-6 rounded-3xl bg-white border-2 border-black hover:shadow-xl transition-all duration-300 h-full items-center"
                                >
                                    <div className="w-24 h-24 lg:w-40 lg:h-40 shrink-0 rounded-2xl overflow-hidden relative shadow-inner">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 lg:gap-3 py-1 lg:py-2">
                                        <div className="flex items-center gap-2 lg:gap-3 text-xs font-bold font-mono tracking-wide">
                                            <span className="text-accent uppercase">{post.category}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-gray-500">{post.date}</span>
                                        </div>
                                        <h4 className="text-lg lg:text-2xl font-bold font-serif text-gray-900 group-hover:text-accent transition-colors leading-tight">
                                            {post.title}
                                        </h4>
                                        <div className="mt-auto flex items-center gap-2 text-xs font-bold text-gray-400 group-hover:text-black transition-colors uppercase tracking-widest">
                                            Read Article <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center lg:hidden">
                    <Link
                        to="/feed"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-black/80 transition-all duration-300"
                    >
                        View Full Feed <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};
export default Feed;
