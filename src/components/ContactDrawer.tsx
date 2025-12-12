import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useContact } from "@/context/ContactContext";
import { useState } from "react";
import { toast } from "sonner";

const ContactDrawer = () => {
    const { isOpen, closeContact } = useContact();
    const [isLoading, setIsLoading] = useState(false);
    const [showDisco, setShowDisco] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        consent: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const FORMSPREE_ENDPOINT = "https://formspree.io/f/myzrbqgo";

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Trigger Disco Party
                setShowDisco(true);
                setFormData({ name: "", email: "", phone: "", message: "", consent: false });

                // Close after 4 seconds (time for the party!)
                setTimeout(() => {
                    setShowDisco(false);
                    closeContact();
                }, 4000);
            } else {
                const data = await response.json();
                if (data && 'errors' in data) {
                    throw new Error(data["errors"].map((error: any) => error["message"]).join(", "));
                } else {
                    throw new Error("Oops! There was a problem submitting your form");
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(`Failed to send: ${(error as Error).message || "Unknown error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => ({ ...prev, [name]: val }));
    };

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

                    {/* Disco Overlay */}
                    <AnimatePresence>
                        {showDisco && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[80] bg-black/80 flex flex-col items-center justify-center pointer-events-none"
                            >
                                {/* Disco Ball */}
                                <motion.div
                                    initial={{ y: -500 }}
                                    animate={{ y: 0 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="absolute top-0"
                                >
                                    <div className="w-1 h-20 bg-gray-400 mx-auto" />
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-b from-gray-200 to-gray-400 relative overflow-hidden animate-spin shadow-[0_0_50px_rgba(255,255,255,0.8)]">
                                        {/* Simple disco ball facets grid */}
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#fff_5px,#fff_6px)] opacity-50" />
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,#000_5px,#000_6px)] opacity-20" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center text-white p-8 bg-black/50 backdrop-blur-md rounded-2xl border border-white/20 mt-32"
                                >
                                    <h2 className="text-4xl font-bold mb-4 animate-pulse text-accent">Great job, party time! 🎉</h2>
                                    <p className="text-xl font-mono">Dan received your message and will reply within 24 business hours.</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

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

                        <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-mono text-gray-500 uppercase tracking-wider">What's your name?</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full bg-transparent border-b border-black/10 py-4 text-xl text-black focus:outline-none focus:border-accent transition-colors placeholder:text-gray-300"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-mono text-gray-500 uppercase tracking-wider">Your Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                        className="w-full bg-transparent border-b border-black/10 py-4 text-xl text-black focus:outline-none focus:border-accent transition-colors placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-mono text-gray-500 uppercase tracking-wider">Phone (Optional)</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="(555) 555-5555"
                                        className="w-full bg-transparent border-b border-black/10 py-4 text-xl text-black focus:outline-none focus:border-accent transition-colors placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-mono text-gray-500 uppercase tracking-wider">Details</label>
                                <textarea
                                    rows={4}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell me more about you..."
                                    required
                                    className="w-full bg-transparent border-b border-black/10 py-4 text-xl text-black focus:outline-none focus:border-accent transition-colors placeholder:text-gray-300 resize-none"
                                />
                            </div>

                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    name="consent"
                                    checked={formData.consent}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-4 h-4 text-black border-black/20 rounded focus:ring-accent"
                                />
                                <label htmlFor="consent" className="text-sm text-gray-500 leading-relaxed">
                                    I agree that Dan Jimmerson may contact me via email or phone. I understand I can opt out at any time.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-6 bg-black text-white font-bold text-lg rounded-full hover:bg-accent transition-colors flex items-center justify-center gap-3 mt-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Sending..." : "Send Message"} <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContactDrawer;

