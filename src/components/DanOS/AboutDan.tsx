import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Heart, Mountain, Trophy, Coffee, Globe, Briefcase, TrendingUp, Award, Star } from "lucide-react";
import pixelAvatar from "@/assets/pixel_avatar.jpg";

interface Fact {
    id: string;
    icon: React.ElementType;
    label: string;
    title: string;
    description: string;
    color: string;
}

const facts: Fact[] = [
    {
        id: "experience",
        icon: Briefcase,
        label: "Experience",
        title: "15+ Years Experience",
        description: "Track record of scaling high-growth companies and leading elite marketing teams to drive sustainable revenue and market expansion.",
        color: "text-black"
    },
    {
        id: "revenue",
        icon: TrendingUp,
        label: "Revenue",
        title: "Over $2B+ Generated",
        description: "Proven track record of driving massive business value through strategic technical execution.",
        color: "text-green-600"
    },
    {
        id: "execution",
        icon: Star,
        label: "Awards",
        title: "2x Execution Award Winner",
        description: "Recognized for being the employee who can execute the most. I don't just plan; I deliver.",
        color: "text-amber-500"
    },
    {
        id: "microsoft",
        icon: Award,
        label: "Recognition",
        title: "3x Microsoft Partner Awards",
        description: "Fostered business development across partner channels, resulting in 3 prestigious Microsoft awards in 2 years: ISV, Public Sector, and Health & Human Service Partner of the Year.",
        color: "text-blue-500"
    },
    {
        id: "family",
        icon: Heart,
        label: "Family",
        title: "Proud Dad & Husband",
        description: "Family man and proud dad of 2. Living in the foothills of Boulder, CO, camping and exploring the mountains together.",
        color: "text-red-600"
    },
    {
        id: "outdoors",
        icon: Mountain,
        label: "Outdoors",
        title: "Mountain Life",
        description: "Regularly heading into the mountains for hikes, trail runs, and adventures. Nature is the ultimate reset button.",
        color: "text-green-600"
    },
    {
        id: "curling",
        icon: Trophy,
        label: "Curling",
        title: "The Roaring Game",
        description: "I curl year-round and travel for bonspiels. It's a silly sport, but the technicality keeps me grounded and focused.",
        color: "text-blue-600"
    },
    {
        id: "coffee",
        icon: Coffee,
        label: "Coffee",
        title: "Coffee Obsessed",
        description: "Former coffee shop owner, now a home barista with an ECM Synchronica. Always stepping up the latte art game.",
        color: "text-amber-700"
    },
    {
        id: "travel",
        icon: Globe,
        label: "Travel",
        title: "Global Perspective",
        description: "Taught English in Peru. That experience shaped my worldview and appreciation for different cultures.",
        color: "text-purple-600"
    }
];

export const AboutDan = () => {
    const [randomFacts, setRandomFacts] = useState<Fact[]>([]);

    useEffect(() => {
        // Simple shuffle function
        const shuffled = [...facts].sort(() => Math.random() - 0.5);
        setRandomFacts(shuffled);
    }, []);

    return (
        <div className="flex flex-col md:h-full md:flex-row bg-cream md:overflow-hidden">
            {/* Left Column: Avatar */}
            <div className="w-full md:w-1/3 bg-gray-200 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col items-center justify-center p-8 relative shrink-0">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 w-full aspect-square md:aspect-[3/5] md:max-h-[400px] mix-blend-multiply"
                >
                    <img
                        src={pixelAvatar}
                        alt="Dan Jimmerson 8-bit"
                        className="w-full h-full object-contain object-bottom md:object-cover md:object-top"
                        style={{ imageRendering: "pixelated" }}
                    />
                </motion.div>

                <div className="mt-6 text-center z-10">
                    <h2 className="text-2xl font-bold font-mono tracking-tighter">DAN JIMMERSON</h2>
                    <div className="text-xs font-bold bg-black text-white px-2 py-1 inline-block mt-2 rounded">
                        LVL 43 MARKETER
                    </div>
                </div>
            </div>

            {/* Right Column: Stats/Facts */}
            <div className="w-full md:w-2/3 p-4 md:p-8 md:overflow-y-auto">
                <div className="space-y-6">
                    <div className="border-b-2 border-black pb-4 mb-6">
                        <h3 className="text-xl font-bold font-mono uppercase tracking-widest mb-2">About Dan</h3>
                        <p className="font-mono text-sm leading-relaxed text-gray-800 break-words">
                            A strategic marketer building scalable revenue engines and digital experiences.
                            Combines data science with creative strategy to drive innovation and market leadership.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {randomFacts.map((fact, index) => (
                            <motion.div
                                key={fact.id}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-4 items-start group"
                            >
                                <div className={`w-10 h-10 shrink-0 rounded border-2 border-black flex items-center justify-center bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 transition-transform`}>
                                    <fact.icon className={`w-5 h-5 ${fact.color}`} />
                                </div>
                                <div>
                                    <h4 className="font-bold font-mono text-sm uppercase mb-1">{fact.title}</h4>
                                    <p className="font-mono text-xs text-gray-600 leading-relaxed break-words">
                                        {fact.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
