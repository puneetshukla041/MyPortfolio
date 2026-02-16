"use client";

import { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaLayerGroup,
} from "react-icons/fa";
import { FiGlobe } from "react-icons/fi";
import { useState, MouseEvent, SyntheticEvent } from "react";

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
    imageAlt: "SSI STUDIOS Platform Dashboard",
    images: ["/images/ssistudios.png"],
    url: "https://ssistudios.vercel.app",
    github: "",
    description: [
      "Architected a full-stack Next.js web application for SS Innovations to automate manual design and data entry, replacing tedious Photoshop workflows with a centralized asset generation platform.",
      "Developed automated design generators for ID Cards, Visiting Cards, Invitations, and Posters, programmatically handling text formatting, logo alignment, scaling, and background removal.",
      "Built a Certificate Module with 'Smart Excel Import' for automated data cleaning, deduplication, and bulk email distribution via a custom mail API.",
      "Engineered a real-time admin dashboard with custom analytics to track monthly usage trends, system status, and asset generation metrics without page reloads.",
      "Designed a clean, accessible UI using React and Tailwind CSS, featuring dynamic Light/Dark themes, secure role-based authentication, and a built-in bug reporting tool."
    ],
    technologies: ["Next.js", "React", "Tailwind CSS", "Full-Stack", "Automation"],
  },
  {
    title: "SMRSC 2026 Platform",
    image: "/images/smrsc.png",
    imageAlt: "SMRSC 2026 Global Conference Platform",
    images: ["/images/smrsc.png"],
    url: "https://www.ssinnovations.com/SMRSC_2026/home/",
    github: "",
    description: [
      "Architected the official web platform for SMRSC (SSI Multi-Specialty Robotic Surgery Conference), a global event uniting surgeons, innovators, and healthcare leaders to explore the future of connected surgical care.",
      "Engineered a 'Next-Level' interactive venue map with Framer Motion, featuring fully responsive glassmorphic UI elements, animated path drawing, traveling data-packet animations, and fluid mobile-to-desktop layout transitions.",
      "Developed complex, dynamic UI sections including floating 'Clinical Outcomes' grids, utilizing advanced CSS viewport units and mathematical scaling to ensure a flawless experience across all devices.",
      "Delivered a premium, high-performance digital hub for attendees to access live robotic procedure demonstrations, schedules, and the latest technological advancements in modern surgery."
    ],
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Advanced UI/UX"
    ],
  },
  {
    title: "SSI CRS",
    image: "/images/ssicrs.png", 
    imageAlt: "SSI CRS Training Portal",
    images: ["/images/ssicrs.png"],
    url: "https://ssiscrsweb.vercel.app",
    github: "",
    description: [
      "Architected a dedicated digital portal for healthcare professionals to register for specialized training programs on the SSI Mantra, India's first indigenous surgical robotic system.",
      "Developed a seamless enrollment hub that streamlines the sign-up process for hands-on surgical courses, empowering doctors to efficiently acquire skills for highly precise, minimally invasive robotic surgeries.",
      "Engineered the platform to scale training accessibility, ultimately helping medical staff deliver safer, smarter, and more accessible surgical care to patients worldwide."
    ],
    technologies: ["Next.js", "React", "Tailwind CSS", "Healthcare Tech"],
  },
  {
    title: "Hiregeist Job Platform",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1600&auto=format&fit=crop",
    images: ["https://hiregeist.vercel.app/"],
    url: "https://hiregeist.vercel.app/",
    github: "https://github.com/steeltroops-ai/Hiregeist",
    description: [
      "Architected modern job placement platform designed to transform how students discover opportunities and companies find talent.",
      "Implemented intelligent matching algorithms and comprehensive user management system with real-time communication features.",
    ],
    technologies: ["Next.js 15", "React 19", "TypeScript"],
  },
  {
    title: "Black Hole Simulation",
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop",
    ],
    url: "https://blackhole-simulation.vercel.app/",
    github: "https://github.com/steeltroops-ai/blackhole-simulation",
    description: [
      "Developed a real-time, interactive WebGL simulation of Schwarzschild/Kerr black holes using General Relativistic Ray Marching and GLSL.",
      "Implemented physically accurate gravitational lensing, volumetric accretion disks with Doppler beaming, and optimized adaptive step sizing for high-performance rendering.",
    ],
    technologies: ["Next.js", "WebGL", "GLSL", "TypeScript", "React"],
  },
  {
    title: "Robotics Telemetry Intelligence System",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://res.cloudinary.com/canonical/image/fetch/f_auto,q_auto,fl_sanitize,c_fill,w_1600/https%3A%2F%2Fubuntu.com%2Fwp-content%2Fuploads%2F587d%2Fimage-1.png",
    ],
    url: "",
    github: "",
    description: [
      "Developed scalable services to ingest and analyze real-time surgical robotics telemetry using anomaly detection and time-series optimization models.",
      "Built structured logging, monitoring and reproducible ML pipelines to ensure production reliability and research traceability.",
    ],
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Python", "MLFlow"],
  },
  {
    title: "Research Knowledge Graph & Semantic Explorer",
    image:
      "https://images.unsplash.com/photo-1558494949-efc02570fbc9?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558494949-efc02570fbc9?q=80&w=1600&auto=format&fit=crop",
    ],
    url: "",
    github: "",
    description: [
      "Designed a structured knowledge graph mapping researchers, publications and datasets into relational and semantic models and indexed 2k+ research papers using embedding-based semantic search with optimized chunking and retrieval reranking.",
      "Integrated LLM-based entity extraction and embedding pipelines to automate metadata enrichment and enable relationship mapping.",
    ],
    technologies: ["TypeScript", "PostgreSQL", "LLM APIs", "Embeddings"],
  },
  {
    title: "Neza Digital Marketplace",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1600&auto=format&fit=crop",
    ],
    url: "",
    github: "https://github.com/steeltroops-ai/Neza",
    description: [
      "Developed a digital service marketplace connecting households and businesses with local service providers.",
      "Implemented multi-user architecture, secure authentication, real-time service listing, and provider management.",
      "Integrated payment workflows via Razorpay, role-based access control, and responsive design, ensuring seamless transactions and optimal user experience.",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "Razorpay",
      "Authentication",
    ],
  },
  {
    title: "MDC Dataset Citation Classification",
    image:
      "https://t3.ftcdn.net/jpg/13/75/28/26/360_F_1375282680_4evcXpRfIBSe5Wi4ISRIPHwFuSiEqY40.jpg",
    images: [
      "https://t3.ftcdn.net/jpg/13/75/28/26/360_F_1375282680_4evcXpRfIBSe5Wi4ISRIPHwFuSiEqY40.jpg",
    ],
    url: "",
    github: "",
    description: [
      "Automated classification of dataset citations in scientific literature using NLP and ensemble ML with SciBERT and classical models.",
      "Classifies references as primary, secondary, or missing with detailed performance metrics and comprehensive evaluation framework.",
    ],
    technologies: ["Python", "SciBERT", "Ensemble Methods", "NLP"],
  },
  {
    title: "Pytorch Transformer Implementation",
    image:
      "https://images.unsplash.com/photo-1655720828018-edd2daec9349?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://image.slidesharecdn.com/paperpresentationmaroua-200416144727/75/Attention-Is-All-You-Need-presented-by-Maroua-Maachou-Veepee-1-2048.jpg",
    ],
    url: "",
    github: "https://github.com/steeltroops-ai/Pytorch-Transformer",
    description: [
      "Built the 'Attention is All You Need' transformer architecture from scratch, including self-attention, positional encodings, and beam search for sequence-to-sequence modeling.",
      "Created reproducible training pipelines with configuration management and attention map visualizations to improve interpretability of transformer layers.",
    ],
    technologies: ["Python", "PyTorch", "Transformers", "NLP"],
  },
  {
    title: "Finance Management App",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    images: ["https://banking-jet.vercel.app/sign-in"],
    url: "https://banking-jet.vercel.app/sign-in",
    github: "https://github.com/steeltroops-ai/finanace-management-banking-app",
    description: [
      "Built a finance management platform enabling secure multi-bank linking, real-time fund tracking, and seamless transfers.",
      "Implemented server-side rendering (SSR) authentication, responsive dashboards, and categorized spending insights for a smooth, dynamic user experience.",
    ],
    technologies: ["Next.js", "TypeScript", "Plaid", "Dwolla", "Appwrite"],
  },
  {
    title: "Robot Bionic Arm",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600&auto=format&fit=crop",
    ],
    url: "",
    github: "",
    description: [
      "Developed a lightweight robotic arm with custom PID controllers and inverse kinematics for precise motion; integrated real-time ROS2 nodes for sensor fusion, adaptive actuation, and closed-loop feedback.",
      "Designed and 3D-printed modular mechanical components optimized for joint torque, response latency, and high precision manipulation tasks.",
    ],
    technologies: ["ROS2", "C++", "Python", "PID Control", "3D Printing"],
  },
  {
    title: "Niryo LLM Robotic Arm Integration",
    image:
      "https://images.unsplash.com/photo-1610056382180-2d88c42ce095?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://www.tegakari.net/wp-content/uploads/2020/05/niryo_ecosystem_img.jpg",
    ],
    url: "",
    github: "https://github.com/steeltroops-ai/Niryo-llm-robo",
    description: [
      "Integrated Niryo Ned2 robotic arm with computer vision and Large Language Model capabilities for intelligent object manipulation and task execution.",
      "Developed natural language interface allowing users to command robotic operations through conversational AI with real time task interpretation.",
    ],
    technologies: ["Python", "ROS2", "Computer Vision", "LLM"],
  },
  {
    title: "VR Firefighting & Flood Training Simulator",
    image:
      "https://images.unsplash.com/photo-1592478411213-61535f944806?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592478411213-61535f944806?q=80&w=1600&auto=format&fit=crop",
    ],
    url: "",
    github: "",
    description: [
      "Built a fully interactive physics-based VR simulator in UE5 for firefighter training in multi-hazard flood/fire scenarios, including dynamic hazard propagation and environment response.",
      "Implemented immersive VR interaction systems in C++ for real-time collision detection, hazard-triggered events, and scenario-based rescue simulations.",
    ],
    technologies: ["Unreal Engine 5", "C++", "Physics Simulation", "VR"],
  },
  {
    title: "Maze-Bot ROS2 Navigation Platform",
    image:
      "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://repository-images.githubusercontent.com/399864768/481a8c17-7750-4025-9b0d-a15ede469cf0",
    ],
    url: "",
    github: "",
    description: [
      "Developed comprehensive ROS2-based autonomous navigation platform featuring advanced algorithms, SLAM integration, and professional-grade testing framework for robotics research.",
      "Implemented sophisticated path planning algorithms including A*, RRT, and dynamic window approach for optimal navigation in complex environments.",
    ],
    technologies: ["ROS2", "C++", "SLAM", "Path Planning"],
  },
  {
    title: "House Price Prediction Model with MLOps",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop",
    images: [
      "https://miro.medium.com/v2/resize:fit:1400/1*CfdC88fMxquhEFfWXlbtTA.jpeg",
      "https://miro.medium.com/1*NiK9cocmfSWmGYLmOGRwyg.png",
    ],
    url: "",
    github:
      "https://github.com/steeltroops-ai/House-Price-Prediction-with-MLOps",
    description: [
      "Developed an end-to-end ML pipeline for house price prediction, including data ingestion, preprocessing, feature engineering, and model training with log transformations, scaling, and one-hot encoding.",
      "Implemented multimodal model evaluation using RMSE, R², cross-validation, and set up workflow monitoring to track pipeline performance and ensure reproducibility.",
    ],
    technologies: ["Python", "Scikit-learn", "ZenML", "MLflow"],
  },
];

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

  // normalize images to an array
  const images: (string | StaticImageData)[] = project.images || (project.image ? [project.image] : []);
  const hasMultipleImages = images.length > 1;

  const nextImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + images.length) % images.length
    );
  };

  const handleToggle = () => {
    onToggle();
  };

  return (
    <div
      onClick={handleToggle}
      className={`group cursor-pointer flex flex-col relative overflow-hidden rounded-2xl transition-all duration-500
        bg-transparent backdrop-blur-none border-0 z-0
        ${
          isExpanded
            ? "md:min-h-[1000px] h-auto shadow-[0_0_80px_-20px_rgba(255,255,255,0.1)]"
            : "h-[480px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
        }`}
    >
      {/* Liquid Glass Outline - Apple Style Refraction */}
      <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none z-30"></div>

      {/* Internal Glass Highlight (Specular) */}
      <div className="absolute inset-[1px] rounded-[calc(1rem-1.5px)] border border-white/5 pointer-events-none z-30"></div>

      {/* Progressive Glass Background Layer */}
      <div
        className="absolute inset-0 bg-white/[0.01] rounded-2xl pointer-events-none z-0"
        style={{
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 60%, transparent 100%)",
        }}
      />
      {/* fading blue - center vertical gradient to bridge sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.03] via-transparent to-transparent pointer-events-none z-0"></div>

      {/* Premium Blur Gradient - Liquid Glass Progressive Blur */}
      <div
        className="absolute inset-0 backdrop-blur-xl pointer-events-none z-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 10%, rgba(0,0,0,0.5) 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 10%, rgba(0,0,0,0.5) 40%, transparent 100%)",
        }}
      />

      {/* Premium Liquid Accents - Replicating MobileNav/Apple Edge Logic */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70 group-hover:opacity-100 transition-opacity z-40"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none z-30"></div>

      {/* Project Image Area with Progressive Mask */}
      <div
        className={`relative overflow-hidden transition-all duration-700 ease-in-out z-10
          ${isExpanded ? "h-[450px] sm:h-[550px]" : "h-[240px]"}`}
        style={{
          maskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 90%, transparent 100%)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            src={(() => {
              const currentImg = images[isExpanded ? currentImageIndex : 0];
              const isExternalUrl =
                typeof currentImg === "string" && currentImg.startsWith("http");
              const isDirectImage =
                isExternalUrl &&
                /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(currentImg as string);

              if (!currentImg && !project.image) return "";

              if (project.url && !hasMultipleImages) {
                const cleanProjectUrl = project.url.replace(/\/$/, "");
                // Reduced resolution for faster loading
                return `https://api.microlink.io/?url=${encodeURIComponent(
                  cleanProjectUrl
                )}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=dark&viewport.isMobile=false&viewport.width=800&viewport.height=500`;
              }

              if (isExternalUrl && !isDirectImage) {
                const cleanUrl = (currentImg as string).replace(/\/$/, "");
                return `https://api.microlink.io/?url=${encodeURIComponent(
                  cleanUrl
                )}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=dark&viewport.isMobile=false&viewport.width=800&viewport.height=500`;
              }

              return (currentImg as string) || (project.image as string) || "";
            })()}
            // @ts-ignore - fetchPriority is valid in modern browsers but not yet in all React TS definitions
            fetchPriority={isExpanded ? "high" : "low"}
            loading="lazy"
            width={800}
            height={500}
            alt={
              project.imageAlt ||
              `${project.title} - ${isExpanded ? currentImageIndex + 1 : 1}`
            }
            className={`w-full h-full object-cover object-top transition-transform duration-700 ${
              !isExpanded ? "group-hover:scale-110" : ""
            }`}
            data-original-url={images[isExpanded ? currentImageIndex : 0]}
            onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
              const imgElement = e.currentTarget;
              const currentSrc = imgElement.src;
              const originalUrl = imgElement.getAttribute("data-original-url");

              if (!originalUrl || !originalUrl.startsWith("http")) {
                if (project.image) imgElement.src = project.image as string;
                return;
              }

              const cleanUrl = originalUrl.replace(/\/$/, "");

              if (currentSrc.includes("microlink.io")) {
                imgElement.src = `https://image.thum.io/get/width/800/crop/500/noanimate/${cleanUrl}`;
              } else {
                imgElement.src =
                  (project.image as string) ||
                  "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=800";
              }
            }}
          />
        </AnimatePresence>

        {/* Fallback Placeholder (if no image at all) */}
        {!images[isExpanded ? currentImageIndex : 0] && !project.image && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 flex items-center justify-center">
            <FaLayerGroup className="text-white/10 text-6xl" />
          </div>
        )}

        {/* Carousel Controls - Only visible when expanded */}
        {hasMultipleImages && isExpanded && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 z-40">
              <button
                onClick={prevImage}
                className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
              >
                <FaChevronLeft className="text-xs" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 z-40">
              <button
                onClick={nextImage}
                className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
            {/* Carousel Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-40">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentImageIndex
                      ? "w-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      : "w-1 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Softened overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />

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
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/20 hover:scale-110 transition-all"
                  >
                    <FaGithub className="text-white text-sm" />
                  </a>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/20 hover:scale-110 transition-all"
                  >
                    <FiGlobe className="text-white text-sm" />
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
              className="hidden lg:flex p-2.5 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/20"
            >
              <FaChevronUp className="text-sm" />
            </button>
          )}
        </div>

        {/* Title Overlay for Expanded Card */}
        {isExpanded && (
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1.5"
            >
              <span className="text-white/80 text-[9px] font-bold uppercase tracking-[0.2em] bg-white/5 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
                Project Deep Dive
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white title-font drop-shadow-2xl tracking-tight">
                {project.title}
              </h3>
            </motion.div>
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div
        className={`px-6 pb-6 pt-1 sm:px-8 sm:pb-8 sm:pt-2 flex-1 flex flex-col relative z-20 ${
          isExpanded ? "bg-white/[0.01]" : ""
        }`}
      >
        {!isExpanded && (
          <div className="mb-3">
            <h3 className="text-lg font-bold title-font text-neutral-200 group-hover:text-white transition-colors mb-1 tracking-tight">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="text-[9px] uppercase tracking-wider font-bold text-purple-300/80 group-hover:text-purple-300 transition-colors"
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full space-y-8"
            >
              {/* Organized Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Description Column */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-purple-500/50"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300 shrink-0">
                      Core Initiatives
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-purple-500/20 to-transparent"></div>
                  </div>
                  <div className="space-y-4">
                    {Array.isArray(project.description) ? (
                      project.description.map((point, i) => (
                        <div key={i} className="flex gap-4 group/item">
                          <div className="mt-2.5 h-1.5 w-1.5 rounded-full bg-white/30 group-hover/item:bg-white/60 transition-colors shrink-0" />
                          <p className="text-sm sm:text-base leading-relaxed text-neutral-300 font-light">
                            {point}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm sm:text-base leading-relaxed text-neutral-300 font-light">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tech Snapshot Column */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">
                        Technical Snapshot
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold text-white/70 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center justify-between px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <FaGithub className="text-xl text-white/70 group-hover/btn:text-white transition-colors" />
                            <span className="text-sm font-semibold text-white/70 group-hover/btn:text-white transition-colors">
                              Source Code
                            </span>
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 group-hover/btn:text-neutral-300 transition-colors">
                            GitHub
                          </div>
                        </a>
                      )}

                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center justify-between px-6 py-4 rounded-xl bg-indigo-500/5 hover:bg-indigo-500/15 transition-all border border-indigo-500/20"
                        >
                          <div className="flex items-center gap-3">
                            <FiGlobe className="text-base text-indigo-400/70 group-hover/btn:text-indigo-400 transition-colors" />
                            <span className="text-sm font-semibold text-indigo-300/70 group-hover/btn:text-indigo-300 transition-colors">
                              Live Demo
                            </span>
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500/50 group-hover/btn:text-indigo-400/50 transition-colors">
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
                className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between cursor-pointer group/close"
              >
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest group-hover/close:text-white transition-colors">
                  Collapse Project
                </span>
                <FaChevronUp className="text-neutral-600 group-hover/close:text-white group-hover/close:-translate-y-0.5 transition-all text-[10px]" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <p className="line-clamp-3 text-sm text-neutral-400 font-light leading-relaxed">
                {Array.isArray(project.description)
                  ? project.description[0]
                  : project.description}
              </p>

              <div className="absolute bottom-6 left-6 right-6 pt-4 border-t border-white/5 flex items-center justify-between pointer-events-none">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                  Explore Project
                </span>
                <FaChevronDown className="text-neutral-600 group-hover:text-white group-hover:translate-y-0.5 transition-all text-[9px]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    if (expandedId !== id) {
      setTimeout(() => {
        document
          .getElementById(`project-${id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 350);
    }
  };

  return (
    <section
      id="projects"
      className="pb-16 sm:pb-24 lg:pb-32 border-b border-neutral-800 scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="my-12 sm:my-16 lg:my-24 section-title">
          My <span>Projects</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-min">
          {PROJECTS.map((project, index) => {
            const isExpanded = expandedId === index;
            return (
              <div
                id={`project-${index}`}
                key={`${project.title}-${index}`}
                className={`transition-all duration-300 ease-out 
                  ${
                    isExpanded
                      ? "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 z-10"
                      : "z-0"
                  }`}
              >
                <ProjectCard
                  project={project}
                  isExpanded={isExpanded}
                  onToggle={() => toggleExpand(index)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;