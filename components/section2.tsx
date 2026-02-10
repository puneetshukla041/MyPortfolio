'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion';
import Image from 'next/image';

// --- Types ---
interface TimelineData {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  logo: string;
  type: 'Full-time' | 'Internship' | 'Education';
  description: string;
  points: string[];
  tech: string[];
}

// --- DATA ---
const timelineData: TimelineData[] = [
  {
    id: 'ssi',
    role: "Software Engineer",
    company: "SS Innovations",
    period: "Apr 2025 - Present",
    location: "Gurugram, India",
    logo: "/logos/ssi.jpeg",
    type: "Full-time",
    description: "Spearheading the 'SSI Studios' ecosystem. Engineering scalable architectures to unify organizational tools. Leading the development of internal developer platforms that streamline deployment and monitoring.",
    points: ["Architected 'SSI Studios' centralized workflow.", "Reduced SaaS costs by 40% via internal tooling.", "99.9% stability CI/CD pipelines."],
    tech: ["Next.js", "React", "S3", "SES","Typescript","System Design"],
  },
  {
    id: 'disney',
    role: "Software Engineer Intern",
    company: "Disney+ Hotstar",
    period: "Mar 2023 - Oct 2024",
    location: "Bengaluru (Remote)",
    logo: "/logos/disney.webp",
    type: "Internship",
    description: "Backend scalability engineering for high-concurrency services serving millions during live sports events. Focused on optimizing database interactions and caching strategies to handle massive traffic spikes.",
    points: ["Optimized audit logging via Messenger Service.", "Enhanced Offer Service caching throughput.", "High-performance DB queries for Payments."],
    tech: ["React", "S3", "Redis"],
  },
  {
    id: 'medanta',
    role: "Intern",
    company: "Medanta",
    period: "May 2023 - Aug 2023",
    location: "Gurugram, India",
    logo: "/logos/medanta.png",
    type: "Internship",
    description: "Quality assurance and security compliance for mission-critical healthcare infrastructure. Ensured patient data integrity through rigorous automated testing and vulnerability scanning protocols.",
    points: ["Executed API validation suites.", "Established strict version control.", "Security vulnerability assessments."],
    tech: ["Python", "QA Automation", "Security"],
  },
  {
    id: 'education',
    role: "B.Tech Computer Science",
    company: "GLA University",
    period: "Sep 2021 - Mar 2025",
    location: "Mathura",
    logo: "/logos/gla.jpeg",
    type: "Education",
    description: "Specialization in Artificial Intelligence & Machine Learning with a focus on deep learning architectures. Led technical communities to foster peer learning and innovation.",
    points: ["Major in AI/ML; Minor in Cloud Computing.", "Head of Technical Society.", "Research on Neural Network optimization."],
    tech: ["AI/ML", "Algorithms", "Research"],
  }
];

// --- UTILS ---
function useMousePosition() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return { mouseX, mouseY, handleMouseMove };
}

// --- MAIN COMPONENT ---
const Section2 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring for the main vertical beam
  const height = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-transparent font-sans z-10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: STICKY TITLE --- */}
        {/* UPDATED: Changed col-span from 5 to 4 to give more room to cards */}
        <div className="md:col-span-4 flex flex-col justify-start md:justify-center md:h-screen md:sticky md:top-0 py-10 md:py-0">
          <motion.div 
            initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="pl-2 md:pl-4 border-l-2 border-white/10"
          >
            <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6">
              The <span className="text-neutral-500">Journey.</span>
            </h2>
            <p className="text-neutral-300 text-lg md:text-xl font-light tracking-wide max-w-sm">
              Current Engineering challenges and past breakthroughs.
            </p>
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN: SCROLLABLE TIMELINE --- */}
        {/* UPDATED: Changed col-span from 7 to 8 for wider cards */}
        <div className="md:col-span-8 relative">
          
          {/* THE BEAM (Desktop Only) */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px mask-image-gradient">
             <div className="absolute inset-0 w-[1px] bg-gradient-to-b from-transparent via-neutral-800 to-neutral-800 h-full" />
             <motion.div 
               style={{ height: useTransform(height, [0, 1], ["0%", "100%"]) }}
               className="absolute top-0 left-0 w-[1px] bg-white shadow-[0_0_15px_1px_rgba(255,255,255,0.6)] z-20"
             >
                <div className="absolute bottom-0 -left-[2px] w-[5px] h-[30px] bg-gradient-to-t from-white to-transparent" />
             </motion.div>
          </div>

          {/* EVENTS LIST */}
          <div className="flex flex-col gap-24 md:gap-32 md:pb-[50vh] pt-10 md:pt-20"> 
            {timelineData.map((item, index) => (
              <TimelineItem key={item.id} data={item} index={index} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

// --- TIMELINE ITEM ---
const TimelineItem = ({ data, index }: { data: TimelineData, index: number }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "center center"]
  });

  // --- SMOOTHING PHYSICS ---
  // We use a spring here so the animation lags slightly behind the scroll,
  // creating a fluid "underwater" feel rather than a jittery mechanical one.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.5
  });

  const opacity = useTransform(smoothProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(smoothProgress, [0, 0.5], [0.9, 1]); // Subtle scale
  const blur = useTransform(smoothProgress, [0, 0.4], [10, 0]); 
  const x = useTransform(smoothProgress, [0, 0.5], [50, 0]); // Reduced movement for elegance
  const rotateX = useTransform(smoothProgress, [0, 0.5], [10, 0]); // Reduced rotation

  // Connectors need to be sharper, so we use raw scrollYProgress or a tighter spring
  const connectorWidth = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"]);
  const connectorOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  return (
    <div 
      ref={itemRef} 
      className="relative min-h-fit md:min-h-[80vh] flex items-center justify-center md:pl-16 perspective-1000"
    >
       {/* Connector (Desktop Only) */}
       <div className="hidden md:block absolute top-1/2 left-0 w-16 h-px z-0 pointer-events-none -translate-y-1/2">
          <motion.div 
            style={{ width: connectorWidth, opacity: connectorOpacity }}
            className="h-full bg-gradient-to-r from-neutral-800 via-white/50 to-neutral-800"
          />
          <motion.div 
            style={{ opacity: connectorOpacity }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]"
          />
       </div>

      <motion.div 
        style={{ 
            opacity, 
            scale, 
            x, 
            rotateX,
            filter: useMotionTemplate`blur(${blur}px)`
        }} 
        className="w-full origin-bottom"
      >
        <SpotlightCard data={data} index={index} />
      </motion.div>
    </div>
  );
};

// --- SPOTLIGHT CARD ---
const SpotlightCard = ({ data, index }: { data: TimelineData, index: number }) => {
  const { mouseX, mouseY, handleMouseMove } = useMousePosition();
  
  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-full rounded-3xl overflow-hidden bg-zinc-900/90 border border-white/10 backdrop-blur-md group/card transition-all duration-500 hover:border-white/20 shadow-2xl shadow-black/50"
    >
      {/* 1. SPOTLIGHT EFFECT HOVER */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/card:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              800px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* 2. GLOWING BORDER EFFECT */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/card:opacity-100 z-20"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              800px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* CONTENT: Increased padding for bigger feel */}
      <div className="relative z-30 p-8 md:p-12 flex flex-col md:flex-row gap-10">
        
        {/* LOGO COLUMN */}
        <div className="flex flex-row md:flex-col gap-5 shrink-0 justify-start items-center md:items-start">
          <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-inner group-hover/card:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500">
             <Image 
                src={data.logo} 
                alt={data.company} 
                fill 
                className="object-cover opacity-90 group-hover/card:opacity-100 transition-all duration-500 group-hover/card:scale-110" 
             />
          </div>
          <div className="flex flex-col pt-0 md:pt-2">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 group-hover/card:text-white transition-colors">
              {data.period}
            </span>
            <span className="text-xs font-mono text-neutral-500 mt-1">
              {data.location}
            </span>
          </div>
        </div>

        {/* CONTENT COLUMN */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <h3 className="text-3xl md:text-4xl font-semibold text-white mb-2 group-hover/card:text-blue-100 transition-colors">
              {data.role}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-neutral-300 font-medium text-lg">{data.company}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 uppercase tracking-wide">
                {data.type}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-neutral-200 text-lg leading-relaxed font-light mb-8 border-l-2 border-white/20 pl-6 group-hover/card:border-white/40 transition-colors">
            {data.description}
          </p>

          {/* Bullet Points */}
          <ul className="space-y-3 mb-10">
            {data.points.map((point, i) => (
               <li key={i} className="flex items-start gap-3 text-base text-neutral-300 group-hover/card:text-white transition-colors">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-neutral-400 group-hover/card:bg-white transition-colors shadow-[0_0_5px_rgba(255,255,255,0)] group-hover/card:shadow-[0_0_5px_rgba(255,255,255,0.5)] shrink-0" />
                  {point}
               </li>
            ))}
          </ul>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {data.tech.map((t, i) => (
              <span 
                key={i} 
                className="px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        
        {/* Right Side Decoration */}
        <div className="hidden xl:block absolute top-10 right-10">
             <div className="flex flex-col items-end gap-1 opacity-20 group-hover/card:opacity-50 transition-opacity">
                <div className="w-16 h-[1px] bg-white" />
                <div className="w-[1px] h-4 bg-white" />
                <span className="text-[10px] font-mono tracking-widest mt-1">SYS.0{index + 1}</span>
             </div>
        </div>

      </div>
    </div>
  );
};

export default Section2;