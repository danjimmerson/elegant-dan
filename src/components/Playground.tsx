import { motion } from "framer-motion";
import { Gamepad2, Code2, Sparkles } from "lucide-react";

const Playground = () => {
    const items = [
        {
            id: 1,
            title: "DanPong",
            category: "Interactive Game",
            icon: <Gamepad2 className="w-8 h-8" />,
            description: "A retro-style breakout game built with React & Canvas.",
            color: "bg-blue-500"
        },
        {
            id: 2,
            title: "Neural Feed",
            category: "Experiment",
            icon: <Sparkles className="w-8 h-8" />,
            description: "AI-curated content stream with sentiment analysis.",
            color: "bg-purple-500"
        },
        {
            id: 3,
            title: "System Design",
            category: "Architecture",
            icon: <Code2 className="w-8 h-8" />,
            description: "Visualizing complex marketing systems as code.",
            color: "bg-green-500"
        }
    ];

    return (
        <section className="py-32 bg-black text-white overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="mb-16">
                    <span className="text-accent font-bold tracking-widest uppercase mb-4 block">Playground</span>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
                        Work & Play
                    </h2>
                    <p className="text-xl text-gray-400 mt-6 max-w-2xl">
                        A collection of experiments, side projects, and digital toys.
                        Where code meets creativity.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-[2rem] border border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-10 blur-[60px] group-hover:opacity-20 transition-opacity`} />

                            <div className="relative z-10">
                                <div className="mb-6 p-4 bg-white/10 rounded-2xl w-fit text-white">
                                    {item.icon}
                                </div>

                                <div className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
                                    {item.category}
                                </div>

                                <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-gray-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Playground;
