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
                        {/* Header - Sticky with "Pop" */}
                        <div className="flex justify-between items-start p-8 bg-black text-white shrink-0 z-10 relative overflow-hidden">
                            {/* Decorative accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[50px] rounded-full pointer-events-none" />

                            <div className="relative z-10">
                                <h3 className="text-4xl font-serif font-bold tracking-tight mb-2">Get in Touch</h3>
                                <p className="text-white/70 font-sans text-sm tracking-wide uppercase">Let's build something extraordinary</p>
                            </div>
                            <button
                                onClick={closeContact}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <form className="space-y-10 pb-6" onSubmit={handleSubmit}>
                                {/* Name Input */}
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder=" "
                                        className={`peer w-full bg-transparent border-b border-gray-300 py-3 text-lg font-sans text-black focus:border-black focus:outline-none transition-colors placeholder-transparent ${errors.name ? 'border-red-500' : ''}`}
                                    />
                                    <label
                                        htmlFor="name"
                                        className={`absolute left-0 top-3 text-gray-500 cursor-text transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs font-medium tracking-wide ${errors.name ? 'text-red-500' : ''}`}
                                    >
                                        NAME
                                    </label>
                                    {errors.name && <p className="absolute -bottom-5 left-0 text-red-500 text-[10px] uppercase font-bold tracking-wider">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Email Input */}
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder=" "
                                            className={`peer w-full bg-transparent border-b border-gray-300 py-3 text-lg font-sans text-black focus:border-black focus:outline-none transition-colors placeholder-transparent ${errors.email ? 'border-red-500' : ''}`}
                                        />
                                        <label
                                            htmlFor="email"
                                            className={`absolute left-0 top-3 text-gray-500 cursor-text transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs font-medium tracking-wide ${errors.email ? 'text-red-500' : ''}`}
                                        >
                                            EMAIL
                                        </label>
                                        {errors.email && <p className="absolute -bottom-5 left-0 text-red-500 text-[10px] uppercase font-bold tracking-wider">{errors.email}</p>}
                                    </div>

                                    {/* Phone Input */}
                                    <div className="relative group">
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder=" "
                                            className={`peer w-full bg-transparent border-b border-gray-300 py-3 text-lg font-sans text-black focus:border-black focus:outline-none transition-colors placeholder-transparent ${errors.phone ? 'border-red-500' : ''}`}
                                        />
                                        <label
                                            htmlFor="phone"
                                            className={`absolute left-0 top-3 text-gray-500 cursor-text transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs font-medium tracking-wide ${errors.phone ? 'text-red-500' : ''}`}
                                        >
                                            PHONE
                                        </label>
                                        {errors.phone && <p className="absolute -bottom-5 left-0 text-red-500 text-[10px] uppercase font-bold tracking-wider">{errors.phone}</p>}
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div className="relative group pt-4">
                                    <textarea
                                        rows={3}
                                        name="message"
                                        id="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder=" "
                                        className={`peer w-full bg-transparent border-b border-gray-300 py-3 text-lg font-sans text-black focus:border-black focus:outline-none transition-colors placeholder-transparent resize-none ${errors.message ? 'border-red-500' : ''}`}
                                    />
                                    <label
                                        htmlFor="message"
                                        className={`absolute left-0 top-7 text-gray-500 cursor-text transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs font-medium tracking-wide ${errors.message ? 'text-red-500' : ''}`}
                                    >
                                        SHARE ANYTHING YOU'D LIKE TO CHAT ABOUT
                                    </label>
                                    {errors.message && <p className="absolute -bottom-5 left-0 text-red-500 text-[10px] uppercase font-bold tracking-wider">{errors.message}</p>}
                                </div>

                                {/* Consent Checkbox */}
                                <div className="pt-2">
                                    <label className="flex items-start gap-4 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                name="consent"
                                                checked={formData.consent}
                                                onChange={handleChange}
                                                className="peer sr-only"
                                            />
                                            <div className={`w-5 h-5 border-2 rounded transition-colors ${formData.consent ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                                                {formData.consent && <Send className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stroke-[3]" />}
                                            </div>
                                        </div>
                                        <span className={`text-xs leading-relaxed transition-colors ${errors.consent ? 'text-red-500' : 'text-gray-500 group-hover:text-black'}`}>
                                            By submitting this form, you agree to receive communications from Dan Jimmerson.<br />Your data is secure.
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-5 bg-black text-white font-bold text-lg rounded-full hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest mt-8"
                                >
                                    {isLoading ? "Sending..." : "Send Input"} <Send className="w-4 h-4" />
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
