export interface QAItem {
  id: string;
  number: string;
  label: string;
  title: string;
  intro: string;
  bullets: string[];
}

export const qaData: QAItem[] = [
  {
    id: "what-i-do",
    number: "01",
    label: "What I actually do",
    title: "What I actually do",
    intro: "I build and run the marketing system that turns attention into signed revenue.",
    bullets: [
      "Translate firm goals into channel strategy, budgets, and CAC targets.",
      "Own the mix across brand, PI lead gen, paid/local search, and social.",
      "Build feedback loops with intake, call center, and ops so we're optimizing to cases, not clicks.",
      "Design experiments, kill what doesn't work fast, double-down on what moves pipeline."
    ]
  },
  {
    id: "how-i-think",
    number: "02",
    label: "How I think about growth",
    title: "How I think about growth",
    intro: "I treat PI and growth marketing as an operating system, not a bag of tactics.",
    bullets: [
      "Start with positioning and offer: who we are in the market and why someone should choose us in 3 seconds.",
      "Build multi-touch journeys that follow real buyer behavior, not just ad platform defaults.",
      "Use first-party data, attribution, and cohort views to decide where each next dollar goes.",
      "Protect the brand while scaling: every creative, script, and landing experience is on-voice and on-mission."
    ]
  },
  {
    id: "proof-it-works",
    number: "03",
    label: "Proof it works",
    title: "Proof it works",
    intro: "I've led marketing at PI firms operating at national scale and high spend.",
    bullets: [
      "Drove triple-digit growth in lead volume while stabilizing cost-per-case.",
      "Rebuilt local search + GMB to 3× inbound volume in key markets.",
      "Launched brand and social programs that added tens of thousands of followers/subscribers in months.",
      "Led full-firm rebrands and website relaunches (strategy → design → UX → performance → CRO) on aggressive timelines."
    ]
  },
  {
    id: "working-on-now",
    number: "04",
    label: "What I'm working on now",
    title: "What I'm working on now",
    intro: "Right now I'm focused on making marketing more predictable and more automated.",
    bullets: [
      "Building agentic workflows tying together media, intake, CRM, and BI for near real-time decisions.",
      "Experimenting with LLM-driven content, calculators, and tools that create demand and capture higher-intent leads.",
      "Deepening measurement: beyond last-click to understand channel assist, quality, and long-term value.",
      "Coaching teams so creative, media, and data operate as one growth unit."
    ]
  }
];
