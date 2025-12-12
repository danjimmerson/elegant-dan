import { motion } from "framer-motion";
import { TrendingUp, Network, Palette, MapPin } from "lucide-react";

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
                        icon={TrendingUp}
                        title="~120% Lead Volume Increase"
                        description="Transformed single-channel acquisition into a diversified growth engine, delivering ~120% increase in lead volume and nearly doubling signed-case acquisition YoY."
                    />
                    <Feature
                        icon={Network}
                        title="Full-Funnel Attribution Model"
                        description="Architected the firm's marketing infrastructure linking every dollar of spend to signed-case revenue via advanced attribution, intake-to-case analytics, and BI transparency."
                    />
                    <Feature
                        icon={Palette}
                        title="Strategic Rebranding & Positioning"
                        description="Led full-firm rebrand designing visual identity, mission, and brand architecture that drives creative, content, and GTM alignment for multi-state expansion."
                    />
                    <Feature
                        icon={MapPin}
                        title="SEO & Local Dominance"
                        description="Lifted priority organic rankings from mid-30s to top 10 within 90 days post-launch and tripled local/organic lead flow through schema mastery and CRO."
                    />
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
