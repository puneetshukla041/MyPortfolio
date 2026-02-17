'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP Plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- DATA ---
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

const timelineData: TimelineData[] = [
  {
    id: 'ssi',
    role: "Software Engineer",
    company: "SS Innovations",
    period: "Apr 2025 - Present",
    location: "Gurugram, India",
    logo: "/logos/ssi.jpeg",
    type: "Full-time",
    description: "Spearheading the 'SSI Studios' ecosystem. Engineering scalable architectures to unify organizational tools.",
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
    description: "Backend scalability engineering for high-concurrency services serving millions during live sports.",
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
    description: "Quality assurance and security compliance for mission-critical healthcare infrastructure.",
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
    description: "Specialization in Artificial Intelligence & Machine Learning.",
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

// --- PARTICLE COMPONENT ---
const MeteorParticles = () => {
  const particles = Array.from({ length: 8 });
  return (
    <div className="absolute -bottom-4 -left-4 w-8 h-8 pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: [0, (Math.random() - 0.5) * 40],
            y: [0, (Math.random() - 0.5) * 40],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 1 + Math.random(),
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 0.5,
          }}
          className="absolute left-1/2 top-1/2 w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]"
        />
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---
const Section2 = () => {
  const container = useRef<HTMLDivElement>(null);
  const leftCol = useRef<HTMLDivElement>(null);
  const meteorRef = useRef<HTMLDivElement>(null);
  
  const [activeCompany, setActiveCompany] = useState(timelineData[0].company);

  useGSAP(() => {
    // GSAP MatchMedia for true responsiveness
    let mm = gsap.matchMedia();

    // ---------------------------------------------
    // DESKTOP ANIMATIONS (Pinning & Complex Reveal)
    // ---------------------------------------------
    mm.add("(min-width: 768px)", () => {
      // 1. PINNING STRATEGY
      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftCol.current,
        pinSpacing: false, 
      });

      // 2. METEOR BEAM LOGIC
      gsap.to(meteorRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        }
      });

      // 3. CARD REVEALS & CONTEXT SWITCHING
      const cards = gsap.utils.toArray('.timeline-card');
      
      cards.forEach((card: any, i) => {
        gsap.fromTo(card, 
          { opacity: 0, y: 100, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 50%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Connector Line Animation
        const connector = card.querySelector('.connector-line');
        if (connector) {
          gsap.fromTo(connector,
            { width: "0%", opacity: 0 },
            {
              width: "100%",
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 70%", 
              }
            }
          );
        }

        // Context Switching text update
        ScrollTrigger.create({
          trigger: card,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveCompany(timelineData[i].company),
          onEnterBack: () => setActiveCompany(timelineData[i].company),
        });
      });
    });

    // ---------------------------------------------
    // MOBILE ANIMATIONS (Simple Fade Up, No Pinning)
    // ---------------------------------------------
    mm.add("(max-width: 767px)", () => {
      const cards = gsap.utils.toArray('.timeline-card');
      cards.forEach((card: any) => {
        gsap.fromTo(card, 
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    });

    return () => mm.revert(); // Cleanup on unmount

  }, { scope: container });

  return (
    <section ref={container} className="relative w-full bg-transparent font-sans z-10 min-h-screen pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 md:gap-8">
        
        {/* --- LEFT COLUMN: NORMAL FLOW ON MOBILE, PINNED ON DESKTOP --- */}
        <div ref={leftCol} className="md:col-span-5 flex flex-col justify-center pt-24 pb-8 md:py-0 md:h-screen">
          <div className="pl-3 md:pl-4 border-l-2 border-white/10 relative overflow-hidden">
            
            <h2 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter text-white mb-4 md:mb-6">
              The <span className="text-neutral-500">Journey.</span>
            </h2>
            
            <p className="text-neutral-400 md:text-neutral-300 text-base md:text-xl font-light tracking-wide max-w-sm mb-0 md:mb-8">
              Engineering milestones and technical breakthroughs.
            </p>

            {/* GSAP POWERED CONTEXT: Hidden on mobile to save space */}
            <div className="hidden md:block">
                <p className="text-xs font-mono text-emerald-500 mb-2 uppercase tracking-widest">
                    Currently Viewing
                </p>
                <div key={activeCompany} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-3xl font-bold text-white/80">
                        {activeCompany}
                    </h3>
                </div>
            </div>

          </div>
        </div>

        {/* --- RIGHT COLUMN: SCROLLABLE TIMELINE --- */}
        {/* Adjusted padding: small on mobile, massive on desktop to center the first item */}
        <div className="md:col-span-7 relative pt-8 pb-8 md:pt-[50vh] md:pb-[20vh]"> 
          
          {/* THE METEOR BEAM (Desktop only) */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px">
             <div className="absolute inset-0 w-[1px] bg-gradient-to-b from-transparent via-neutral-800 to-neutral-800 h-full opacity-50" />
             
             <div ref={meteorRef} className="absolute top-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-white z-20 h-0 overflow-visible">
                <div className="absolute bottom-0 -left-[3px] w-2 h-2">
                   <div className="absolute inset-0 bg-white rounded-full blur-[2px] shadow-[0_0_10px_4px_rgba(255,255,255,0.6)]" />
                   <div className="absolute -inset-2 bg-white/30 rounded-full blur-xl" />
                   <MeteorParticles />
                </div>
             </div>
          </div>

          {/* EVENTS LIST */}
          <div className="flex flex-col gap-12 md:gap-32"> 
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
  return (
    <div className="timeline-card relative min-h-fit flex items-center justify-center md:pl-16 perspective-1000">
       
       {/* Connector (Desktop only, animated by GSAP) */}
       <div className="hidden md:block absolute top-1/2 left-0 w-16 h-px z-0 pointer-events-none -translate-y-1/2">
          <div className="connector-line h-full bg-gradient-to-r from-neutral-800 via-white/50 to-neutral-800 w-0 opacity-0" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]" />
       </div>

      <div className="w-full origin-bottom">
        <SpotlightCard data={data} index={index} />
      </div>
    </div>
  );
};

// --- SPOTLIGHT CARD ---
const SpotlightCard = ({ data, index }: { data: TimelineData, index: number }) => {
  const { mouseX, mouseY, handleMouseMove } = useMousePosition();
  
  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900/90 border border-white/10 backdrop-blur-md group/card transition-all duration-500 hover:border-white/20 shadow-2xl shadow-black/50"
    >
      {/* 1. SPOTLIGHT EFFECT (Hidden on mobile to prevent sticky touch hover bugs) */}
      <motion.div
        className="hidden md:block pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/card:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* 2. GLOWING BORDER (Hidden on mobile) */}
      <motion.div
        className="hidden md:block pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/card:opacity-100 z-20"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-30 p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row gap-5 md:gap-8">
        
        {/* LOGO COLUMN */}
        <div className="flex flex-row sm:flex-col gap-4 shrink-0 justify-start items-center sm:items-start">
          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 shadow-inner group-hover/card:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500">
             <Image 
                src={data.logo} 
                alt={data.company} 
                fill 
                className="object-cover opacity-90 group-hover/card:opacity-100 transition-all duration-500 sm:group-hover/card:scale-110" 
             />
          </div>
          <div className="flex flex-col pt-0 sm:pt-1">
            <span className="text-[10px] md:text-[9px] font-mono uppercase tracking-widest text-neutral-500 group-hover/card:text-white transition-colors">
              {data.period}
            </span>
            <span className="text-[10px] md:text-[9px] font-mono text-neutral-600 mt-0.5">
              {data.location}
            </span>
          </div>
        </div>

        {/* CONTENT COLUMN */}
        <div className="flex-1">
          <div className="mb-3 md:mb-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-1 group-hover/card:text-blue-100 transition-colors tracking-tight">
              {data.role}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-neutral-300 font-medium text-xs md:text-sm">{data.company}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] md:text-[9px] font-medium text-neutral-400 uppercase tracking-wide">
                {data.type}
              </span>
            </div>
          </div>

          <p className="text-neutral-300 md:text-neutral-200 text-sm leading-relaxed font-light mb-4 md:mb-5 border-l border-white/10 md:border-white/20 pl-3 md:pl-4 group-hover/card:border-white/40 transition-colors">
            {data.description}
          </p>

          <ul className="space-y-2 mb-5 md:mb-6">
            {data.points.map((point, i) => (
               <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-400 group-hover/card:text-neutral-300 transition-colors">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-neutral-500 group-hover/card:bg-white transition-colors shadow-[0_0_5px_rgba(255,255,255,0)] group-hover/card:shadow-[0_0_5px_rgba(255,255,255,0.5)] shrink-0" />
                  {point}
               </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5">
            {data.tech.map((t, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[9px] md:text-[10px] font-medium text-neutral-400 md:hover:text-white md:hover:bg-white/10 md:hover:border-white/20 transition-all duration-300 cursor-default tracking-wide"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        
        {/* Right Side Decoration (Desktop only) */}
        <div className="hidden xl:block absolute top-6 right-6">
             <div className="flex flex-col items-end gap-0.5 opacity-20 group-hover/card:opacity-50 transition-opacity">
                <div className="w-8 h-[1px] bg-white" />
                <div className="w-[1px] h-2 bg-white" />
                <span className="text-[8px] font-mono tracking-widest mt-0.5">SYS.0{index + 1}</span>
             </div>
        </div>

      </div>
    </div>
  );
};

export default Section2;