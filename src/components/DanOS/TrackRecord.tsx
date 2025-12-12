import { motion } from "framer-motion";

export const TrackRecord = () => {
    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50/50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 border-b-2 border-black pb-6">
                    <h2 className="text-3xl font-serif font-bold mb-3 tracking-tight">
                        Track Record
                    </h2>
                    <p className="text-xl text-gray-600 font-sans font-light">
                        I've led marketing at PI firms operating at national scale and high spend.
                    </p>
                </div>

                <div className="grid gap-6">
                    <Feature
                        title="Triple-Digit Growth"
                        description="Drove triple-digit growth in lead volume while stabilizing cost-per-case."
                    />
                    <Feature
                        title="Local Search Dominance"
                        description="Rebuilt local search + GMB to 3x inbound volume in key markets."
                    />
                    <Feature
                        title="Massive Audience Growth"
                        description="Launched brand and social programs that added tens of thousands of followers/subscribers in months."
                    />
                    <Feature
                        title="Full-Stack Transformations"
                        description="Led full-firm rebrands and website relaunches (strategy → design → UX → performance → CRO) on aggressive timelines."
                    />
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
        <h3 className="font-bold text-lg mb-3 flex items-start gap-3">
            <span className="text-accent mt-1">✦</span>
            {title}
        </h3>
        <p className="text-gray-700 leading-relaxed font-sans pl-6">
            {description}
        </p>
    </motion.div>
);
