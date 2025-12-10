import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const Newsletter = () => {
    return (
        <section className="py-24 bg-black text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
                <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] rounded-full bg-blue-900/30 blur-[120px]" />
                <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-900/30 blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-white/80 mb-8 border border-white/10">
                            <Sparkles className="w-3 h-3 text-yellow-300" />
                            <span>Join the Inner Circle</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-tight leading-tight">
                            Intellectual Capital,<br />Delivered Weekly.
                        </h2>

                        <p className="text-lg text-gray-400 mb-10 leading-relaxed font-light">
                            Join 15,000+ designers and strategists. No fluff, just deep dives into brand architecture, spatial computing, and the future of digital product design.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-medium"
                            />
                            <button className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group">
                                Subscribe <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <p className="mt-6 text-xs text-gray-600">
                            Unsubscribe at any time. We respect your inbox.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
