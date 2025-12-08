import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useContact } from "@/context/ContactContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ContactDrawer = () => {
    const { isOpen, closeContact } = useContact();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Form submission started");
        console.log("Form Data:", formData);

        // Check if Supabase client is initialized
        if (!supabase) {
            console.error("Supabase client is not initialized");
            toast.error("System Error: Database connection missing");
            setIsLoading(false);
            return;
        }

        try {
            console.log("Sending request to Supabase...");
            const { data, error } = await supabase
                .from('contact_submissions')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        message: formData.message
                    }
                ])
                .select();

            if (error) {
                console.error("Supabase Error:", error);
                throw error;
            }

            console.log("Supabase Success:", data);
            toast.success("Message sent successfully!");
            setFormData({ name: "", email: "", message: "" });
            closeContact();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(`Failed to send: ${(error as Error).message || "Unknown error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

