import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useContact } from "@/context/ContactContext";
import { useState } from "react";
import { toast } from "sonner";

const ContactDrawer = () => {
    const { isOpen, closeContact } = useContact();
    const [isLoading, setIsLoading] = useState(false);
    const [showDisco, setShowDisco] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        consent: false
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address";

        if (formData.phone) {
            const phoneDigits = formData.phone.replace(/\D/g, '');
            if (phoneDigits.length < 10) newErrors.phone = "Please enter a valid phone number";
        }

        if (!formData.message.trim()) newErrors.message = "Message is required";
        if (!formData.consent) newErrors.consent = "You must agree to the terms";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatPhoneNumber = (value: string) => {
        const phone = value.replace(/\D/g, '');
        if (phone.length < 4) return phone;
        if (phone.length < 7) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
        return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

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
                setErrors({});

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
        let val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        if (name === 'phone') {
            val = formatPhoneNumber(val as string);
        }

        setFormData(prev => ({ ...prev, [name]: val }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Disco Overlay (Triggers on Success) */}
                    <AnimatePresence>
                        {showDisco && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[80] bg-black flex flex-col items-center justify-center pointer-events-none overflow-hidden"
                            >
                                {/* Moving Disco Lights Background */}
                                <div className="absolute inset-0 opacity-40">
                                    <div className="absolute top-0 -left-1/4 w-full h-full bg-blue-500/30 blur-[100px] animate-pulse" style={{ animationDuration: '2s' }} />
                                    <div className="absolute bottom-0 -right-1/4 w-full h-full bg-purple-500/30 blur-[100px] animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }} />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_20deg,#ff0080_40deg,transparent_60deg,transparent_100deg,#00ffcc_140deg,transparent_160deg)] animate-[spin_4s_linear_infinite] opacity-20" />
                                </div>

                                {/* Disco Ball Drop */}
                                <motion.div
                                    initial={{ y: -500 }}
                                    animate={{ y: 0 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="absolute top-0 z-10"
                                >
                                    <div className="w-1 h-32 bg-gray-400 mx-auto" />
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-b from-gray-200 to-gray-400 relative overflow-hidden animate-spin shadow-[0_0_80px_rgba(255,255,255,0.6)] z-10 mx-auto -mt-1">
                                        {/* Elaborate facets */}
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#fff_5px,#fff_6px)] opacity-50" />
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,#333_5px,#333_6px)] opacity-30" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, type: "spring" }}
                                    className="relative z-20 text-center text-white p-12 bg-black/60 backdrop-blur-xl rounded-3xl border border-white/20 mt-40 max-w-lg mx-6 shadow-2xl"
                                >
                                    <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400 animate-pulse">
                                        Party Time!
                                    </h2>
                                    <p className="text-xl md:text-2xl font-light font-sans text-white/90 leading-relaxed">
                                        Message received loud and clear. <br />
                                        <span className="text-accent font-bold">Dan</span> will get back to you within 24 hours.
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Sliding Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white border-l border-gray-200 shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header - Sticky */}
                        <div className="flex justify-between items-center p-8 bg-black border-b border-gray-800 shrink-0 z-10">
                            <div>
                                <h3 className="text-3xl font-serif font-bold text-white tracking-tight">Get in Touch</h3>
                                <p className="text-gray-400 mt-1 font-sans">Let's do something extraordinary together.</p>
                            </div>
                            <button
                                onClick={closeContact}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <form className="space-y-6 pb-8" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className={`w-full bg-gray-50 border rounded-lg px-4 py-4 text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-gray-400 font-sans ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="name@company.com"
                                            className={`w-full bg-gray-50 border rounded-lg px-4 py-4 text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-gray-400 font-sans ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="(555) 555-5555"
                                            className={`w-full bg-gray-50 border rounded-lg px-4 py-4 text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-gray-400 font-sans ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                                    <textarea
                                        rows={5}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell me about your project..."
                                        className={`w-full bg-gray-50 border rounded-lg px-4 py-4 text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-gray-400 font-sans resize-none ${errors.message ? 'border-red-500' : 'border-gray-200'}`}
                                    />
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <div className={`flex items-start gap-4 p-5 bg-gray-50 rounded-xl border ${errors.consent ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}>
                                        <input
                                            type="checkbox"
                                            id="consent"
                                            name="consent"
                                            checked={formData.consent}
                                            onChange={handleChange}
                                            className="mt-1 w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                                        />
                                        <label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed font-sans">
                                            By submitting this form, you agree to receive communications from Dan Jimmerson. Your data is secure.
                                        </label>
                                    </div>
                                    {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-5 bg-blue-600 text-white font-bold text-lg rounded-full hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                                >
                                    {isLoading ? "Sending..." : "Send Message"} <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContactDrawer;

