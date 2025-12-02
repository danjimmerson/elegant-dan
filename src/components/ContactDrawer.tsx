import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useContact } from "@/context/ContactContext";

const ContactDrawer = () => {
    const { isOpen, closeContact } = useContact();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeContact}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white/90 border-l border-white/20 backdrop-blur-xl z-[70] p-6 md:p-12 overflow-y-auto shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8 md:mb-12">
                            <h3 className="text-3xl font-serif font-bold text-black">Let's Talk</h3>
                            <button
                                onClick={closeContact}
                                className="p-2 rounded-full hover:bg-black/5 transition-colors text-black"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form className="space-y-6 md:space-y-8" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <label className="text-sm font-mono text-gray-500 uppercase tracking-wider">What's your name?</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full bg-transparent border-b border-black/10 py-4 text-xl text-black focus:outline-none focus:border-accent transition-colors placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-mono text-gray-500 uppercase tracking-wider">Your Email</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full bg-transparent border-b border-black/10 py-4 text-xl text-black focus:outline-none focus:border-accent transition-colors placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-mono text-gray-500 uppercase tracking-wider">Details</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell me more about you..."
                                    className="w-full bg-transparent border-b border-black/10 py-4 text-xl text-black focus:outline-none focus:border-accent transition-colors placeholder:text-gray-300 resize-none"
                                />
                            </div>

                            <button className="w-full py-6 bg-black text-white font-bold text-lg rounded-full hover:bg-accent transition-colors flex items-center justify-center gap-3 mt-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Send Message <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContactDrawer;
