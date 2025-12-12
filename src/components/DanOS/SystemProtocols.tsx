import { motion } from "framer-motion";
import {
    LayoutTemplate, MessagesSquare, Repeat, FlaskConical,
    Sparkles, Palette, HardDrive, Zap
} from "lucide-react";

export const SystemProtocols = () => {
    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50/50">
            <div className="max-w-4xl mx-auto pb-12">
                {/* Header */}
                <div className="mb-8 border-b-2 border-black pb-6">
                    <h2 className="text-3xl font-serif font-bold mb-3 tracking-tight">
                        System Protocols
                    </h2>
                    <p className="text-xl text-gray-600 font-sans font-light">
                        What I actually do
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Core Protocols */}
                    <div className="grid gap-6">
                        <Feature
                            icon={LayoutTemplate}
                            title="1. Revenue Architecture"
                            description="Design growth systems that turn attention into predictable revenue—not vanity metrics. I align brand, channels, data, and intake so every dollar and decision ladders up to pipeline and profit."
                        />
                        <Feature
                            icon={MessagesSquare}
                            title="2. C-Suite Translation"
                            description="Translate executive goals into channel strategy, budgets, CAC targets, and operating plans. This is where vision becomes math—and math becomes execution."
                        />
                        <Feature
                            icon={Repeat}
                            title="3. Full-Funnel Ownership"
                            description="Own the entire funnel across brand, paid, search, social, CRO, and lifecycle. No silos. No handoffs. Just one accountable system from first touch to closed revenue."
                        />
                        <Feature
                            icon={FlaskConical}
                            title="4. Experimentation Engine"
                            description="Design high-velocity experiments, kill what doesn't work fast, and double down on what compounds. Every test is built to answer a revenue question—not a marketing curiosity."
                        />
                        <Feature
                            icon={Sparkles}
                            title="5. Brand That Converts"
                            description="Build brands people remember and trust enough to take action. Positioning, narrative, visual identity, and creative systems that lift both recall and conversion."
                        />
                        <Feature
                            icon={Palette}
                            title="6. Performance With Taste"
                            description="Run paid media, search, and growth programs with creative rigor and cost discipline. Performance marketing that respects the brand—and the P&L."
                        />
                        <Feature
                            icon={HardDrive}
                            title="7. Systems, Not Campaigns"
                            description="Build durable marketing infrastructure that scales across markets, teams, and cycles. Attribution, analytics, workflows, and feedback loops designed to compound over time."
                        />
                    </div>

                    {/* Active Modules */}
                    <div>
                        <h3 className="font-bold border-b-2 border-black pb-2 mb-6 uppercase tracking-widest text-sm">
                            Active Modules
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                "Revenue Marketing",
                                "Growth Strategy & GTM",
                                "GEO / AEO / Search Everywhere",
                                "Full-Funnel Analytics & Attribution",
                                "Conversion Rate Optimization",
                                "Brand Strategy & Positioning",
                                "Paid Media & Performance Systems",
                                "Creative Direction & Production",
                                "Web, UX, and Experience Design",
                                "Experimentation & Testing Frameworks",
                                "Marketing Ops & Data Engineering",
                                "AI-Enabled Workflows & Automation"
                            ].map((module) => (
                                <motion.div
                                    key={module}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="bg-white px-4 py-3 rounded border border-gray-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                                >
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
                                    {module}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Feature = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
    >
        <div className="shrink-0 p-3 bg-gray-50 rounded-lg border border-gray-200 text-black">
            <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <div>
            <h3 className="font-bold text-lg mb-2 text-black">
                {title}
            </h3>
            <p className="text-gray-700 leading-relaxed font-sans">
                {description}
            </p>
        </div>
    </motion.div>
);
