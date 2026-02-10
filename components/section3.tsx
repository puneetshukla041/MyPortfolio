'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Database, 
  Cloud, 
  Layout, 
  Terminal, 
  Globe, 
  Server,
  Box,
  Zap,
  GitBranch,
  Monitor,
  FileType,
  Hash,
  Filter,
  Calendar,
  Building2,
  Layers
} from 'lucide-react';

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
  level: number; // 0 to 100
  category: 'FRONTEND' | 'BACKEND' | 'TOOLS';
  tag: string;
  year: string;
  companies?: Company[];
}

// --- CONFIG ---
const LOGOS = {
  SS: "/logos/ssilogo.png",
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
    icon: <Globe size={18}/>, 
    level: 99, 
    category: 'FRONTEND', 
    tag: "Framework",
    year: "2024",
    companies: [CO_DATA.SS]
  },
  { 
    id: 'react', 
    name: "React.js", 
    icon: <Layout size={18}/>, 
    level: 98, 
    category: 'FRONTEND', 
    tag: "Library",
    year: "2023",
    companies: [CO_DATA.DISNEY, CO_DATA.SS] // Common skill implies spread, added SS for consistency if needed, but keeping strictly to prompt for others
  },
  { 
    id: 'ts', 
    name: "TypeScript", 
    icon: <Code2 size={18}/>, 
    level: 96, 
    category: 'FRONTEND', 
    tag: "Language",
    year: "2023",
    companies: [CO_DATA.SS]
  },
  { 
    id: 'framer', 
    name: "Framer Motion", 
    icon: <Zap size={18}/>, 
    level: 95, 
    category: 'FRONTEND', 
    tag: "Animation",
    year: "2024",
    companies: [CO_DATA.DISNEY, CO_DATA.SS]
  },
  { 
    id: 'tailwind', 
    name: "Tailwind CSS", 
    icon: <Layers size={18}/>, 
    level: 98, 
    category: 'FRONTEND', 
    tag: "Styling",
    year: "2023",
    companies: [CO_DATA.SS]
  },
  { 
    id: 'bootstrap', 
    name: "Bootstrap", 
    icon: <FileType size={18}/>, 
    level: 95, 
    category: 'FRONTEND', 
    tag: "UI Kit",
    year: "2021",
    companies: [CO_DATA.DISNEY]
  },
  
  // BACKEND
  { 
    id: 'node', 
    name: "Node.js", 
    icon: <Server size={18}/>, 
    level: 90, 
    category: 'BACKEND', 
    tag: "Runtime",
    year: "2022",
    companies: [CO_DATA.DISNEY]
  },
  { 
    id: 'mongo', 
    name: "MongoDB", 
    icon: <Database size={18}/>, 
    level: 88, 
    category: 'BACKEND', 
    tag: "NoSQL",
    year: "2023",
    // Common in Disney and SS
    companies: [CO_DATA.DISNEY, CO_DATA.SS]
  },
  { 
    id: 'python', 
    name: "Python", 
    icon: <Terminal size={18}/>, 
    level: 85, 
    category: 'BACKEND', 
    tag: "Scripting",
    year: "2020",
    companies: [CO_DATA.MEDANTA]
  },
  { 
    id: 'sql', 
    name: "SQL", 
    icon: <Hash size={18}/>, 
    level: 80, 
    category: 'BACKEND', 
    tag: "Database",
    year: "2021",
    companies: [CO_DATA.MEDANTA]
  },

  // TOOLS
  { 
    id: 'git', 
    name: "Git / GitHub", 
    icon: <GitBranch size={18}/>, 
    level: 92, 
    category: 'TOOLS', 
    tag: "DevOps",
    year: "2022",
    // Common in Disney and SS (and Medanta from before)
    companies: [CO_DATA.MEDANTA, CO_DATA.DISNEY, CO_DATA.SS]
  },
  { 
    id: 'electron', 
    name: "Electron.js", 
    icon: <Monitor size={18}/>, 
    level: 82, 
    category: 'TOOLS', 
    tag: "Desktop",
    year: "2024",
    companies: [CO_DATA.SS]
  },
  { 
    id: 'aws', 
    name: "AWS Services", 
    icon: <Cloud size={18}/>, 
    level: 75, 
    category: 'TOOLS', 
    tag: "Cloud",
    year: "2024",
    // Common in Disney and SS
    companies: [CO_DATA.SS, CO_DATA.DISNEY]
  },
  { 
    id: 'capacitor', 
    name: "Capacitor", 
    icon: <Box size={18}/>, 
    level: 80, 
    category: 'TOOLS', 
    tag: "Mobile",
    year: "2023",
    companies: [CO_DATA.SS] 
  },
];

const FILTERS: { id: CategoryType; label: string }[] = [
  { id: 'ALL', label: 'All Stack' },
  { id: 'FRONTEND', label: 'Frontend' },
  { id: 'BACKEND', label: 'Backend' },
  { id: 'TOOLS', label: 'Tools' },
];

export default function Section6() {
  const [activeFilter, setActiveFilter] = useState<CategoryType>('ALL');

  // --- FILTER ALGORITHM ---
  const filteredSkills = SKILLS.filter(skill => {
    if (activeFilter === 'ALL') return true;
    return skill.category === activeFilter;
  });

  return (
    <section className="relative min-h-screen bg-transparent text-zinc-100 font-sans py-24 md:py-32 z-10">
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-xs font-mono text-zinc-500 mb-4 tracking-[0.3em] uppercase flex items-center gap-2">
            <Filter size={12} className="text-emerald-500" />
            Technical Arsenal
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Full Stack <span className="text-zinc-600">Architecture.</span>
          </h1>
          
          {/* --- FILTER CONTROLS --- */}
          <div className="flex flex-wrap justify-center gap-2 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`relative px-6 py-2 text-xs md:text-sm font-medium rounded-full transition-colors duration-300 z-10
                  ${activeFilter === filter.id ? 'text-black' : 'text-zinc-400 hover:text-white'}
                `}
              >
                {/* Sliding White Background Pill */}
                {activeFilter === filter.id && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-white rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- DYNAMIC GRID --- */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          <AnimatePresence mode='popLayout'>
            {filteredSkills.map((skill) => (
              <motion.div
                layout
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <SkillCard skill={skill} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- FOOTER METRICS --- */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 font-mono">
           <div className="flex items-center gap-2 mb-4 md:mb-0">
             <Filter size={14} />
             <span>Showing {filteredSkills.length} of {SKILLS.length} Technologies</span>
           </div>
           <span>Code Quality: A+</span>
        </div>

      </div>
    </section>
  );
}

// --- CARD COMPONENT ---

const SkillCard = ({ skill }: { skill: Skill }) => {
  return (
    <div className="group relative h-full bg-zinc-900/40 border border-white/5 hover:border-white/20 rounded-xl p-5 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800/50 flex flex-col">
      
      {/* Header with Icon & Tag */}
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-black/50 rounded-lg border border-white/5 text-zinc-300 group-hover:text-white group-hover:border-white/20 transition-colors">
          {skill.icon}
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-600 border border-zinc-800 px-2 py-1 rounded bg-black/20">
          {skill.tag}
        </span>
      </div>

      {/* Title */}
      <div className="mb-4 flex-grow">
        <h3 className="text-white font-bold text-lg">{skill.name}</h3>
        <p className="text-zinc-500 text-xs mt-1">Proficiency Level</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-full rounded-full ${
              skill.level >= 95 ? 'bg-emerald-500' :
              skill.level >= 85 ? 'bg-blue-500' : 
              'bg-zinc-400'
            }`}
          />
        </div>
        <span className="text-xs font-mono font-bold text-white">{skill.level}%</span>
      </div>

      {/* Footer: Company & Year */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
        
        {/* Company Info */}
        <div className="flex items-center gap-2">
          {skill.companies && skill.companies.length > 0 ? (
            <div className="flex items-center">
              {/* Logo Stack */}
              <div className="flex -space-x-2 mr-2">
                {skill.companies.map((company, index) => (
                  <div 
                    key={index} 
                    className="w-5 h-5 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-zinc-900 relative z-10"
                    title={company.name}
                  >
                    <img 
                      src={company.logo} 
                      alt={company.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Name Display: List all names comma separated */}
              <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[80px] md:max-w-[100px]" title={skill.companies.map(c => c.name).join(', ')}>
                {skill.companies.map(c => c.name).join(', ')}
              </span>
            </div>
          ) : (
            // Placeholder for self-taught/other
            <div className="flex items-center gap-2 opacity-50">
               <Building2 size={12} className="text-zinc-600"/>
               <span className="text-[10px] text-zinc-600">Self-taught</span>
            </div>
          )}
        </div>

        {/* Year */}
        <div className="flex items-center gap-1.5 text-zinc-500 bg-white/5 px-2 py-0.5 rounded-md">
          <Calendar size={10} />
          <span className="text-[10px] font-mono">{skill.year}</span>
        </div>
      </div>

    </div>
  );
};