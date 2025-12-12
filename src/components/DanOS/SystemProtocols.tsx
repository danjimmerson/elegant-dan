import { motion } from "framer-motion";

export const SystemProtocols = () => {
    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50/50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 border-b-2 border-black pb-6">
                    <h2 className="text-3xl font-serif font-bold mb-3 tracking-tight">
                        System Protocols
                    </h2>
                    <p className="text-xl text-gray-600 font-sans font-light">
                        What I actually do
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Core Protocols */}
                    <div className="grid gap-6">
                        <Feature
                            title="Translation Strategy"
                            description="Translate firm goals into channel strategy, budgets, and CAC targets."
                        />
                        <Feature
                            title="Channel Mix Ownership"
                            description="Own the mix across brand, PI lead gen, paid/local search, and social."
                        />
                        <Feature
                            title="Feedback Loops"
                            description="Build feedback loops with intake, call center, and ops to optimize for cases, not clicks."
                        />
                        <Feature
                            title="Experimentation Engine"
                            description="Design experiments, kill what doesn't work fast, double-down on what moves pipeline."
                        />
                    </div>

                    {/* Active Modules */}
                    <div>
                        <h3 className="font-bold border-b-2 border-black pb-2 mb-4 uppercase tracking-widest text-sm">
                            Active Modules
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                "Revenue Marketing",
                                "GEO / AEO",
                                "Growth Strategy",
                                "Data Engineering",
                                "Full-Funnel Analytics",
                                "Conversion Rate Opt"
                            ].map((module) => (
                                <motion.div
                                    key={module}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="bg-white px-4 py-3 rounded border border-gray-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                                >
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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

const Feature = ({ title, description }: { title: string; description: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
        <h3 className="font-bold text-lg mb-2 flex items-start gap-3">
            <span className="text-accent mt-1">✦</span>
            {title}
        </h3>
        <p className="text-gray-700 leading-relaxed font-sans pl-6">
            {description}
        </p>
    </motion.div>
);
