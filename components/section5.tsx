'use client';

import React, { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Clapperboard, 
  Sparkles, 
  Film, 
  MapPin, 
  Camera, 
  Sunrise, 
  Wind, 
  Cloud, 
  Palette, 
  Sun 
} from 'lucide-react';

// ===========================================================================
// GLOBAL VIDEO PRELOADER CONTEXT
// This handles downloading videos in the background sequentially.
// ===========================================================================
const VideoPreloadContext = createContext<{
  videoSources: Record<string, string>;
}>({ videoSources: {} });


// ===========================================================================
// SECTION 3
// ===========================================================================
const Section3 = () => {
  const { videoSources } = useContext(VideoPreloadContext);
  const videoSrc = videoSources['sec3'] || '/videos/heroone.webm';

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 15) + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const startTimer = setTimeout(() => {
        setShowIntro(true);
      }, 3000);

      const endTimer = setTimeout(() => {
        setShowIntro(false);
      }, 6500);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isLoading]);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = false;
    }
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const attemptPlay = useCallback(async () => {
    if (videoRef.current) {
      try {
        videoRef.current.volume = 1.0;
        videoRef.current.muted = false;
        await videoRef.current.play();
        setIsMuted(false);
      } catch {
        if (videoRef.current) {
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsMuted(true);
        }
      }
    }
  }, []);

  const pauseVideo = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const currentSectionRef = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          attemptPlay();
        } else {
          pauseVideo();
        }
      },
      { threshold: 0.5 }
    );
    if (currentSectionRef) observer.observe(currentSectionRef);
    return () => {
      if (currentSectionRef) observer.unobserve(currentSectionRef);
    };
  }, [isLoading, attemptPlay, pauseVideo]);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section
      id="section-3"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col md:flex-row"
    >
      <div
        className={`
          absolute inset-0 z-50 flex flex-col items-center justify-center bg-black
          transition-opacity duration-1000 ease-out
          ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Clapperboard className="w-10 h-10 text-neutral-600 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </div>
          <div className="h-[2px] w-48 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neutral-500 via-white to-neutral-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
            Loading 16mm Reel {progress}%
          </span>
        </div>
      </div>

      <div className="w-full md:flex-1 bg-black flex items-center justify-center relative border-b md:border-b-0 md:border-r border-white/10">
        <div className="relative w-full aspect-video group bg-neutral-900 overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              className="w-full h-full object-cover transform-gpu"
              loop
              playsInline
              preload="auto"
              onCanPlayThrough={handleVideoLoad}
              src={videoSrc}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            <div
              className={`
                absolute inset-0 z-30 flex flex-col items-center justify-center text-center pointer-events-none
                transition-all duration-[1500ms] cubic-bezier(0.19, 1, 0.22, 1)
                ${showIntro && !isLoading ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-md'}
              `}
            >
               <div className="space-y-2 md:space-y-4 mix-blend-overlay">
                <p className="text-[8px] md:text-[10px] font-bold tracking-[0.6em] text-white/80 uppercase">
                  Directed By
                </p>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-xl">
                  PUNEET SHUKLA
                </h1>
              </div>
            </div>

            {!isLoading && (
              <div className="absolute bottom-4 right-4 z-40 flex items-center gap-3 animate-fade-in">
                <div className="text-right hidden sm:block">
                    <p className="text-[8px] font-bold tracking-widest text-white/90 uppercase">Audio</p>
                    <p className="text-[8px] text-white/60 font-mono">STEREO</p>
                </div>
                <button
                  onClick={toggleSound}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/30 transition-all duration-300"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white/70" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white hover:text-yellow-400" />
                  )}
                </button>
              </div>
            )}
        </div>
      </div>

      <div className="w-full md:w-[40%] lg:w-[35%] bg-black flex flex-col items-center justify-center p-8 md:p-12 z-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-600/5 blur-[90px] rounded-full pointer-events-none" />
        <div className="relative max-w-sm text-center md:text-left space-y-8 md:space-y-12">
          <div className="flex flex-col items-center md:items-start gap-3 opacity-0 animate-cinematic-fade" style={{ animationDelay: '0.2s' }}>
             <div className="flex items-center gap-2 text-yellow-600/70">
                <Sparkles className="w-3 h-3" />
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase">The Divine Play</span>
             </div>
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[0.9]">
               Braj Ki <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-700">Holi</span>
             </h2>
          </div>

          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-neutral-700 to-transparent mx-auto md:mx-0 opacity-0 animate-cinematic-grow" style={{ animationDelay: '0.5s' }} />

          <p className="text-sm md:text-base font-light leading-relaxed text-neutral-400 opacity-0 animate-cinematic-up font-serif italic" style={{ animationDelay: '0.8s' }}>
            &quot;In the sacred lanes of Vrindavan, colors aren&apos;t just thrown—they are lived. 
            Witness the eternal dance where the divine love of Radha and Krishna 
            dissolves the boundaries between the human and the celestial.&quot;
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 opacity-0 animate-cinematic-fade" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center gap-2 text-neutral-700">
                <Film className="w-3 h-3" />
                <span className="text-[9px] tracking-widest uppercase font-bold">CinemaScope</span>
            </div>
             <div className="w-1 h-1 bg-neutral-800 rounded-full" />
             <span className="text-[9px] text-neutral-700 tracking-widest uppercase font-bold">Remastered</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-slow {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cinematic-up {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes cinematic-fade {
          0% { opacity: 0; filter: blur(2px); }
          100% { opacity: 1; filter: blur(0); }
        }
        @keyframes cinematic-grow {
          0% { opacity: 0; height: 0px; }
          100% { opacity: 1; } 
        }
        .animate-fade-in { animation: fade-in-slow 1s ease-out forwards; }
        .animate-cinematic-up { animation: cinematic-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-cinematic-fade { animation: cinematic-fade 2s ease-in-out forwards; }
        .animate-cinematic-grow { animation: cinematic-grow 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>
    </section>
  );
};


// ===========================================================================
// SECTION 4
// ===========================================================================
const Section4 = () => {
  const { videoSources } = useContext(VideoPreloadContext);
  const videoSrc = videoSources['sec4'] || '/videos/herotwo.webm';

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 15) + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const startTimer = setTimeout(() => {
        setShowIntro(true);
      }, 3000);

      const endTimer = setTimeout(() => {
        setShowIntro(false);
      }, 6500);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isLoading]);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = false;
    }
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const attemptPlay = useCallback(async () => {
    if (videoRef.current) {
      try {
        videoRef.current.volume = 1.0;
        videoRef.current.muted = false;
        await videoRef.current.play();
        setIsMuted(false);
      } catch {
        if (videoRef.current) {
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsMuted(true);
        }
      }
    }
  }, []);

  const pauseVideo = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const currentSectionRef = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          attemptPlay();
        } else {
          pauseVideo();
        }
      },
      { threshold: 0.5 }
    );
    if (currentSectionRef) observer.observe(currentSectionRef);
    return () => {
      if (currentSectionRef) observer.unobserve(currentSectionRef);
    };
  }, [isLoading, attemptPlay, pauseVideo]);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section
      id="section-4"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col md:flex-row-reverse"
    >
      <div
        className={`
          absolute inset-0 z-50 flex flex-col items-center justify-center bg-black
          transition-opacity duration-1000 ease-out
          ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Camera className="w-10 h-10 text-neutral-600 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping" />
          </div>
          <div className="h-[2px] w-48 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neutral-500 via-white to-neutral-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
            Focusing Lens {progress}%
          </span>
        </div>
      </div>

      <div className="w-full md:flex-1 bg-black flex items-center justify-center relative border-b md:border-b-0 md:border-l border-white/10">
        <div className="relative w-full aspect-video group bg-neutral-900 overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              className="w-full h-full object-cover transform-gpu"
              loop
              playsInline
              preload="auto"
              onCanPlayThrough={handleVideoLoad}
              src={videoSrc}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            <div
              className={`
                absolute inset-0 z-30 flex flex-col items-center justify-center text-center pointer-events-none
                transition-all duration-[1500ms] cubic-bezier(0.19, 1, 0.22, 1)
                ${showIntro && !isLoading ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-md'}
              `}
            >
               <div className="space-y-2 md:space-y-4 mix-blend-overlay">
                <p className="text-[8px] md:text-[10px] font-bold tracking-[0.6em] text-white/80 uppercase">
                  Directed By
                </p>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-xl">
                  PUNEET SHUKLA
                </h1>
              </div>
            </div>

            {!isLoading && (
              <div className="absolute bottom-4 right-4 z-40 flex items-center gap-3 animate-fade-in">
                <div className="text-right hidden sm:block">
                    <p className="text-[8px] font-bold tracking-widest text-white/90 uppercase">Ambience</p>
                    <p className="text-[8px] text-white/60 font-mono">RAW STEREO</p>
                </div>
                <button
                  onClick={toggleSound}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/30 transition-all duration-300"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white/70" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white hover:text-orange-400" />
                  )}
                </button>
              </div>
            )}
        </div>
      </div>

      <div className="w-full md:w-[40%] lg:w-[35%] bg-black flex flex-col items-center justify-center p-8 md:p-12 z-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-600/5 blur-[90px] rounded-full pointer-events-none" />
        <div className="relative max-w-sm text-center md:text-left space-y-8 md:space-y-12">
          <div className="flex flex-col items-center md:items-start gap-3 opacity-0 animate-cinematic-fade" style={{ animationDelay: '0.2s' }}>
             <div className="flex items-center gap-2 text-orange-600/70">
                <MapPin className="w-3 h-3" />
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Dwarka, Delhi</span>
             </div>
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[0.9]">
               Delhi Streets<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-orange-500 to-red-700">
                 Flower Market
               </span>
             </h2>
          </div>

          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-neutral-700 to-transparent mx-auto md:mx-0 opacity-0 animate-cinematic-grow" style={{ animationDelay: '0.5s' }} />

          <p className="text-sm md:text-base font-light leading-relaxed text-neutral-400 opacity-0 animate-cinematic-up font-serif italic" style={{ animationDelay: '0.8s' }}>
            &quot;Before the city wakes, the streets erupt in a chaotic symphony of fragrance and color. 
            Marigolds, roses, and jasmine flood the alleyways, painting the dawn 
            with the vibrant soul of the capital.&quot;
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 opacity-0 animate-cinematic-fade" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center gap-2 text-neutral-700">
                <Camera className="w-3 h-3" />
                <span className="text-[9px] tracking-widest uppercase font-bold">Street Photography</span>
            </div>
             <div className="w-1 h-1 bg-neutral-800 rounded-full" />
             <span className="text-[9px] text-neutral-700 tracking-widest uppercase font-bold">24mm Lens</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-slow {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cinematic-up {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes cinematic-fade {
          0% { opacity: 0; filter: blur(2px); }
          100% { opacity: 1; filter: blur(0); }
        }
        @keyframes cinematic-grow {
          0% { opacity: 0; height: 0px; }
          100% { opacity: 1; } 
        }
        .animate-fade-in { animation: fade-in-slow 1s ease-out forwards; }
        .animate-cinematic-up { animation: cinematic-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-cinematic-fade { animation: cinematic-fade 2s ease-in-out forwards; }
        .animate-cinematic-grow { animation: cinematic-grow 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>
    </section>
  );
};


// ===========================================================================
// SECTION BOMBAY
// ===========================================================================
const SectionBombay = () => {
  const { videoSources } = useContext(VideoPreloadContext);
  const videoSrc = videoSources['secBombay'] || '/videos/herofour.webm';

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 15) + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const startTimer = setTimeout(() => {
        setShowIntro(true);
      }, 4000);

      const endTimer = setTimeout(() => {
        setShowIntro(false);
      }, 6000);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isLoading]);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = false;
    }
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const attemptPlay = useCallback(async () => {
    if (videoRef.current) {
      try {
        videoRef.current.volume = 1.0;
        videoRef.current.muted = false;
        await videoRef.current.play();
        setIsMuted(false);
      } catch {
        if (videoRef.current) {
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsMuted(true);
        }
      }
    }
  }, []);

  const pauseVideo = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const currentSectionRef = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          attemptPlay();
        } else {
          pauseVideo();
        }
      },
      { threshold: 0.5 }
    );
    if (currentSectionRef) observer.observe(currentSectionRef);
    return () => {
      if (currentSectionRef) observer.unobserve(currentSectionRef);
    };
  }, [isLoading, attemptPlay, pauseVideo]);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section
      id="section-bombay"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col md:flex-row-reverse"
    >
      <div
        className={`
          absolute inset-0 z-50 flex flex-col items-center justify-center bg-black
          transition-opacity duration-1000 ease-out
          ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Sunrise className="w-10 h-10 text-neutral-600 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          </div>
          <div className="h-[2px] w-48 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neutral-500 via-white to-neutral-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
            Waking City {progress}%
          </span>
        </div>
      </div>

      <div className="w-full md:flex-1 bg-black flex items-center justify-center relative border-b md:border-b-0 md:border-l border-white/10">
        <div className="relative w-full aspect-video group bg-neutral-900 overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              className="w-full h-full object-cover transform-gpu"
              loop
              playsInline
              preload="auto"
              onCanPlayThrough={handleVideoLoad}
              src={videoSrc}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-blue-900/10 to-black/30 pointer-events-none" />

            <div
              className={`
                absolute inset-0 z-30 flex flex-col items-center justify-center text-center pointer-events-none
                transition-all duration-[1000ms] cubic-bezier(0.19, 1, 0.22, 1)
                ${showIntro && !isLoading ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-md'}
              `}
            >
               <div className="space-y-2 md:space-y-4 mix-blend-overlay">
                <p className="text-[8px] md:text-[10px] font-bold tracking-[0.6em] text-white/80 uppercase">
                  Directed By
                </p>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-xl">
                  PUNEET SHUKLA
                </h1>
              </div>
            </div>

            {!isLoading && (
              <div className="absolute bottom-4 right-4 z-40 flex items-center gap-3 animate-fade-in">
                <div className="text-right hidden sm:block">
                    <p className="text-[8px] font-bold tracking-widest text-white/90 uppercase">Soundscape</p>
                    <p className="text-[8px] text-white/60 font-mono">DOLBY ATMOS</p>
                </div>
                <button
                  onClick={toggleSound}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/30 transition-all duration-300"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white/70" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white hover:text-blue-400" />
                  )}
                </button>
              </div>
            )}
        </div>
      </div>

      <div className="w-full md:w-[40%] lg:w-[35%] bg-black flex flex-col items-center justify-center p-8 md:p-12 z-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="relative max-w-sm text-center md:text-left space-y-8 md:space-y-12">
          <div className="flex flex-col items-center md:items-start gap-3 opacity-0 animate-cinematic-fade" style={{ animationDelay: '0.2s' }}>
             <div className="flex items-center gap-2 text-blue-400/80">
                <Wind className="w-3 h-3" />
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Marine Drive</span>
             </div>
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[0.9]">
               The Life in <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-100 to-amber-500">
                 7 AM Bombay
               </span>
             </h2>
          </div>

          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-neutral-700 to-transparent mx-auto md:mx-0 opacity-0 animate-cinematic-grow" style={{ animationDelay: '0.5s' }} />

          <p className="text-sm md:text-base font-light leading-relaxed text-neutral-400 opacity-0 animate-cinematic-up font-serif italic" style={{ animationDelay: '0.8s' }}>
            &quot;The sea breeze carries the stories of a million dreams. As the first light 
            hits the Queen&apos;s Necklace, the city shakes off its slumber, ready to 
            conquer another day in the city that never sleeps.&quot;
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 opacity-0 animate-cinematic-fade" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center gap-2 text-neutral-700">
                <Sunrise className="w-3 h-3" />
                <span className="text-[9px] tracking-widest uppercase font-bold">First Light</span>
            </div>
             <div className="w-1 h-1 bg-neutral-800 rounded-full" />
             <span className="text-[9px] text-neutral-700 tracking-widest uppercase font-bold">16mm Film</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-slow {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cinematic-up {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes cinematic-fade {
          0% { opacity: 0; filter: blur(2px); }
          100% { opacity: 1; filter: blur(0); }
        }
        @keyframes cinematic-grow {
          0% { opacity: 0; height: 0px; }
          100% { opacity: 1; } 
        }
        .animate-fade-in { animation: fade-in-slow 1s ease-out forwards; }
        .animate-cinematic-up { animation: cinematic-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-cinematic-fade { animation: cinematic-fade 2s ease-in-out forwards; }
        .animate-cinematic-grow { animation: cinematic-grow 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>
    </section>
  );
};


// ===========================================================================
// SECTION NATURE
// ===========================================================================
const SectionNature = () => {
  const { videoSources } = useContext(VideoPreloadContext);
  const videoSrc = videoSources['secNature'] || '/videos/herofive.webm';

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 15) + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const startTimer = setTimeout(() => setShowIntro(true), 4000);
      const endTimer = setTimeout(() => setShowIntro(false), 6000);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isLoading]);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = false;
    }
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const attemptPlay = useCallback(async () => {
    if (videoRef.current) {
      try {
        videoRef.current.volume = 1.0;
        videoRef.current.muted = false;
        await videoRef.current.play();
        setIsMuted(false);
      } catch {
        if (videoRef.current) {
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsMuted(true);
        }
      }
    }
  }, []);

  const pauseVideo = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const currentSectionRef = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          attemptPlay();
        } else {
          pauseVideo();
        }
      },
      { threshold: 0.5 }
    );
    if (currentSectionRef) observer.observe(currentSectionRef);
    return () => {
      if (currentSectionRef) observer.unobserve(currentSectionRef);
    };
  }, [isLoading, attemptPlay, pauseVideo]);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section
      id="section-nature"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col md:flex-row"
    >
      <div
        className={`
          absolute inset-0 z-50 flex flex-col items-center justify-center bg-black
          transition-opacity duration-1000 ease-out
          ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Sun className="w-10 h-10 text-orange-500 animate-spin-slow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
          <div className="h-[2px] w-48 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-yellow-200 to-blue-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
            Painting Sky {progress}%
          </span>
        </div>
      </div>

      <div className="w-full md:flex-1 bg-black flex items-center justify-center relative border-b md:border-b-0 md:border-r border-white/10">
        <div className="relative w-full aspect-video group bg-neutral-900 overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              style={{ transform: 'translate(-50%, -50%) rotate(-90deg) scale(1.778)' }}
              className="absolute top-1/2 left-1/2 w-full h-full object-contain transform-gpu"
              loop
              playsInline
              preload="auto"
              onCanPlayThrough={handleVideoLoad}
              src={videoSrc}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-orange-900/10 to-black/30 pointer-events-none" />

            <div
              className={`
                absolute inset-0 z-30 flex flex-col items-center justify-center text-center pointer-events-none
                transition-all duration-[1000ms] cubic-bezier(0.19, 1, 0.22, 1)
                ${showIntro && !isLoading ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-md'}
              `}
            >
                <div className="space-y-2 md:space-y-4 mix-blend-overlay">
                <p className="text-[8px] md:text-[10px] font-bold tracking-[0.6em] text-white/80 uppercase">
                  Directed By
                </p>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-xl">
                  PUNEET SHUKLA
                </h1>
              </div>
            </div>

            {!isLoading && (
              <div className="absolute bottom-4 left-4 z-40 flex items-center gap-3 animate-fade-in">
                <button
                  onClick={toggleSound}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/30 transition-all duration-300"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white/70" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white hover:text-orange-400" />
                  )}
                </button>
                <div className="text-left hidden sm:block">
                    <p className="text-[8px] font-bold tracking-widest text-white/90 uppercase">Ambient</p>
                    <p className="text-[8px] text-white/60 font-mono">STEREO</p>
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="w-full md:w-[40%] lg:w-[35%] bg-black flex flex-col items-center justify-center p-8 md:p-12 z-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-600/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="relative max-w-sm text-center md:text-left space-y-8 md:space-y-12">
          <div className="flex flex-col items-center md:items-start gap-3 opacity-0 animate-cinematic-fade" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 text-orange-400/80">
                <Cloud className="w-3 h-3" />
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Ethereal Canvas</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[0.9]">
               Nature&apos;s <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-white to-blue-400">
                 Palette
               </span>
              </h2>
          </div>

          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-neutral-700 to-transparent mx-auto md:mx-0 opacity-0 animate-cinematic-grow" style={{ animationDelay: '0.5s' }} />

          <p className="text-sm md:text-base font-light leading-relaxed text-neutral-400 opacity-0 animate-cinematic-up font-serif italic" style={{ animationDelay: '0.8s' }}>
            &quot;The sky doesn&apos;t ask for attention, yet it commands it. In the gradient of the horizon, we find the colors of our own emotions—ever-changing, infinite, and beautifully untamed.&quot;
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 opacity-0 animate-cinematic-fade" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center gap-2 text-neutral-700">
                <Palette className="w-3 h-3" />
                <span className="text-[9px] tracking-widest uppercase font-bold">Vibrance</span>
            </div>
              <div className="w-1 h-1 bg-neutral-800 rounded-full" />
              <span className="text-[9px] text-neutral-700 tracking-widest uppercase font-bold">Horizon</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-slow {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cinematic-up {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes cinematic-fade {
          0% { opacity: 0; filter: blur(2px); }
          100% { opacity: 1; filter: blur(0); }
        }
        @keyframes cinematic-grow {
          0% { opacity: 0; height: 0px; }
          100% { opacity: 1; } 
        }
        @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-fade-in { animation: fade-in-slow 1s ease-out forwards; }
        .animate-cinematic-up { animation: cinematic-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-cinematic-fade { animation: cinematic-fade 2s ease-in-out forwards; }
        .animate-cinematic-grow { animation: cinematic-grow 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>
    </section>
  );
};


// ===========================================================================
// SECTION DREAMS
// ===========================================================================
const SectionDreams = () => {
  const { videoSources } = useContext(VideoPreloadContext);
  const videoSrc = videoSources['secDreams'] || '/videos/herosix.webm';

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 15) + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const startTimer = setTimeout(() => {
        setShowIntro(true);
      }, 4000);

      const endTimer = setTimeout(() => {
        setShowIntro(false);
      }, 6000);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isLoading]);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = false;
    }
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const attemptPlay = useCallback(async () => {
    if (videoRef.current) {
      try {
        videoRef.current.volume = 1.0;
        videoRef.current.muted = false;
        await videoRef.current.play();
        setIsMuted(false);
      } catch {
        if (videoRef.current) {
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsMuted(true);
        }
      }
    }
  }, []);

  const pauseVideo = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const currentSectionRef = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          attemptPlay();
        } else {
          pauseVideo();
        }
      },
      { threshold: 0.5 }
    );
    if (currentSectionRef) observer.observe(currentSectionRef);
    return () => {
      if (currentSectionRef) observer.unobserve(currentSectionRef);
    };
  }, [isLoading, attemptPlay, pauseVideo]);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section
      id="section-dreams"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col md:flex-row-reverse"
    >
      <div
        className={`
          absolute inset-0 z-50 flex flex-col items-center justify-center bg-black
          transition-opacity duration-1000 ease-out
          ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Sunrise className="w-10 h-10 text-neutral-600 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          </div>
          <div className="h-[2px] w-48 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neutral-500 via-white to-neutral-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
            Igniting Vision {progress}%
          </span>
        </div>
      </div>

      <div className="w-full md:flex-1 bg-black flex items-center justify-center relative border-b md:border-b-0 md:border-l border-white/10">
        <div className="relative w-full aspect-video group bg-neutral-900 overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              style={{ transform: 'translate(-50%, -50%) rotate(-90deg) scale(1.778)' }}
              className="absolute top-1/2 left-1/2 w-full h-full object-contain transform-gpu"
              loop
              playsInline
              preload="auto"
              onCanPlayThrough={handleVideoLoad}
              src={videoSrc}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-blue-900/10 to-black/30 pointer-events-none" />

            <div
              className={`
                absolute inset-0 z-30 flex flex-col items-center justify-center text-center pointer-events-none
                transition-all duration-[1000ms] cubic-bezier(0.19, 1, 0.22, 1)
                ${showIntro && !isLoading ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-md'}
              `}
            >
                <div className="space-y-2 md:space-y-4 mix-blend-overlay">
                <p className="text-[8px] md:text-[10px] font-bold tracking-[0.6em] text-white/80 uppercase">
                  Directed By
                </p>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-xl">
                  PUNEET SHUKLA
                </h1>
              </div>
            </div>

            {!isLoading && (
              <div className="absolute bottom-4 right-4 z-40 flex items-center gap-3 animate-fade-in">
                <div className="text-right hidden sm:block">
                    <p className="text-[8px] font-bold tracking-widest text-white/90 uppercase">Soundscape</p>
                    <p className="text-[8px] text-white/60 font-mono">DOLBY ATMOS</p>
                </div>
                <button
                  onClick={toggleSound}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/30 transition-all duration-300"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white/70" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white hover:text-blue-400" />
                  )}
                </button>
              </div>
            )}
        </div>
      </div>

      <div className="w-full md:w-[40%] lg:w-[35%] bg-black flex flex-col items-center justify-center p-8 md:p-12 z-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="relative max-w-sm text-center md:text-left space-y-8 md:space-y-12">
          <div className="flex flex-col items-center md:items-start gap-3 opacity-0 animate-cinematic-fade" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 text-purple-400/80">
                <Wind className="w-3 h-3" />
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase">The Uphill Battle</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[0.9]">
               Dreams <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-pink-500">
                 Vs. Everyone
               </span>
              </h2>
          </div>

          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-neutral-700 to-transparent mx-auto md:mx-0 opacity-0 animate-cinematic-grow" style={{ animationDelay: '0.5s' }} />

          <p className="text-sm md:text-base font-light leading-relaxed text-neutral-400 opacity-0 animate-cinematic-up font-serif italic" style={{ animationDelay: '0.8s' }}>
            &quot;They told him to be realistic. They told him to follow the path. But the vision was too clear to ignore. Standing alone against the tide, it&apos;s not just about proving them wrong—it&apos;s about proving yourself right.&quot;
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 opacity-0 animate-cinematic-fade" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center gap-2 text-neutral-700">
                <Sunrise className="w-3 h-3" />
                <span className="text-[9px] tracking-widest uppercase font-bold">Inner Light</span>
            </div>
              <div className="w-1 h-1 bg-neutral-800 rounded-full" />
              <span className="text-[9px] text-neutral-700 tracking-widest uppercase font-bold">Resilience</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-slow {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cinematic-up {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes cinematic-fade {
          0% { opacity: 0; filter: blur(2px); }
          100% { opacity: 1; filter: blur(0); }
        }
        @keyframes cinematic-grow {
          0% { opacity: 0; height: 0px; }
          100% { opacity: 1; } 
        }
        .animate-fade-in { animation: fade-in-slow 1s ease-out forwards; }
        .animate-cinematic-up { animation: cinematic-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-cinematic-fade { animation: cinematic-fade 2s ease-in-out forwards; }
        .animate-cinematic-grow { animation: cinematic-grow 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>
    </section>
  );
};


// ===========================================================================
// MAIN SHOWCASE COMPONENT (EXPORTS ALL SECTIONS)
// ===========================================================================
export default function CinematicShowcase() {
  const [videoSources, setVideoSources] = useState<Record<string, string>>({});
  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    
    const preloadVideos = async () => {
      // The array of videos we want to download in the background sequentially
      const videosToLoad = [
        { id: 'sec3', url: '/videos/heroone.webm' },
        { id: 'sec4', url: '/videos/herotwo.webm' },
        { id: 'secBombay', url: '/videos/herofour.webm' },
        { id: 'secNature', url: '/videos/herofive.webm' },
        { id: 'secDreams', url: '/videos/herosix.webm' },
      ];

      for (const video of videosToLoad) {
        if (!isMounted) break;
        try {
          // Fetch the video data over the network sequentially
          const response = await fetch(video.url);
          const blob = await response.blob();
          
          // Convert to a local memory URL for instant playback
          const objectUrl = URL.createObjectURL(blob);
          
          if (isMounted) {
            blobUrlsRef.current.push(objectUrl);
            setVideoSources(prev => ({ ...prev, [video.id]: objectUrl }));
          }
        } catch (error) {
          console.error(`Failed to background load ${video.url}`, error);
        }
      }
    };

    preloadVideos();

    return () => {
      isMounted = false;
      // Prevent memory leaks by revoking the blobs when the component unmounts
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <VideoPreloadContext.Provider value={{ videoSources }}>
      <Section3 />
      <Section4 />
      <SectionBombay />
      <SectionNature />
      <SectionDreams />
    </VideoPreloadContext.Provider>
  );
}