import salImg from "@/assets/testimonials/testimonial-sal-new.jpg";
import johnImg from "@/assets/testimonials/testimonial-john-new.jpg";
import keithImg from "@/assets/testimonials/testimonial-keith-new.jpg";
import allisonImg from "@/assets/testimonials/testimonial-allison-new.jpg";
import wendeImg from "@/assets/testimonials/testimonial-wendy-new.jpg";
import leighImg from "@/assets/testimonials/testimonial-leigh.jpg";

export interface Testimonial {
    id: number;
    quote: string;
    author: string;
    role: string;
    company: string;
    image: string;
    color: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "Dan is one of the most talented digital marketing, technology and branding strategist that I’ve ever worked with. I worked and learned a lot from Dan during our time at an e-Commerce Marketing Automation startup. His go-to-market & branding strategy was brilliant and quickly helped drive revenue and new customers. It was at this moment that I realized that Dan was a natural talent and a true professional in his craft. If your looking for a world-class, innovative, results focused Marketer & Branding expert to help grow your business and drive real business results. I would highly suggest you give Dan a call right now. Highly recommended.",
        author: "Sal Stabler",
        role: "Co-Founder and CEO",
        company: "Nexlayer",
        image: salImg,
        color: "#6366f1" // Indigo
    },
    {
        id: 2,
        quote: "Dan is one of the most knowledgeable and dedicated persons that I have had the pleasure of working with in my career. Dan vigorously keeps up to date in current trends from marketing to technology. He is a very insightful people person and has the moral foundation that will add value to any organization. Dan is a visionary with a old soul which enables him to relate to multiple persons and also look to the future with respect for the past. Dan clearly defines his goals and approach to projects and completes task in a timely manner. Dan is able to lead multiple staff and teams within an organization and is an executive level professional.",
        author: "John Malcolm",
        role: "Chief Innovation and Technology Officer",
        company: "Cleveland Public Library",
        image: johnImg,
        color: "#10b981" // Emerald
    },
    {
        id: 3,
        quote: "Dan is a thought leader and innovator in the field of marketing. I've had the pleasure of working with Dan for the past 6 years and the results he's produced for us have been tremendous. He has the ability to think long term but not lose sight of what's needed each day to achieve our goals. Dan stays on top of the most current and effective techniques to generate new leads to keep our company a few steps ahead of our competition. By far, the smartest, most creative, and most capable head of marketing that I've worked with in my 25 year career.",
        author: "Keith Vargo",
        role: "President",
        company: "Vargo Consultants, LLC",
        image: keithImg,
        color: "#f59e0b" // Amber
    },
    {
        id: 4,
        quote: "Dan is one of the most talented, creative and results oriented marketing professionals that I have ever had the pleasure to work with. Dan has a great ability to process new concepts and turn them into solid action plans that drive business. I would always welcome the opportunity to work with Dan.",
        author: "Leigh Orlov",
        role: "Co-Founder",
        company: "CoCENTRIX",
        image: leighImg,
        color: "#ec4899" // Pink
    },
    {
        id: 5,
        quote: "Dan Jimmerson brings passion, deep knowledge of his customer base and an incredible amount of marketing know-how to work each day. I had the pleasure of working with Dan when he was in the Microsoft partner channel and he was exceptional. He not only developed a strong pipeline but also customer relationships, which were instrumental in driving continued success.",
        author: "Allison Dawson",
        role: "VP of Field Marketing, North America",
        company: "Zendesk",
        image: allisonImg,
        color: "#8b5cf6" // Violet
    },
    {
        id: 6,
        quote: "I worked with Dan Jimmerson while he was the Senior Marketing Director at CoCentrix. Dan is absolutely one of the most talented marketing professionals I have known in my entire career. He is not only passionate and great to work with, but has such a deep understanding of how marketing can directly impact and influence the bottom line. Dan would be an exceptional asset to any organization he was affiliated with.",
        author: "Wendy Nossaman",
        role: "Director, AI Workforce Solutions",
        company: "Microsoft",
        image: wendeImg,
        color: "#3b82f6" // Blue
    }
];

export default testimonials;
