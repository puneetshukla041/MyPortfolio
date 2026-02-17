'use client';

import React, { useEffect, useState, useRef, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, FileJson, CheckCircle2, Loader2, 
  Search, GitGraph, Files, Settings, MoreHorizontal, 
  X, Minus, ChevronRight, ChevronDown, 
  Hash, LayoutTemplate, Bug, Menu, AlertCircle, 
  Bell, Split, MoreVertical, Terminal, Download
} from 'lucide-react';

// --- Types & Constants ---
type TabName = 'developer.ts' | 'styles.css' | 'README.md';
type ViewName = 'EXPLORER' | 'SEARCH' | 'SCM' | 'EXTENSIONS' | 'SETTINGS';

const FILES_CONTENT: Record<TabName, string> = {
  'developer.ts': `import { Developer } from "@universe/human";

const puneet: Developer = {
  name: "Puneet Shukla",
  role: "Software Engineer",
  location: "India",
  
  skills: {
    languages: ["TypeScript", "JavaScript", "Python", "SQL"],
    frameworks: ["Next.js", "React", "Node.js", "Tailwind"],
    tools: ["Git", "Docker", "AWS", "Figma"]
  },

  hardWorker: true,
  problemSolver: true,

  hire: () => {
    return "Ready to build the future.";
  }
};

export default puneet;`,
  
  'styles.css': `:root {
  --primary: #007acc;
  --bg: #1e1e1e;
}

.career-path {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.success-rate {
  width: 100%;
  height: 100%;
  content: "100%";
}`,

  'README.md': `# Portfolio v2.0

## Status
Current Status: **Open to Work**
Location: Remote / Hybrid

## Objectives
1. Build scalable web applications.
2. Design intuitive user interfaces.
3. Optimize backend performance.

## Usage
Run the build command to see the magic happen.`
};

// --- Sub-Components ---

const Tooltip = memo(({ text, children }: { text: string, children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center justify-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 5 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="hidden md:block absolute left-14 px-2 py-1 bg-[#252526] text-[#cccccc] text-[11px] border border-white/10 shadow-xl z-50 whitespace-nowrap pointer-events-none rounded-md"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
Tooltip.displayName = 'Tooltip';

const CodeRenderer = memo(({ code, lang }: { code: string, lang: string }) => {
    const lines = useMemo(() => code.split('\n'), [code]);

    return (
      <div className="font-mono text-[11px] sm:text-[13px] md:text-[14px] leading-relaxed whitespace-pre font-medium min-w-max will-change-contents pb-8">
        {lines.map((line, i) => (
          <div key={i} className="table-row group">
             <span className="table-cell text-right pr-3 sm:pr-4 md:pr-6 text-[#6e7681] select-none w-6 sm:w-8 md:w-10 text-[10px] sm:text-[12px] md:text-[13px] group-hover:text-[#c6c6c6] transition-colors">{i + 1}</span>
             <span className="table-cell pr-4">
               {line.split(/(\s+|[{}()[\],:;'"=])/g).map((token, j) => {
                 let color = "#d4d4d4";
                 if (lang === 'ts') {
                   if (['import', 'from', 'const', 'export', 'default', 'return', 'true', 'false'].includes(token)) color = "#569cd6";
                   else if (['Developer', 'String', 'Array', 'puneet'].includes(token)) color = "#4ec9b0";
                   else if (token.startsWith('"') || token.startsWith("'")) color = "#ce9178";
                   else if (!isNaN(Number(token))) color = "#b5cea8";
                   else if (token.match(/^[A-Z]/)) color = "#4ec9b0";
                   else if (line.includes(':') && !line.includes('import') && token !== ':' && token.trim() !== '') {
                     if(line.split(':')[0].includes(token)) color = "#9cdcfe";
                   }
                 } else if (lang === 'css') {
                   if (token.startsWith('.')) color = "#d7ba7d";
                   else if (token.startsWith('#')) color = "#d7ba7d";
                   else if (token.includes(':')) color = "#9cdcfe"; 
                   else if (['flex', 'column', 'center', 'all'].includes(token)) color = "#ce9178"; 
                   else if (token.match(/[0-9]/)) color = "#b5cea8";
                 } else if (lang === 'md') {
                   if (token.startsWith('#')) color = "#569cd6";
                   else if (token.startsWith('**')) color = "#ce9178";
                 }
                 return <span key={j} style={{ color }}>{token}</span>;
               })}
             </span>
          </div>
        ))}
      </div>
    );
});
CodeRenderer.displayName = 'CodeRenderer';

const ActiveCodeWindow = memo(({ activeTab, onTypingComplete, isRunning }: { activeTab: TabName, onTypingComplete: () => void, isRunning: boolean }) => {
  const [typedCode, setTypedCode] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (activeTab === 'developer.ts') {
      setTypedCode('');
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'developer.ts' && isTyping && !isRunning) {
      let i = 0;
      const code = FILES_CONTENT['developer.ts'];
      const interval = setInterval(() => {
        setTypedCode(code.substring(0, i + 3));
        i += 3;
        if (i > code.length) {
          clearInterval(interval);
          setIsTyping(false);
          setTimeout(() => {
            onTypingComplete(); 
          }, 300); 
        }
      }, 5); 
      return () => clearInterval(interval);
    }
  }, [activeTab, isTyping, isRunning, onTypingComplete]);

  const displayCode = (activeTab === 'developer.ts' && isTyping) ? typedCode : FILES_CONTENT[activeTab];

  return (
    <div className="min-h-full h-full overflow-x-auto overflow-y-auto w-full no-scrollbar pb-10">
      <CodeRenderer code={displayCode} lang={activeTab.split('.')[1]} />
    </div>
  );
});
ActiveCodeWindow.displayName = 'ActiveCodeWindow';

const Section1 = () => {
  const [activeTab, setActiveTab] = useState<TabName>('developer.ts');
  const [openTabs, setOpenTabs] = useState<TabName[]>(['developer.ts', 'styles.css', 'README.md']);
  const [activeView, setActiveView] = useState<ViewName>('EXPLORER');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTabClick = useCallback((tab: TabName) => {
    setOpenTabs(prev => prev.includes(tab) ? prev : [...prev, tab]);
    setActiveTab(tab);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  const handleCloseTab = useCallback((e: React.MouseEvent, tab: TabName) => {
    e.stopPropagation();
    setOpenTabs(prev => {
      const newTabs = prev.filter(t => t !== tab);
      if (activeTab === tab && newTabs.length > 0) setActiveTab(newTabs[newTabs.length - 1]);
      return newTabs;
    });
  }, [activeTab]);

  const handleRunCode = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    setShowToast(false);
    setIsTerminalOpen(true);
    setBuildStep(1);
    setTerminalLogs([]);
    
    const steps = [
      { msg: "> pnpm run build", delay: 100 }, 
      { msg: "wait  - compiling...", delay: 300 },
      { msg: "event - compiled client and server successfully in 841 ms", delay: 600, color: '#4ec9b0' },
      { msg: "info  - Collecting page data...", delay: 900 },
      { msg: "info  - Generating static pages (3/3)", delay: 1200 },
      { msg: "info  - Finalizing page optimization...", delay: 1500 },
      { msg: "✓ Build complete. Ready for production.", delay: 1800, success: true, color: '#4ec9b0' },
    ];
    
    let cumulativeDelay = 0;
    steps.forEach((step) => {
        cumulativeDelay = step.delay;
        setTimeout(() => {
            setTerminalLogs(prev => [...prev, step.msg]);
            if (step.success) {
                setBuildStep(2);
                setIsRunning(false);
            }
        }, cumulativeDelay);
    });
  }, [isRunning]);

  const handleTypingComplete = useCallback(() => { handleRunCode(); }, [handleRunCode]);

  const handleDeploymentAction = () => {
    const link = document.createElement('a');
    link.href = '/Puneet Shukla Resume.pdf';
    link.download = 'Puneet_Shukla_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const nextSection = document.getElementById('section2');
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
    else window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false); 
      else setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderSidebarContent = () => {
    switch (activeView) {
      case 'EXPLORER':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <div className="px-3 sm:px-5 py-3 text-[10px] sm:text-[11px] tracking-wide text-[#bbbbbb] flex justify-between items-center bg-transparent select-none cursor-pointer">
              EXPLORER <MoreHorizontal size={14} className="cursor-pointer" />
            </div>
            <div className="flex flex-col">
              <div className="px-1 py-1 flex items-center gap-1 text-[#cccccc] font-bold cursor-pointer hover:bg-white/5 transition-colors">
                <ChevronDown size={14} /> <span className="text-[10px] sm:text-[11px] font-bold">PORTFOLIO</span>
              </div>
              {Object.keys(FILES_CONTENT).map((file) => (
                <div key={file} onClick={() => handleTabClick(file as TabName)}
                  className={`pl-3 sm:pl-5 py-1.5 flex items-center gap-2 cursor-pointer transition-colors text-[12px] sm:text-[13px] border-l-[3px]
                    ${activeTab === file ? 'bg-white/10 text-white border-[#007acc]' : 'border-transparent text-[#cccccc] hover:bg-white/5 hover:text-white'}`}
                >
                   {file.endsWith('ts') && <FileJson size={14} className="text-[#3178c6] shrink-0" />}
                   {file.endsWith('css') && <Hash size={14} className="text-[#569cd6] shrink-0" />}
                   {file.endsWith('md') && <LayoutTemplate size={14} className="text-[#cccccc] shrink-0" />}
                   <span className="truncate">{file}</span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'SEARCH':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
             <div className="px-3 sm:px-5 py-3 text-[10px] sm:text-[11px] tracking-wide text-[#bbbbbb]">SEARCH</div>
             <div className="px-3 sm:px-4 mb-4">
               <div className="bg-neutral-900 flex items-center px-2 py-1.5 rounded-sm border border-transparent focus-within:border-[#007acc] ring-1 ring-transparent focus-within:ring-[#007acc]">
                 <input type="text" placeholder="Search" 
                   className="bg-transparent border-none outline-none text-white w-full text-[12px] sm:text-[13px] placeholder:text-[#858585]"
                   value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
             </div>
             {searchQuery && (
               <div className="px-3 sm:px-4 text-[11px] sm:text-xs text-[#cccccc]">
                 {Object.entries(FILES_CONTENT).map(([name, content]) => (
                    content.toLowerCase().includes(searchQuery.toLowerCase()) && (
                      <div key={name} className="mb-3 cursor-pointer group" onClick={() => handleTabClick(name as TabName)}>
                        <div className="flex items-center gap-1.5 font-bold group-hover:text-white"><ChevronRight size={12}/> {name}</div>
                        <div className="pl-5 text-[#858585] truncate opacity-70 group-hover:opacity-100 mt-0.5">...</div>
                      </div>
                    )
                 ))}
               </div>
             )}
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <section className="relative w-full h-[100dvh] bg-neutral-950 text-[#cccccc] flex overflow-hidden font-sans selection:bg-[#264f78] selection:text-white z-10 [mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)]">
      
      {/* 1. ACTIVITY BAR (Hidden on Mobile) */}
      <div className="hidden md:flex flex-col w-12 bg-transparent border-r border-white/10 items-center py-3 gap-2 z-30 select-none shrink-0">
        {['EXPLORER', 'SEARCH', 'SCM', 'EXTENSIONS'].map((view) => (
            <Tooltip key={view} text={view}>
                <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 border-l-2 ${activeView === view && isSidebarOpen ? 'border-white' : 'border-transparent'}`}
                >
                    {view === 'EXPLORER' && <Files size={24} strokeWidth={1.5} className={`cursor-pointer ${activeView === view ? 'text-white' : 'text-[#858585] hover:text-white'}`} onClick={() => { setActiveView('EXPLORER'); setIsSidebarOpen(true); }} />}
                    {view === 'SEARCH' && <Search size={24} strokeWidth={1.5} className={`cursor-pointer ${activeView === view ? 'text-white' : 'text-[#858585] hover:text-white'}`} onClick={() => { setActiveView('SEARCH'); setIsSidebarOpen(true); }} />}
                    {view === 'SCM' && <GitGraph size={24} strokeWidth={1.5} className={`cursor-pointer ${activeView === view ? 'text-white' : 'text-[#858585] hover:text-white'}`} onClick={() => { setActiveView('SCM'); setIsSidebarOpen(true); }} />}
                    {view === 'EXTENSIONS' && <Bug size={24} strokeWidth={1.5} className={`cursor-pointer ${activeView === view ? 'text-white' : 'text-[#858585] hover:text-white'}`} onClick={() => { setActiveView('EXTENSIONS'); setIsSidebarOpen(true); }} />}
                </motion.div>
            </Tooltip>
        ))}
        <div className="mt-auto flex flex-col gap-4 mb-2">
          <motion.div whileHover={{ scale: 1.1 }} className="p-2 cursor-pointer"><div className="w-6 h-6 rounded-full bg-[#007acc] text-white text-[10px] flex items-center justify-center font-bold">PS</div></motion.div>
          <motion.div whileHover={{ scale: 1.1, rotate: 45 }} className="p-2 cursor-pointer"><Settings size={24} strokeWidth={1.5} className="text-[#858585] hover:text-white" /></motion.div>
        </div>
      </div>

      {/* 2. SIDEBAR PANEL (Drawer on mobile, Flex item on Desktop) */}
      <motion.div 
        initial={false}
        animate={{ 
            width: isSidebarOpen ? (isMobile ? '80%' : 260) : 0, 
            x: isSidebarOpen ? 0 : (isMobile ? '-100%' : 0) 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`flex flex-col bg-neutral-950 border-r border-white/10 overflow-hidden whitespace-nowrap z-50 h-full shrink-0 ${isMobile ? 'absolute top-0 left-0 shadow-2xl max-w-[300px]' : 'relative'}`}
      >
        {/* Mobile Sidebar Header */}
        {isMobile && (
            <div className="flex justify-between items-center p-4 border-b border-white/10">
                <span className="text-[11px] font-bold text-[#858585]">MENU</span>
                <X size={18} className="text-[#858585] cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
            </div>
        )}
        {renderSidebarContent()}
      </motion.div>
      
      {/* Mobile Overlay Overlay */}
      {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-40 cursor-pointer backdrop-blur-sm" 
            onClick={() => setIsSidebarOpen(false)} 
          />
      )}

      {/* 3. MAIN EDITOR AREA */}
      <div className="flex-1 flex flex-col h-full relative bg-transparent z-10 min-w-0">
        
        {/* TABS BAR */}
        <div className="flex bg-neutral-900/50 h-10 sm:h-9 items-center border-b border-white/10 select-none w-full overflow-hidden shrink-0">
           <div className="md:hidden px-4 h-full flex items-center justify-center text-[#858585] hover:text-white cursor-pointer transition-colors" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
               <Menu size={18} />
           </div>
           
           <div className="flex flex-1 overflow-x-auto no-scrollbar h-full">
             <AnimatePresence initial={false}>
               {openTabs.map((tabName) => (
                 <motion.div key={tabName} onClick={() => handleTabClick(tabName)}
                   initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                   transition={{ duration: 0.15 }}
                   className={`group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 h-full text-[11px] sm:text-[13px] cursor-pointer border-r border-white/10 min-w-fit transition-colors relative overflow-hidden ${activeTab === tabName ? 'bg-white/10 text-white' : 'bg-transparent text-[#858585] hover:bg-white/5'}`}
                 >
                    {tabName === 'developer.ts' && <FileJson size={14} className="text-[#3178c6] shrink-0" />}
                    {tabName === 'styles.css' && <Hash size={14} className="text-[#569cd6] shrink-0" />}
                    {tabName === 'README.md' && <LayoutTemplate size={14} className="text-[#cccccc] shrink-0" />}
                    <span className="truncate">{tabName}</span>
                    <motion.span whileHover={{ scale: 1.2 }} className="flex items-center ml-1 sm:ml-2">
                        <X size={14} className={`rounded-sm p-[1px] hover:bg-white/10 cursor-pointer ${activeTab === tabName ? 'block' : 'hidden group-hover:block'}`} onClick={(e) => handleCloseTab(e, tabName)} />
                    </motion.span>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
           
           <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 h-full bg-transparent border-l border-white/10">
             <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex items-center justify-center w-7 h-7 sm:w-6 sm:h-6 rounded hover:bg-white/10 cursor-pointer" onClick={handleRunCode}>
                {isRunning ? <Loader2 size={14} className="animate-spin text-white" /> : <Play size={14} className="text-[#cccccc]" />}
             </motion.div>
             <div className="hidden sm:flex gap-3">
                 <Split size={14} className="text-[#cccccc] cursor-pointer hover:text-white" />
                 <MoreVertical size={14} className="text-[#cccccc] cursor-pointer hover:text-white" />
             </div>
           </div>
        </div>

        {/* BREADCRUMBS */}
        <div className="flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-0.5 text-[10px] sm:text-[11px] text-[#858585] bg-transparent border-b border-white/5 overflow-x-auto no-scrollbar whitespace-nowrap shrink-0">
           <span>portfolio</span> <ChevronRight size={10} className="shrink-0"/> <span>src</span> <ChevronRight size={10} className="shrink-0"/> <span className="text-white/80">{activeTab}</span>
        </div>

        {/* EDITOR CONTENT */}
        <div className="flex-1 relative flex overflow-hidden bg-transparent">
          <div className="flex-1 pt-2 sm:pt-4 pl-0 w-full h-full">
            <ActiveCodeWindow activeTab={activeTab} onTypingComplete={handleTypingComplete} isRunning={isRunning} />
          </div>
          <div className="hidden lg:block w-16 bg-white/5 overflow-hidden opacity-30 select-none pointer-events-none absolute right-0 top-0 bottom-0 border-l border-white/5">
              <div className="transform scale-[0.1] origin-top-left p-2"><pre className="text-white">{FILES_CONTENT[activeTab]}</pre></div>
          </div>
        </div>

        {/* NOTIFICATIONS & TERMINAL */}
        <AnimatePresence>
          {showToast && (
            <motion.div 
              initial={{ x: 50, opacity: 0, scale: 0.9 }} 
              animate={{ x: 0, opacity: 1, scale: 1 }} 
              exit={{ x: 50, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute bottom-6 md:bottom-12 right-4 md:right-6 z-50 bg-[#252526] border border-white/10 shadow-2xl rounded-lg w-[280px] md:w-[320px] overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 py-2 bg-neutral-900 border-b border-white/10">
                 <span className="text-[10px] md:text-[11px] font-bold text-white flex items-center gap-2"><Terminal size={12} className="text-[#007acc]" /> Build Config</span>
                 <X size={12} className="cursor-pointer text-[#858585] hover:text-white" onClick={() => setShowToast(false)}/>
              </div>
              <div className="p-3 text-[11px] md:text-[12px] text-[#cccccc]">
                 <p className="mb-3">Run build task?</p>
                 <div className="flex gap-2">
                   <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRunCode} className="bg-[#007acc] text-white px-3 py-1.5 rounded-md text-[10px] md:text-[11px] cursor-pointer shadow-lg">Run</motion.button>
                   <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowToast(false)} className="bg-[#3c3c3c] text-white px-3 py-1.5 rounded-md text-[10px] md:text-[11px] cursor-pointer shadow-lg border border-white/10">Dismiss</motion.button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {buildStep === 2 && (
             <motion.div 
               initial={{ y: 50, opacity: 0, scale: 0.9 }} 
               animate={{ y: 0, opacity: 1, scale: 1 }} 
               exit={{ y: 20, opacity: 0, scale: 0.9 }}
               transition={{ type: "spring", stiffness: 300, damping: 20 }}
               className="absolute bottom-6 md:bottom-12 left-4 right-4 md:left-auto md:right-6 z-50 flex justify-center md:justify-end"
             >
                <motion.button 
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeploymentAction} 
                  className="bg-[#007acc] text-white px-4 md:px-6 py-3 rounded-lg shadow-xl flex items-center justify-center gap-2 text-[11px] md:text-xs font-bold tracking-wide hover:bg-[#006bb3] cursor-pointer border border-white/5 transition-all w-full md:w-auto"
                >
                  <Download size={14} strokeWidth={2.5} /> Deployment Complete. Download Resume.
                </motion.button>
             </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTerminalOpen && (
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} 
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 h-[45vh] md:h-[300px] bg-[#1e1e1e] border-t border-white/10 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="flex items-center px-4 gap-4 md:gap-6 text-[10px] md:text-[11px] font-bold text-[#858585] border-b border-white/5 h-9 select-none shrink-0 bg-[#181818]">
                 <span className="text-white border-b border-[#007acc] h-full flex items-center cursor-pointer px-1">TERMINAL</span>
                 <span className="h-full flex items-center cursor-pointer px-1 hover:text-[#cccccc] hidden sm:flex">OUTPUT</span>
                 <span className="h-full flex items-center cursor-pointer px-1 hover:text-[#cccccc] hidden sm:flex">DEBUG CONSOLE</span>
                 
                 <div className="ml-auto flex gap-4 items-center">
                    <Minus size={14} onClick={() => setIsTerminalOpen(false)} className="cursor-pointer hover:text-white transition-colors"/>
                    <X size={14} onClick={() => setIsTerminalOpen(false)} className="cursor-pointer hover:text-white transition-colors"/>
                 </div>
              </div>
              <div ref={scrollRef} className="p-3 md:p-4 font-mono text-[10px] sm:text-[11px] md:text-[12px] flex-1 overflow-y-auto custom-scrollbar">
                 <div className="text-[#858585] mb-3 select-none">Microsoft Windows [Version 10.0.19045] <br/> (c) Microsoft Corporation. All rights reserved.</div>
                 {terminalLogs.map((log, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -5 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className={`mt-1 ${log.includes('✓') || log.includes('successfully') ? 'text-[#4ec9b0]' : 'text-[#cccccc]'}`}
                    >
                        {log}
                    </motion.div>
                 ))}
                 {buildStep === 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-[#4ec9b0] font-bold">Done in 1.82s. <span className="text-white animate-pulse font-normal">_</span></motion.div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
export default Section1;