import { motion } from "framer-motion";

export const PersonalInjury = () => {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-gray-50/50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 border-b-2 border-black pb-6">
                    <h2 className="text-3xl font-serif font-bold mb-3 tracking-tight">
                        Why Work with Dan Jimmerson in Personal Injury?
                    </h2>
                    <p className="text-xl text-gray-600 font-sans font-light">
                        A Strategic Advantage for PI Firms in a Volatile Market
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6">
                    <Feature
                        title="Scaled leadership at the top of the industry"
                        description="As CMO of DK Law and Alexander Shunnarah Trial Attorneys, Dan directed some of the largest PI marketing budgets in the country, driving hundreds of millions in case pipeline through brand, performance marketing, and conversion optimization."
                    />

                    <Feature
                        title="Proven ability to turn volatility into momentum"
                        description="Helps firms stabilize cost-per-case, diversify channel mix, and cushion their brand against rising competition and ad inflation."
                    />

                    <Feature
                        title="Deep channel expertise across the entire funnel"
                        description="Proven success managing paid and local search, social, OTT/CTV, and lead gen ecosystems with a data-driven approach that ties capital deployment to signed cases."
                    />

                    <Feature
                        title="PI Market vision"
                        description="Proven success in GEO, search everywhere optimization, agentic workflows and automation; understands how first-party data, brand authenticity, and LLM visibility is defining the next era of PI marketing."
                    />

                    <Feature
                        title="Built and led elite marketing operations"
                        description="From creative and media to BI, integrations, and call-center performance; Dan knows how to unify teams, vendors, and systems for full-funnel transparency and growth."
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
