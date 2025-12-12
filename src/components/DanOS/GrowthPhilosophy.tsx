import { motion } from "framer-motion";

export const GrowthPhilosophy = () => {
    return (
        <div className="p-8 h-full overflow-y-auto bg-gray-50/50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 border-b-2 border-black pb-6 sticky top-0 bg-[#f9fafb] z-10 pt-2">
                    <h2 className="text-3xl font-serif font-bold mb-3 tracking-tight">
                        Growth Philosophy
                    </h2>
                    <p className="text-xl text-gray-600 font-sans font-light">
                        How I think about growth
                    </p>
                </div>

                <div className="space-y-4">
                    {[
                        { title: "1. Speed is Strategy.", desc: "In a digital world, the fastest learner wins. Perfection is the enemy of profit; we ship, learn, and pivot immediately." },
                        { title: "2. Push Unreasonable Hospitality.", desc: "Service isn't a line item; it's a memory maker. We don't just solve problems; we curate unexpected moments of delight that turn customers into fanatics." },
                        { title: "3. Clarity Trumps Persuasion.", desc: "A confused prospect never buys. We stop trying to be clever with words and start being impossible to misunderstand." },
                        { title: "4. Test, Don't Guess.", desc: "The market is the only opinion that matters. We leave our egos at the door and let the data dictate the direction." },
                        { title: "5. The Offer > The Ads.", desc: "No amount of brilliant copywriting can fix a bad product. We solve the value equation first so the marketing becomes easy." },
                        { title: "6. Simplicity Scales.", desc: "Complex funnels break; simple systems compound. We strip away the noise until only the essential remains." },
                        { title: "7. Volume Negates Luck.", desc: "You don't need to be the smartest person in the room if you take 10x more swings than everyone else. We outwork the variance." },
                        { title: "8. Friction Kills Deals.", desc: "The biggest competitor isn't another company; it's the customer's effort. Every extra click or second of load time is a barrier we must remove." },
                        { title: "9. Inputs Over Outcomes.", desc: "We can't control the revenue (lag), only the daily actions (lead) that create it. Obsess over the work, and the numbers take care of themselves." },
                        { title: "10. Give First, Ask Later.", desc: "Radical generosity builds authority faster than any sales pitch. We provide value upfront so the \"ask\" feels like a natural next step." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                        >
                            <h3 className="font-bold text-lg mb-2 text-black">{item.title}</h3>
                            <p className="text-gray-700 leading-relaxed font-sans">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
