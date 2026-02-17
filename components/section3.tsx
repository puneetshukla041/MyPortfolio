'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { 
  Code2, 
  Database, 
  Cloud, 
  Layout, 
  Terminal, 
  Globe, 
  Server,
  Zap,
  GitBranch,
  Monitor,
  Hash,
  Layers
} from 'lucide-react';
import Image from 'next/image';

// --- TYPES ---
type CategoryType = 'ALL' | 'FRONTEND' | 'BACKEND' | 'TOOLS';

interface Company {
  name: string;
  logo: string;
}

interface Skill {
  id: string;
  name: string;
  icon: React.ReactNode;
  level: number;
  category: 'FRONTEND' | 'BACKEND' | 'TOOLS';
  tag: string;
  year: string;
  companies?: Company[];
  description: string;
}

// --- CONFIG ---
const LOGOS = {
  SS: "/logos/ssi.jpeg",
  DISNEY: "/logos/disney.webp",
  MEDANTA: "/logos/medanta.png"
};

const CO_DATA = {
  SS: { name: "SS Innovation", logo: LOGOS.SS },
  DISNEY: { name: "Disney Hotstar", logo: LOGOS.DISNEY },
  MEDANTA: { name: "Medanta", logo: LOGOS.MEDANTA }
};

// --- DATA ---
const SKILLS: Skill[] = [
  // FRONTEND
  { 
    id: 'next', 
    name: "Next.js 14", 
    icon: <Globe size={24} />, 
    level: 99, 
    category: 'FRONTEND', 
    tag: "Core Framework", 
    year: "2024",
    companies: [CO_DATA.SS],
    description: "Server Actions, App Router, SSR."
  },
  { 
    id: 'react', 
    name: "React Ecosystem", 
    icon: <Layout size={24} />, 
    level: 98, 
    category: 'FRONTEND', 
    tag: "UI Library", 
    year: "2023",
    companies: [CO_DATA.DISNEY, CO_DATA.SS],
    description: "Hooks, Context, Custom Patterns."
  },
  { 
    id: 'ts', 
    name: "TypeScript", 
    icon: <Code2 size={24} />, 
    level: 96, 
    category: 'FRONTEND', 
    tag: "Language", 
    year: "2023",
    companies: [CO_DATA.SS],
    description: "Strict typing, Interfaces, Generics."
  },
  { 
    id: 'framer', 
    name: "Framer Motion", 
    icon: <Zap size={24} />, 
    level: 95, 
    category: 'FRONTEND', 
    tag: "Animation", 
    year: "2024",
    companies: [CO_DATA.DISNEY, CO_DATA.SS],
    description: "Complex gestures & layout animations."
  },
  { 
    id: 'tailwind', 
    name: "Tailwind CSS", 
    icon: <Layers size={24} />, 
    level: 98, 
    category: 'FRONTEND', 
    tag: "Design System", 
    year: "2023",
    companies: [CO_DATA.SS],
    description: "Advanced config & responsive design."
  },

  // BACKEND
  { 
    id: 'node', 
    name: "Node.js", 
    icon: <Server size={24} />, 
    level: 90, 
    category: 'BACKEND', 
    tag: "Runtime", 
    year: "2022",
    companies: [CO_DATA.DISNEY],
    description: "High-concurrency microservices."
  },
  { 
    id: 'mongo', 
    name: "MongoDB", 
    icon: <Database size={24} />, 
    level: 88, 
    category: 'BACKEND', 
    tag: "NoSQL", 
    year: "2023",
    companies: [CO_DATA.DISNEY, CO_DATA.SS],
    description: "Aggregation pipelines & indexing."
  },
  { 
    id: 'python', 
    name: "Python", 
    icon: <Terminal size={24} />, 
    level: 85, 
    category: 'BACKEND', 
    tag: "Scripting", 
    year: "2020",
    companies: [CO_DATA.MEDANTA],
    description: "Automation & Data Analysis."
  },
  { 
    id: 'sql', 
    name: "PostgreSQL", 
    icon: <Hash size={24} />, 
    level: 80, 
    category: 'BACKEND', 
    tag: "Relational DB", 
    year: "2021",
    companies: [CO_DATA.MEDANTA],
    description: "Complex queries & normalization."
  },

  // TOOLS
  { 
    id: 'git', 
    name: "Git & CI/CD", 
    icon: <GitBranch size={24} />, 
    level: 92, 
    category: 'TOOLS', 
    tag: "DevOps", 
    year: "2022",
    companies: [CO_DATA.MEDANTA, CO_DATA.DISNEY, CO_DATA.SS],
    description: "Version control & GitHub Actions."
  },
  { 
    id: 'aws', 
    name: "AWS", 
    icon: <Cloud size={24} />, 
    level: 75, 
    category: 'TOOLS', 
    tag: "Cloud", 
    year: "2024",
    companies: [CO_DATA.SS, CO_DATA.DISNEY],
    description: "EC2, S3, Lambda, SES."
  },
  { 
    id: 'electron', 
    name: "Electron", 
    icon: <Monitor size={24} />, 
    level: 82, 
    category: 'TOOLS', 
    tag: "Desktop", 
    year: "2024",
    companies: [CO_DATA.SS],
    description: "Cross-platform desktop apps."
  },
];

const FILTERS: { id: CategoryType; label: string }[] = [
  { id: 'ALL', label: 'Ecosystem' },
  { id: 'FRONTEND', label: 'Interface' },
  { id: 'BACKEND', label: 'Core' },
  { id: 'TOOLS', label: 'Infrastructure' },
];

export default function Section6() {
  const [activeFilter, setActiveFilter] = useState<CategoryType>('ALL');

  const filteredSkills = SKILLS.filter(skill => {
    if (activeFilter === 'ALL') return true;
    return skill.category === activeFilter;
  });

  return (
    <section className="relative min-h-screen bg-transparent text-white font-sans py-12 md:py-24 lg:py-32 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 md:mb-16 gap-6 md:gap-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white">
              Engineering <br className="hidden sm:block" /> <span className="text-zinc-600">Ecosystem.</span>
            </h1>
          </div>

          {/* --- IOS STYLE SEGMENTED CONTROL --- */}
          <div className="w-full xl:w-auto overflow-x-auto pb-4 xl:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-2xl flex w-max xl:w-auto gap-1 shadow-2xl">
                {FILTERS.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`
                    relative px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap
                    ${activeFilter === filter.id ? 'text-black' : 'text-zinc-400 hover:text-white hover:bg-white/5'}
                    `}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    {activeFilter === filter.id && (
                    <motion.div
                        layoutId="pill"
                        className="absolute inset-0 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    )}
                    {/* mix-blend-multiply removed to fix invisible text on mobile dark-mode */}
                    <span className="relative z-10">{filter.label}</span>
                </button>
                ))}
            </div>
          </div>
        </div>

        {/* --- BENTO GRID --- */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                layout
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`flex w-full h-full ${skill.category === 'FRONTEND' && activeFilter === 'ALL' ? 'md:col-span-2' : 'col-span-1'}`}
              >
                <BentoCard skill={skill} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

// --- BENTO CARD WITH SPOTLIGHT & APPLE FEEL ---
const BentoCard = ({ skill }: { skill: Skill }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative w-full h-full bg-black/40 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-colors duration-500 cursor-pointer flex flex-col"
    >
      {/* Spotlight Effect - Hidden on mobile to prevent sticky touch glitches */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10 hidden md:block"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-20 h-full p-5 md:p-6 flex flex-col justify-between">
        
        {/* Top Section */}
        <div className="flex justify-between items-start mb-6 md:mb-8">
            <div className="p-2.5 md:p-3 bg-zinc-900/80 rounded-2xl border border-white/5 text-white shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              {skill.icon}
            </div>
            <span className="px-2.5 py-1 md:px-3 rounded-full bg-white/5 border border-white/5 text-[10px] font-medium text-zinc-400 uppercase tracking-wide group-hover:bg-white/10 transition-colors">
              {skill.tag}
            </span>
        </div>

        {/* Middle Section */}
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
            {skill.name}
          </h3>
          <p className="text-xs md:text-sm text-zinc-500 line-clamp-2 mb-4 group-hover:text-zinc-400 transition-colors">
            {skill.description}
          </p>
          
          {/* Companies Mini-Dock */}
          {skill.companies && (
            <div className="flex items-center mb-4">
               <div className="flex -space-x-2">
                 {skill.companies.map((c, i) => (
                    <div 
                        key={i} 
                        className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-zinc-900 bg-zinc-800 overflow-hidden relative z-0 hover:z-10 transition-all hover:scale-125 cursor-pointer"
                        title={c.name}
                    >
                       <Image 
                         src={c.logo} 
                         alt={c.name} 
                         fill
                         className="object-cover opacity-80 hover:opacity-100"
                       />
                    </div>
                 ))}
               </div>
               <span className="ml-3 text-[10px] text-zinc-600 font-medium">
                  {skill.year}
               </span>
            </div>
          )}
        </div>

        {/* Bottom Progress Line */}
        <div className="mt-auto pt-4 border-t border-white/5">
             <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-zinc-600 font-mono">MASTERY</span>
                <span className="text-xs font-mono text-emerald-500">{skill.level}%</span>
             </div>
             <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className={`h-full rounded-full ${
                    skill.level > 90 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-zinc-500'
                  }`}
                />
             </div>
        </div>

      </div>
    </motion.div>
  );
};