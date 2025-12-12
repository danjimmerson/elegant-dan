import { motion } from "framer-motion";
import {
    TrendingUp, Target, Rocket, Globe, Zap,
    ShieldCheck, Wrench, Lightbulb, Palette,
    CircleDollarSign
} from "lucide-react";

export const TrackRecord = () => {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-gray-50/50">
            <div className="max-w-4xl mx-auto pb-12">
                {/* Main Header */}
                <div className="mb-12 border-b-2 border-black pb-6">
                    <h2 className="text-3xl font-serif font-bold mb-3 tracking-tight">
                        Track Record
                    </h2>
                    <p className="text-xl text-gray-600 font-sans font-light">
                        Driving growth across Law, SaaS, and GovTech.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Section: Law Firms */}
                    <Section title="Law Firms (Personal Injury, High-Volume, Multi-Market)">
                        <Feature
                            icon={TrendingUp}
                            title="~120% Lead Growth, Nearly 2× Signed Cases YoY"
                            description={
                                <>
                                    <strong>Outcome:</strong> More than doubled inbound demand and signed cases while maintaining intake efficiency.<br />
                                    <strong>System Built:</strong> Full-funnel acquisition engine spanning paid, local, organic, OTT/CTV, social, and lead-gen—fully aligned to intake and case capacity.
                                </>
                            }
                        />
                        <Feature
                            icon={Target}
                            title="Predictable Paid Acquisition at Scale"
                            description={
                                <>
                                    <strong>Outcome:</strong> Paid media drove ~70% of total lead volume with disciplined cost-per-case control.<br />
                                    <strong>System Built:</strong> Geo-segmented media architecture, creative testing engine, and performance governance model.
                                </>
                            }
                        />
                        <Feature
                            icon={CircleDollarSign}
                            title="Marketing Spend Fully Tied to Signed Revenue"
                            description={
                                <>
                                    <strong>Outcome:</strong> Executive-level clarity into ROI, velocity, and lifetime value across markets.<br />
                                    <strong>System Built:</strong> Intake-to-case attribution, BI dashboards, and forecasting models linking spend to signed outcomes.
                                </>
                            }
                        />
                    </Section>

                    {/* Section: Software Companies */}
                    <Section title="Software Companies (SaaS, Enterprise, B2B/B2C)">
                        <Feature
                            icon={Rocket}
                            title="2,900% Lead Growth in <6 Months"
                            description={
                                <>
                                    <strong>Outcome:</strong> Explosive pipeline expansion following GTM reset.<br />
                                    <strong>System Built:</strong> Integrated demand engine combining ABM, automation, SEO, paid media, and CRO.
                                </>
                            }
                        />
                        <Feature
                            icon={Globe}
                            title="1.8× Revenue Growth Multiple Verticals"
                            description={
                                <>
                                    <strong>Outcome:</strong> Accelerated adoption across 7+ industries, domestic and international.<br />
                                    <strong>System Built:</strong> Market-specific positioning, messaging frameworks, and sales enablement systems.
                                </>
                            }
                        />
                        <Feature
                            icon={Zap}
                            title="Pipeline Velocity Increased 2.2×"
                            description={
                                <>
                                    <strong>Outcome:</strong> Faster deal cycles and materially higher conversion efficiency.<br />
                                    <strong>System Built:</strong> Company-wide MarTech overhaul spanning CRM, marketing automation, sales enablement, and customer success.
                                </>
                            }
                        />
                    </Section>

                    {/* Section: DoD / GovTech */}
                    <Section title="DoD / GovTech Startup">
                        <Feature
                            icon={ShieldCheck}
                            title="7-Figure Revenue in <24 Months"
                            description={
                                <>
                                    <strong>Outcome:</strong> Rapid commercialization in a highly regulated environment.<br />
                                    <strong>System Built:</strong> End-to-end GTM strategy, pipeline automation, and sales operations infrastructure.
                                </>
                            }
                        />
                        <Feature
                            icon={Wrench}
                            title="$3M+ Saved by Building In-House"
                            description={
                                <>
                                    <strong>Outcome:</strong> Reduced dependency on agencies and accelerated time to market by 2+ years.<br />
                                    <strong>System Built:</strong> Custom LMS and enablement platforms designed and deployed internally.
                                </>
                            }
                        />
                        <Feature
                            icon={Lightbulb}
                            title="Category-Defining Thought Leadership"
                            description={
                                <>
                                    <strong>Outcome:</strong> Elevated brand credibility across public sector, media, and legislative audiences.<br />
                                    <strong>System Built:</strong> Content, PR, and partnership strategy anchored in trauma-informed, mission-driven positioning.
                                </>
                            }
                        />
                    </Section>

                    {/* Section: All Brands */}
                    <Section title="All Brands I've Worked With">
                        <Feature
                            icon={Palette}
                            title="Rebrands That Scale, Not Stall"
                            description={
                                <>
                                    <strong>Outcome:</strong> Full organizational rebrands executed without revenue or pipeline disruption.<br />
                                    <strong>System Built:</strong> Brand architecture, visual identity, messaging systems, and GTM alignment.
                                </>
                            }
                        />
                    </Section>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="font-bold border-b-2 border-gray-200 pb-2 mb-6 uppercase tracking-widest text-sm text-gray-500">
            {title}
        </h3>
        <div className="grid gap-6">
            {children}
        </div>
    </div>
);

const Feature = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: React.ReactNode }) => (
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
            <div className="text-gray-700 leading-relaxed font-sans text-sm space-y-1">
                {description}
            </div>
        </div>
    </motion.div>
);
