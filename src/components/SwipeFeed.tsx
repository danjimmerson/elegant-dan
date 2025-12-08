import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, ExternalLink, RotateCcw } from "lucide-react";

interface Post {
    id: number | string;
    title: string;
    category: string;
    image: string;
    excerpt?: string;
    date: string;
    readTime: string;
    type?: string;
    link?: string;
}

interface SwipeFeedProps {
    posts: Post[];
}

const SwipeFeed = ({ posts }: SwipeFeedProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'left' | 'right' | null>(null);

    // If we've gone through all posts
    if (currentIndex >= posts.length) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-center">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">All caught up!</h3>
                <p className="text-gray-600 mb-8">You've swiped through all the articles.</p>
                <button
                    onClick={() => setCurrentIndex(0)}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Start Over
                </button>
            </div>
        );
    }

    // We only render the top 2 cards for performance and stacking effect
    const visiblePosts = posts.slice(currentIndex, currentIndex + 2).reverse();

    const handleSwipe = (dir: 'left' | 'right') => {
        setDirection(dir);

        // If right swipe, open the link
        if (dir === 'right') {
            const post = posts[currentIndex];
            const url = post.type === 'created' ? `/feed/${post.id}` : post.link;
            if (url) {
                if (post.type === 'curated') {
                    window.open(url, '_blank');
                } else {
                    window.open(url, '_blank');
                }
            }
        }

        // Delay setting index to allow animation to play
        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
            setDirection(null);
        }, 200);
    };

    return (
        <div className="relative w-full max-w-md mx-auto h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-50">
                <div className="w-[90%] h-[90%] border-2 border-dashed border-gray-300 rounded-[2.5rem]" />
            </div>

            <AnimatePresence>
                {visiblePosts.map((post, index) => {
                    const isTop = index === visiblePosts.length - 1;
                    return (
                        <Card
                            key={post.id}
                            post={post}
                            isTop={isTop}
                            onSwipe={handleSwipe}
                        />
                    );
                })}
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute -bottom-20 flex gap-6">
                <button
                    onClick={() => handleSwipe('left')}
                    className="w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                >
                    <span className="sr-only">Skip</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <button
                    onClick={() => handleSwipe('right')}
                    className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                >
                    <span className="sr-only">Read</span>
                    <ArrowRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

interface CardProps {
    post: Post;
    isTop: boolean;
    onSwipe: (dir: 'left' | 'right') => void;
}

const Card = ({ post, isTop, onSwipe }: CardProps) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Background color change on swipe
    const bg = useTransform(
        x,
        [-200, -100, 0, 100, 200],
        ["rgb(255, 200, 200)", "rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(200, 255, 200)"]
    );

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (Math.abs(info.offset.x) > 100) {
            const dir = info.offset.x > 0 ? 'right' : 'left';
            onSwipe(dir);
        }
    };

    return (
        <motion.div
            style={{
                x: isTop ? x : 0,
                rotate: isTop ? rotate : 0,
                opacity: isTop ? opacity : 1, // Keep opacity 1 here, control via animate
                background: bg,
                zIndex: isTop ? 10 : 0
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className={`absolute top-0 w-full h-full p-4 ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{
                scale: isTop ? 1 : 0.95,
                opacity: isTop ? 1 : 0.5
            }}
            exit={{ x: x.get() < 0 ? -200 : 200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="w-full h-full bg-white rounded-[2rem] border-2 border-black shadow-xl overflow-hidden relative flex flex-col">
                <div className="relative h-1/2 overflow-hidden border-b-2 border-black">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold uppercase tracking-widest rounded-full text-black shadow-sm border border-black/10">
                            {post.category}
                        </span>
                    </div>
                    {post.type === 'curated' && (
                        <div className="absolute top-4 right-4 bg-black text-white p-2 rounded-full">
                            <Globe className="w-4 h-4" />
                        </div>
                    )}
                </div>
                <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 font-mono">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                        {post.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6 font-sans text-base line-clamp-3">
                        {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3 rotate-180" /> Skip</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest">
                            {post.type === 'curated' ? (
                                <span className="flex items-center gap-1">Visit <ExternalLink className="w-3 h-3" /></span>
                            ) : (
                                <span className="flex items-center gap-1">Read <ArrowRight className="w-3 h-3" /></span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Swipe Indicators */}
                <motion.div
                    style={{ opacity: useTransform(x, [50, 100], [0, 1]) }}
                    className="absolute top-8 left-8 -rotate-12 border-4 border-green-500 text-green-500 rounded-lg px-4 py-2 font-black text-4xl uppercase tracking-widest pointer-events-none bg-white/80"
                >
                    READ
                </motion.div>
                <motion.div
                    style={{ opacity: useTransform(x, [-100, -50], [1, 0]) }}
                    className="absolute top-8 right-8 rotate-12 border-4 border-red-500 text-red-500 rounded-lg px-4 py-2 font-black text-4xl uppercase tracking-widest pointer-events-none bg-white/80"
                >
                    SKIP
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SwipeFeed;
