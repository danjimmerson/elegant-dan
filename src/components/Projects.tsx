import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";

const projects = [
    {
        id: 1,
        title: "Neon Horizon",
        category: "Brand Strategy",
        description: "A complete rebrand for a fintech unicorn, focusing on trust, speed, and the future of money.",
        color: "from-accent to-accent-tangerine",
        tags: ["Strategy", "Identity", "Web Design"]
    },
    {
        id: 2,
        title: "Velocity AI",
        category: "Product Design",
        description: "Designing the interface for a next-gen AI agent that feels human, intuitive, and incredibly fast.",
        color: "from-accent-jungle to-accent-amber",
        tags: ["UI/UX", "React", "AI Integration"]
    },
    {
        id: 3,
        title: "Echo Chamber",
        category: "Web Development",
        description: "An immersive audio-visual experience for a music festival, built with Three.js and WebGL.",
        color: "from-accent-lavender to-accent-copper",
        tags: ["Three.js", "WebGL", "Audio API"]
    }
];

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["0 1", "1.2 1"]
    });

    const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

    return (
        <motion.div
            ref={ref}
            style={{
                scale: scaleProgress,
                opacity: opacityProgress,
            }}
            className="group relative w-full rounded-3xl overflow-hidden border border-white/20 bg-card flex flex-col"
        >
            {/* Image/Gradient Area */}
            <div className="relative h-[300px] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Placeholder for project preview - using icon for now */}
                    <div className="p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                        <ArrowUpRight className="w-8 h-8 text-white/50" />
                    </div>
                </div>

                {/* Badge */}
                <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-md text-sm font-medium text-white">
                        {project.category}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 lg:p-10 flex flex-col gap-6 bg-card border-t border-white/10">
                <div>
                    <h3 className="text-3xl lg:text-4xl font-sans font-bold mb-4 text-white group-hover:text-accent transition-colors duration-300 tracking-tight">
                        {project.title}
                    </h3>
                    <p className="text-lg text-gray-400 max-w-xl font-sans leading-relaxed">
                        {project.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag: string) => (
                            <span key={tag} className="text-sm text-muted-foreground/60 font-mono">#{tag}</span>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/20">
                            <Github className="w-5 h-5 text-white" />
                        </button>
                        <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/20">
                            <ExternalLink className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    return (
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-background">
            <div className="container mx-auto">
                <div className="mb-12 lg:mb-20">
                    <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight whitespace-nowrap tracking-tighter">Selected Works</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        A curation of projects where strategy meets execution.
                    </p>
                </div>

                <div className="space-y-8 lg:space-y-20">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
