import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, ExternalLink, RotateCcw, Hand, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    slug?: string;
    author?: string;
}

interface SwipeFeedProps {
    posts: Post[];
}

const SwipeFeed = ({ posts }: SwipeFeedProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const navigate = useNavigate();

    // Reset if posts change substantially
    if (currentIndex > posts.length) {
        setCurrentIndex(0);
    }

    const activePost = posts[currentIndex];
    const nextPost = posts[currentIndex + 1];

    const handleSwipe = (dir: 'left' | 'right') => {
        setHasInteracted(true);

        if (dir === 'right' && activePost) {
            if (activePost.type === 'curated' && activePost.link) {
                setTimeout(() => window.open(activePost.link, '_blank'), 200);
            } else if (activePost.slug) {
                setTimeout(() => navigate(`/feed/${activePost.slug}`), 200);
            }
        }

        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
        }, 200);
    };

    if (!activePost) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[500px] animate-in fade-in duration-500 bg-white rounded-[2rem] shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">You're all caught up!</h3>
                <p className="text-gray-500 mb-8 max-w-sm">You've swiped through all the latest curated thoughts and strategies.</p>
                <button
                    onClick={() => setCurrentIndex(0)}
                    className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    <RotateCcw className="w-4 h-4" />
                    Review Again
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm md:max-w-md mx-auto aspect-[3/4] md:aspect-[4/5] relative select-none">

            {/* Tutorial Overlay */}
            <AnimatePresence>
                {!hasInteracted && currentIndex === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-16 left-0 right-0 z-50 flex justify-center pointer-events-none"
                    >
                        <motion.div
                            animate={{ x: [-20, 20, -20] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="flex flex-col items-center gap-2 text-gray-400"
                        >
                            <Hand className="w-6 h-6 rotate-12" />
                            <span className="text-xs font-bold uppercase tracking-widest">Swipe Left / Right</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stack Container */}
            <div className="relative w-full h-full perspective-1000">

                {/* Background Card (Next Post) */}
                {nextPost && (
                    <div className="absolute inset-0 z-0">
                        <Card post={nextPost} isBackground />
                    </div>
                )}

                {/* Foreground Card (Active Post) */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activePost.id} // Key is crucial for AnimatePresence
                        className="absolute inset-0 z-10 touch-action-none"
                        exit={{
                            x: -300,
                            opacity: 0,
                            rotate: -10,
                            transition: { duration: 0.2 }
                        }}
                    >
                        <DraggableCard
                            post={activePost}
                            onSwipe={handleSwipe}
                            setHasInteracted={setHasInteracted}
                        />
                    </motion.div>
                </AnimatePresence>

            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center gap-6">
                <button
                    onClick={() => handleSwipe('left')}
                    className="w-16 h-16 bg-white border border-gray-100 rounded-full text-gray-400 flex items-center justify-center shadow-lg hover:bg-gray-50 hover:text-red-500 hover:scale-110 active:scale-95 transition-all"
                    aria-label="Skip"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-300 font-mono">
                    {currentIndex + 1} / {posts.length}
                </div>
                <button
                    onClick={() => handleSwipe('right')}
                    className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-xl shadow-black/20 hover:bg-zinc-800 hover:scale-110 active:scale-95 transition-all"
                    aria-label="Read"
                >
                    <ArrowRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

interface DraggableCardProps {
    post: Post;
    onSwipe: (dir: 'left' | 'right') => void;
    setHasInteracted: (v: boolean) => void;
}

const DraggableCard = ({ post, onSwipe, setHasInteracted }: DraggableCardProps) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const overlayOpacityRight = useTransform(x, [0, 150], [0, 0.4]);
    const overlayOpacityLeft = useTransform(x, [-150, 0], [0.4, 0]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            onSwipe('right');
        } else if (info.offset.x < -100) {
            onSwipe('left');
        }
    };

    return (
        <motion.div
            style={{ x, rotate, cursor: 'grab' }}
            whileTap={{ cursor: 'grabbing' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragStart={() => setHasInteracted(true)}
            onDragEnd={handleDragEnd}
            className="w-full h-full absolute inset-0"
        >
            <div className="w-full h-full bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden relative flex flex-col select-none">

                {/* Overlays */}
                <motion.div style={{ opacity: overlayOpacityRight }} className="absolute inset-0 bg-green-500 z-20 pointer-events-none mix-blend-multiply" />
                <motion.div style={{ opacity: overlayOpacityLeft }} className="absolute inset-0 bg-red-500 z-20 pointer-events-none mix-blend-multiply" />

                {/* Stamps */}
                <motion.div
                    style={{ opacity: useTransform(x, [50, 100], [0, 1]) }}
                    className="absolute top-8 left-8 z-30 border-4 border-green-500 text-green-500 rounded-lg px-4 py-2 font-black text-4xl uppercase tracking-widest -rotate-12 bg-white/90 backdrop-blur-sm shadow-sm"
                >
                    OPEN
                </motion.div>
                <motion.div
                    style={{ opacity: useTransform(x, [-100, -50], [1, 0]) }}
                    className="absolute top-8 right-8 z-30 border-4 border-red-500 text-red-500 rounded-lg px-4 py-2 font-black text-4xl uppercase tracking-widest rotate-12 bg-white/90 backdrop-blur-sm shadow-sm"
                >
                    SKIP
                </motion.div>

                <CardContent post={post} />
            </div>
        </motion.div>
    );
};

const Card = ({ post, isBackground = false }: { post: Post, isBackground?: boolean }) => (
    <div className={`w-full h-full bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden relative flex flex-col select-none ${isBackground ? 'scale-95 translate-y-4 opacity-50 contrast-50' : ''}`}>
        <CardContent post={post} />
    </div>
);

const CardContent = ({ post }: { post: Post }) => (
    <>
        <div className="relative h-[45%] shrink-0 overflow-hidden bg-gray-100">
            <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest rounded-full text-black shadow-sm">
                    {post.category}
                </span>
                {post.type === 'curated' && (
                    <div className="bg-black/80 backdrop-blur-sm text-white p-2 rounded-full">
                        <Globe className="w-3 h-3" />
                    </div>
                )}
            </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col flex-1 relative bg-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 font-mono">
                {post.author && (
                    <>
                        <span className="text-black">{post.author}</span>
                        <span className="text-gray-300">•</span>
                    </>
                )}
                <span>{post.date}</span>
                <span className="text-gray-300">•</span>
                <span>{post.readTime}</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3 leading-[1.15] line-clamp-3">
                {post.title}
            </h3>

            <p className="text-gray-500 leading-relaxed font-sans text-sm md:text-base line-clamp-4 mb-4">
                {post.excerpt}
            </p>

            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <X className="w-3 h-3" /> Skip
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-black uppercase tracking-widest">
                    Visit <ExternalLink className="w-3 h-3" />
                </div>
            </div>
        </div>
    </>
);

export default SwipeFeed;
