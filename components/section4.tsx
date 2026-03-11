"use client";

import { StaticImageData } from "next/image";
import { motion, AnimatePresence, Transition } from "framer-motion";
import {
  Github,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Layers,
  Globe
} from "lucide-react";
import { useState, MouseEvent } from "react";

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface Project {
  title: string;
  image?: string | StaticImageData;
  imageAlt?: string;
  images?: (string | StaticImageData)[];
  url?: string;
  github?: string;
  description: string | string[];
  technologies: string[];
}

// =====================================================
// PROJECTS DATA
// =====================================================
export const PROJECTS: Project[] = [
  {
    title: "SSI STUDIOS",
    image: "/images/ssistudios.png",
    imageAlt: "SSI Studios Asset Automation Platform",
    images: ["/images/ssistudios.png"],
    url: "https://ssistudios.vercel.app",
    github: "",
    description: [
      "Architected and developed SSI Studios, a full-stack internal platform that automates the creation, management, and distribution of digital assets such as certificates, ID cards, visiting cards, posters, and invitations.",
      "Implemented a modular Next.js App Router architecture with scalable API routes, MongoDB data models, and optimized workflows for large-scale asset generation and batch operations.",
      "Built automated generators and processing tools including certificate creation, visiting card and ID card rendering, background removal, PDF generation, and Excel import/export pipelines.",
      "Engineered a real-time analytics dashboard to monitor certificate usage, system activity, and asset generation metrics with dynamic updates and performance tracking.",
      "Integrated cloud services including AWS S3, Cloudinary, and SendGrid to enable scalable media storage, automated email distribution, and secure asset delivery.",
      "Optimized platform performance by reducing network requests, implementing code splitting and tree-shaking, and improving UI responsiveness with a modular component architecture."
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "MongoDB",
      "AWS S3",
      "Cloudinary",
      "SendGrid",
      "Tailwind CSS"
    ],
  },
  {
    title: "SMRSC 2026 Platform",
    image: "/images/smrsc.png",
    imageAlt: "SMRSC 2026 Global Robotic Surgery Conference Platform",
    images: ["/images/smrsc.png"],
    url: "https://www.ssinnovations.com/SMRSC_2026/home/",
    github: "",
    description: [
      "Architected and developed the official web platform for SMRSC 2026, a global robotic surgery conference connecting surgeons, healthcare leaders, and innovators exploring the future of connected surgical care.",
      "Built the platform using Next.js App Router with a full-stack architecture, integrating frontend UI and backend API routes within a single scalable application.",
      "Implemented dynamic conference modules including schedules, faculty profiles, venue information, media content, and seamless event registration workflows.",
      "Developed interactive UI experiences with Framer Motion, Lenis smooth scrolling, and responsive Tailwind components to deliver a high-performance, immersive conference website.",
      "Integrated MongoDB and custom API routes to track visitor analytics and manage dynamic content across multiple sections of the platform."
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "MongoDB",
      "Mongoose",
      "Lenis"
    ],
  },
  {
    title: "SSI CRS",
    image: "/images/ssicrs.png", 
    imageAlt: "SSI CRS Training Portal",
    images: ["/images/ssicrs.png"],
    url: "https://ssicrsweb.vercel.app/Home",
    github: "",
    description: [
      "Architected a dedicated digital portal for healthcare professionals to register for specialized training programs on the SSI Mantra, India's first indigenous surgical robotic system.",
      "Developed a seamless enrollment hub that streamlines the sign-up process for hands-on surgical courses, empowering doctors to efficiently acquire skills for highly precise, minimally invasive robotic surgeries.",
      "Engineered the platform to scale training accessibility, ultimately helping medical staff deliver safer, smarter, and more accessible surgical care to patients worldwide."
    ],
    technologies: ["Next.js", "React", "Tailwind CSS", "Healthcare Tech"],
  },
  {
    title: "MediLens Clinical Intelligence Platform",
    image: "/images/medilens.png", 
    imageAlt: "MediLens Clinical Intelligence Dashboard showing medical imaging and speech biomarker data",
    images: ["/images/medilens.png"],
    url: "https://medilenss.vercel.app/",
    github: "",
    description: [
      "Built MediLens, a production-grade multimodal AI diagnostic platform that integrates retinal imaging, chest X-rays, ECG signals, speech biomarkers, dermatology analysis, and cognitive testing into a unified clinical dashboard.",
      "Developed a full-stack architecture using Next.js and FastAPI with modular AI pipelines enabling real-time medical analysis across multiple diagnostic modules with sub-3-second processing.",
      "Implemented explainable AI capabilities including Grad-CAM visual heatmaps, biomarker breakdowns, and LLM-generated clinical explanations for transparent and interpretable diagnostics.",
      "Integrated cloud services such as Amazon Polly for voice-based clinical summaries and built secure, scalable APIs with audit logging and real-time system monitoring for healthcare-grade reliability."
    ],
    technologies: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "PyTorch"],
  },
  {
    title: "Black Hole Simulation",
    image: "/images/blackhole.png", 
    imageAlt: "Black Hole Simulation Visualization",
    images: ["/images/blackhole.png"],
    url: "https://blackhole-nu-red.vercel.app/",
    github: "",
    description: [
      "Developed a real-time, interactive WebGL simulation of Schwarzschild/Kerr black holes using General Relativistic Ray Marching and GLSL.",
      "Implemented physically accurate gravitational lensing, volumetric accretion disks with Doppler beaming, and optimized adaptive step sizing for high-performance rendering.",
    ],
    technologies: ["Next.js", "WebGL", "GLSL", "TypeScript", "React"],
  },
];

// =====================================================
// ANIMATION CONFIG
// =====================================================
// Unified smooth spring transition for all layout changes
const springTransition: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 24,
  mass: 1.1,
};

// =====================================================
// COMPONENTS
// =====================================================

interface ProjectCardProps {
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isExpanded,
  onToggle,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Normalize images to an array
  const images: (string | StaticImageData)[] = project.images || (project.image ? [project.image] : []);
  const hasMultipleImages = images.length > 1;

  const nextImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Helper to safely get the image source string
  const getImgSrc = (img: string | StaticImageData | undefined) => {
    if (!img) return "";
    return typeof img === "string" ? img : img.src;
  };

  return (
    <motion.div
      layout
      transition={springTransition}
      onClick={onToggle}
      // Removed transition-all and duration classes from here to let Framer Motion handle it
      className={`group cursor-pointer flex flex-col relative overflow-hidden rounded-2xl bg-transparent backdrop-blur-none border-0 z-0
        ${
          isExpanded
            ? "h-auto shadow-[0_0_80px_-20px_rgba(255,255,255,0.05)]"
            : "h-[400px] sm:h-[480px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
        }`}
    >
      {/* Liquid Glass Outline */}
      <div className="absolute inset-0 rounded-2xl border border-foreground/20 pointer-events-none z-30"></div>

      {/* Internal Glass Highlight */}
      <div className="absolute inset-[1px] rounded-[calc(1rem-1.5px)] border border-foreground/5 pointer-events-none z-30"></div>

      {/* Progressive Glass Background Layer */}
      <div
        className="absolute inset-0 bg-foreground/[0.02] rounded-2xl pointer-events-none z-0"
        style={{
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        }}
      />
      
      {/* Fading blue - center vertical gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.03] via-transparent to-transparent pointer-events-none z-0"></div>

      {/* Premium Blur Gradient */}
      <div
        className="absolute inset-0 backdrop-blur-xl pointer-events-none z-0"
        style={{
          maskImage: "linear-gradient(to bottom, black 10%, rgba(0,0,0,0.5) 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 10%, rgba(0,0,0,0.5) 40%, transparent 100%)",
        }}
      />

      {/* Premium Liquid Accents */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/50 to-transparent opacity-70 group-hover:opacity-100 transition-opacity z-40"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.05] via-transparent to-transparent pointer-events-none z-30"></div>

      {/* Project Image Area with Progressive Mask */}
      <motion.div
        layout
        transition={springTransition}
        // Removed CSS transitions to avoid layout jumping
        className={`relative overflow-hidden z-10
          ${isExpanded ? "h-[250px] sm:h-[400px] lg:h-[500px]" : "h-[200px] sm:h-[240px]"}`}
        style={{
          maskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            layout // Added layout here so image scales perfectly with the container
            transition={springTransition}
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            src={getImgSrc(images[isExpanded ? currentImageIndex : 0])}
            alt={project.imageAlt || `${project.title} screenshot`}
            // Removed duration-700 from here to let FM control the layout transformation
            className={`w-full h-full object-cover object-top ${
              !isExpanded ? "transition-transform duration-700 group-hover:scale-110" : ""
            }`}
          />
        </AnimatePresence>

        {/* Fallback Placeholder (if no image at all) */}
        {!images.length && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 flex items-center justify-center">
            <Layers className="text-foreground/10 w-12 h-12 sm:w-16 sm:h-16" />
          </div>
        )}

        {/* Carousel Controls - Only visible when expanded & multiple images */}
        {hasMultipleImages && isExpanded && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-4 z-40">
              <button
                onClick={prevImage}
                className="p-2 sm:p-3 rounded-full bg-background/40 backdrop-blur-md border border-foreground/10 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground/20 hover:text-background"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-4 z-40">
              <button
                onClick={nextImage}
                className="p-2 sm:p-3 rounded-full bg-background/40 backdrop-blur-md border border-foreground/10 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground/20 hover:text-background"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            {/* Carousel Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-40">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentImageIndex
                      ? "w-4 bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      : "w-1.5 bg-foreground/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Softened overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-50" />

        {/* Action Icons Overlay */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <AnimatePresence>
            {!isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-2"
              >
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-full bg-background/40 backdrop-blur-xl border border-foreground/10 hover:bg-foreground/20 hover:scale-110 transition-all text-foreground"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-full bg-background/40 backdrop-blur-xl border border-foreground/10 hover:bg-foreground/20 hover:scale-110 transition-all text-foreground"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="hidden lg:flex p-2.5 rounded-full bg-foreground/10 backdrop-blur-md text-foreground hover:bg-foreground/20 transition-all border border-foreground/20 shadow-lg"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Title Overlay for Expanded Card */}
        {isExpanded && (
          <div className="absolute bottom-6 sm:bottom-8 left-6 sm:right-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
              className="space-y-1.5 sm:space-y-2"
            >
              <span className="text-foreground/80 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] bg-foreground/5 px-2.5 py-1 rounded-full border border-foreground/10 backdrop-blur-md inline-block mb-1 sm:mb-0">
                Project Deep Dive
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground title-font drop-shadow-2xl tracking-tight leading-none">
                {project.title}
              </h3>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Card Content Area */}
      <motion.div
        layout
        transition={springTransition}
        className={`px-5 pb-6 pt-1 sm:px-8 sm:pb-8 sm:pt-2 flex-1 flex flex-col relative z-20 ${
          isExpanded ? "bg-foreground/[0.01]" : ""
        }`}
      >
        {!isExpanded && (
          <div className="mb-3 mt-2 sm:mt-0">
            <h3 className="text-lg sm:text-xl font-bold title-font text-foreground/90 group-hover:text-foreground transition-colors mb-1.5 sm:mb-2 tracking-tight">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-purple-300/80 group-hover:text-purple-300 transition-colors"
                >
                  {tech}
                  {i < 2 ? " •" : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              // Optimized animation entry/exit to sync perfectly with the layout stretch
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4 } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
              className="w-full space-y-8 mt-4 sm:mt-6"
            >
              {/* Organized Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                {/* Description Column */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-px w-6 sm:w-8 bg-purple-500/50"></div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300 shrink-0">
                      Core Initiatives
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-purple-500/20 to-transparent"></div>
                  </div>
                  <div className="space-y-4 sm:space-y-5">
                    {Array.isArray(project.description) ? (
                      project.description.map((point, i) => (
                        <div key={i} className="flex gap-3 sm:gap-4 group/item">
                          <div className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground/30 group-hover/item:bg-foreground/60 transition-colors shrink-0" />
                          <p className="text-sm sm:text-base leading-relaxed text-foreground/80 font-light">
                            {point}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm sm:text-base leading-relaxed text-foreground/80 font-light">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tech Snapshot Column */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-foreground/[0.02] border border-foreground/5 space-y-6">
                    <div>
                      <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-4">
                        Technical Snapshot
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="text-[9px] sm:text-[10px] font-bold text-foreground/80 bg-foreground/5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-foreground/10 hover:bg-foreground/10 transition-colors cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 sm:pt-8 border-t border-foreground/5 flex flex-col gap-3 sm:gap-4">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all border border-foreground/10"
                        >
                          <div className="flex items-center gap-3">
                            <Github className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/70 group-hover/btn:text-foreground transition-colors" />
                            <span className="text-xs sm:text-sm font-semibold text-foreground/70 group-hover/btn:text-foreground transition-colors">
                              Source Code
                            </span>
                          </div>
                          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-foreground/50 group-hover/btn:text-foreground/80 transition-colors">
                            GitHub
                          </div>
                        </a>
                      )}

                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-indigo-500/5 hover:bg-indigo-500/15 transition-all border border-indigo-500/20"
                        >
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400/70 group-hover/btn:text-indigo-400 transition-colors" />
                            <span className="text-xs sm:text-sm font-semibold text-indigo-300/70 group-hover/btn:text-indigo-300 transition-colors">
                              Live Demo
                            </span>
                          </div>
                          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-indigo-500/50 group-hover/btn:text-indigo-400/50 transition-colors">
                            Preview
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Unified Collapse Footer (Symmetrical to Expand button) */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                className="mt-6 sm:mt-8 pt-4 border-t border-foreground/5 flex items-center justify-between cursor-pointer group/close"
              >
                <span className="text-[9px] sm:text-[10px] font-bold text-foreground/50 uppercase tracking-widest group-hover/close:text-foreground transition-colors">
                  Collapse Project
                </span>
                <div className="p-2 rounded-full bg-foreground/5 group-hover/close:bg-foreground/10 transition-colors">
                  <ChevronUp className="text-foreground/60 group-hover/close:text-foreground group-hover/close:-translate-y-0.5 transition-all w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              // Added delay to fade in AFTER the layout scales down, ensuring no overflow
              animate={{ opacity: 1, transition: { delay: 0.15 } }}
              // Fast exit to instantly make room for the expansion
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="space-y-4 flex-1 flex flex-col justify-between"
            >
              <p className="line-clamp-3 text-xs sm:text-sm text-foreground/60 font-light leading-relaxed">
                {Array.isArray(project.description)
                  ? project.description[0]
                  : project.description}
              </p>

              <div className="pt-4 border-t border-foreground/5 flex items-center justify-between pointer-events-none mt-auto">
                <span className="text-[8px] sm:text-[9px] font-bold text-foreground/50 uppercase tracking-[0.2em] group-hover:text-foreground transition-colors">
                  Explore Project
                </span>
                <ChevronDown className="text-foreground/40 group-hover:text-foreground group-hover:translate-y-0.5 transition-all w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    const isExpanding = expandedId !== id;
    setExpandedId(isExpanding ? id : null);
    
    if (isExpanding) {
      // Shorter timeout to ride alongside the spring animation
      setTimeout(() => {
        document
          .getElementById(`project-${id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150); 
    }
  };

  return (
    <section
      id="projects"
      className="pb-16 sm:pb-24 lg:pb-32 border-b border-foreground/10 scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-10 sm:mb-12 md:mb-16 gap-6 sm:gap-8 md:gap-12 mt-12 sm:mt-16 lg:mt-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground">
              My <br className="hidden sm:block" /> <span className="text-foreground/50">Projects.</span>
            </h1>
          </div>
        </div>

        {/* --- GRID --- */}
        <motion.div 
          layout 
          transition={springTransition}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-min"
        >
          {PROJECTS.map((project, index) => {
            const isExpanded = expandedId === index;
            return (
              <motion.div
                layout
                transition={springTransition}
                id={`project-${index}`}
                key={`${project.title}-${index}`}
                // Removed CSS transitions from the wrapper layout block
                className={`${
                  isExpanded
                    ? "col-span-1 md:col-span-2 lg:col-span-2 z-10"
                    : "col-span-1 z-0"
                }`}
              >
                <ProjectCard
                  project={project}
                  isExpanded={isExpanded}
                  onToggle={() => toggleExpand(index)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
