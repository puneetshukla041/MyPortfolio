'use client';

import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, FileJson, CheckCircle2, Loader2, 
  Search, GitGraph, Files, Settings, MoreHorizontal, 
  X, Minus, ChevronRight, ChevronDown, 
  Hash, LayoutTemplate, Bug, Menu, AlertCircle, 
  Bell, Split, MoreVertical, Terminal, Laptop, Maximize2
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

const TrafficLights = memo(() => (
  <div className="flex gap-2 group px-4">
    <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/10 flex items-center justify-center shadow-inner">
      <X size={8} className="text-black/60 opacity-0 group-hover:opacity-100" />
    </div>
    <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/10 flex items-center justify-center shadow-inner">
      <Minus size={8} className="text-black/60 opacity-0 group-hover:opacity-100" />
    </div>
    <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/10 flex items-center justify-center shadow-inner">
      <Maximize2 size={8} className="text-black/60 opacity-0 group-hover:opacity-100" />
    </div>
  </div>
));
TrafficLights.displayName = 'TrafficLights';

const Tooltip = memo(({ text, children }: { text: string, children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center justify-center group" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="hidden md:block absolute left-12 px-2 py-1 bg-[#252526] text-white text-[10px] border border-black/30 shadow-xl z-50 whitespace-nowrap pointer-events-none"
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
      <div className="font-mono text-[13px] md:text-[14px] leading-6 whitespace-pre font-medium min-w-max">
        {lines.map((line, i) => (
          <div key={i} className="table-row group">
             <span className="table-cell text-right pr-6 text-[#858585] select-none w-12 text-[12px]">{i + 1}</span>
             <span className="table-cell">
               {line.split(/(\s+|[{}()[\],:;'"=])/g).map((token, j) => {
                 let color = "#D4D4D4"; 
                 if (lang === 'ts') {
                   if (['import', 'from', 'const', 'export', 'default', 'return', 'true', 'false'].includes(token)) color = "#C586C0"; 
                   else if (['Developer', 'String', 'Array', 'puneet', 'skills'].includes(token)) color = "#4EC9B0"; 
                   else if (token.startsWith('"') || token.startsWith("'")) color = "#CE9178"; 
                   else if (!isNaN(Number(token))) color = "#B5CEA8"; 
                   else if (token.match(/^[A-Z]/)) color = "#4EC9B0"; 
                   else if (token === 'function' || token === '=>') color = "#569CD6"; 
                   else if (line.includes(':') && !line.includes('import') && token !== ':' && token.trim() !== '') {
                     const parts = line.split(':');
                     if(parts[0].includes(token)) color = "#9CDCFE"; 
                   }
                 } else if (lang === 'css') {
                   if (token.startsWith('.')) color = "#D7BA7D"; 
                   else if (token.startsWith('#')) color = "#D7BA7D";
                   else if (token.includes(':')) color = "#9CDCFE"; 
                   else if (['flex', 'column', 'center', 'all'].includes(token)) color = "#CE9178"; 
                 } else if (lang === 'md') {
                   if (token.startsWith('#')) color = "#569CD6";
                   else if (token.startsWith('**')) color = "#CE9178";
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
  const [typedCode, setTypedCode] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [booted, setBooted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setBooted(true), 300);
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false); 
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (activeTab === 'developer.ts' && !isRunning && typedCode.length === 0 && booted) {
      setIsTypingComplete(false);
      let i = 0;
      const code = FILES_CONTENT['developer.ts'];
      const interval = setInterval(() => {
        setTypedCode(code.substring(0, i + 1));
        i++;
        if (i > code.length) {
          clearInterval(interval);
          setIsTypingComplete(true);
          setTimeout(() => setShowToast(true), 800);
        }
      }, 12); 
      return () => clearInterval(interval);
    } else {
        setIsTypingComplete(true);
    }
  }, [activeTab, booted]);

  const handleTabClick = (tab: TabName) => {
    if (!openTabs.includes(tab)) setOpenTabs([...openTabs, tab]);
    setActiveTab(tab);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleCloseTab = (e: React.MouseEvent, tab: TabName) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t !== tab);
    setOpenTabs(newTabs);
    if (activeTab === tab && newTabs.length > 0) setActiveTab(newTabs[newTabs.length - 1]);
  };

  const handleRunCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowToast(false);
    setIsTerminalOpen(true);
    setBuildStep(1);
    setTerminalLogs([]);
    const steps = [
      { msg: "> pnpm run build", delay: 300 },
      { msg: "wait  - compiling production build...", delay: 1000 },
      { msg: "event - compiled client and server successfully", delay: 1800, color: '#4ec9b0' },
      { msg: "info  - Generating static pages...", delay: 2400 },
      { msg: "✓ Build complete. Ready for production.", delay: 3200, success: true, color: '#4ec9b0' },
    ];
    steps.forEach((step) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, step.msg]);
        if (step.success) { setBuildStep(2); setIsRunning(false); }
      }, step.delay);
    });
  };

  const renderSidebarContent = () => {
    switch (activeView) {
      case 'EXPLORER':
        return (
          <div className="flex flex-col select-none">
            <div className="px-5 py-3 text-[11px] font-bold tracking-wider text-[#bbbbbb] flex justify-between items-center bg-[#252526]">
              EXPLORER <MoreHorizontal size={14} className="cursor-pointer" />
            </div>
            <div className="px-1 py-1 flex items-center gap-1 text-[#cccccc] font-bold cursor-pointer hover:bg-[#2a2d2e]">
              <ChevronDown size={14} /> <span className="text-[11px] font-bold uppercase tracking-tight">puneet-portfolio</span>
            </div>
            {Object.keys(FILES_CONTENT).map((file) => (
              <div 
                key={file}
                onClick={() => handleTabClick(file as TabName)}
                className={`pl-5 py-1 flex items-center gap-1.5 cursor-pointer text-[13px] border-l-[2px] transition-colors
                  ${activeTab === file ? 'bg-[#37373d] text-white border-[#007acc]' : 'border-transparent text-[#cccccc] hover:bg-[#2a2d2e]'}`}
              >
                 {file.endsWith('ts') && <FileJson size={14} className="text-[#3178c6]" />}
                 {file.endsWith('css') && <Hash size={14} className="text-[#569cd6]" />}
                 {file.endsWith('md') && <LayoutTemplate size={14} className="text-[#cccccc]" />}
                 <span>{file}</span>
              </div>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <section className="relative w-full h-screen bg-[#f3f4f6] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #e5e7eb 100%)' }}
    >
      {/* --- STATIONARY MONITOR ASSEMBLY --- */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center relative"
      >
        {/* BEZEL (Main Frame) */}
        <div className="w-[92vw] h-[58vw] md:w-[1000px] md:h-[640px] bg-black rounded-[28px] p-[14px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] relative z-20 border border-white/5">
          {/* Camera Dot */}
          <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a1a1a] rounded-full z-30 ring-1 ring-white/5" />

          {/* SCREEN CONTENT */}
          <div className={`w-full h-full bg-[#1e1e1e] rounded-[16px] overflow-hidden relative z-10 transition-opacity duration-500 ${booted ? 'opacity-100' : 'opacity-0'}`}>
            {/* GLARE OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none z-50" />
            
            {/* === VS CODE UI === */}
            <div className="flex flex-col h-full w-full font-sans">
              {/* Title Bar */}
              <div className="h-10 bg-[#323233] flex items-center justify-between relative select-none border-b border-black/20 shrink-0 px-4">
                <div className="flex items-center">
                   <TrafficLights />
                </div>
                <span className="text-[12px] text-[#999] font-medium opacity-80 flex items-center gap-2">
                   <Laptop size={12} /> puneet-portfolio — VS Code
                </span>
                <div className="w-20" /> {/* Spacer for symmetry */}
              </div>

              {/* Main Workspace */}
              <div className="flex-1 flex overflow-hidden">
                {/* Activity Bar */}
                <div className="hidden md:flex flex-col w-12 bg-[#333333] items-center py-4 gap-4 border-r border-black/20">
                  <Files size={24} strokeWidth={1.5} className="text-white opacity-90 cursor-pointer" />
                  <Search size={24} strokeWidth={1.5} className="text-[#858585] hover:text-white cursor-pointer" />
                  <GitGraph size={24} strokeWidth={1.5} className="text-[#858585] hover:text-white cursor-pointer" />
                  <div className="mt-auto flex flex-col gap-4 mb-2">
                    <div className="w-7 h-7 rounded-full bg-[#007acc] text-white text-[11px] flex items-center justify-center font-bold">PS</div>
                    <Settings size={24} strokeWidth={1.5} className="text-[#858585] hover:text-white cursor-pointer" />
                  </div>
                </div>

                {/* Sidebar */}
                <motion.div 
                  initial={false}
                  animate={{ width: isSidebarOpen ? (isMobile ? 220 : 250) : 0 }}
                  className="bg-[#252526] border-r border-black/20 overflow-hidden"
                >
                  {renderSidebarContent()}
                </motion.div>

                {/* Editor Container */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
                  {/* Tabs Bar */}
                  <div className="flex bg-[#252526] h-10 items-center overflow-x-auto no-scrollbar border-b border-black/10">
                    {openTabs.map((tabName) => (
                      <div 
                        key={tabName}
                        onClick={() => handleTabClick(tabName)}
                        className={`group flex items-center gap-2 px-4 h-full text-[13px] cursor-pointer border-r border-black/10 transition-colors
                          ${activeTab === tabName ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]' : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#2a2d2e]'}`}
                      >
                         {tabName === 'developer.ts' && <FileJson size={14} className="text-[#3178c6]" />}
                         {tabName === 'styles.css' && <Hash size={14} className="text-[#569cd6]" />}
                         {tabName === 'README.md' && <LayoutTemplate size={14} className="text-[#cccccc]" />}
                         <span>{tabName}</span>
                         <X size={14} className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-[#444] rounded" onClick={(e) => handleCloseTab(e, tabName)} />
                      </div>
                    ))}
                    
                    {/* Inline Run Button */}
                    <div className="ml-auto px-4">
                       <button onClick={handleRunCode} className="text-[#858585] hover:text-white transition-colors">
                          {isRunning ? <Loader2 size={16} className="animate-spin text-[#007acc]" /> : <Play size={16} fill="currentColor" />}
                       </button>
                    </div>
                  </div>

                  {/* Code Area */}
                  <div className="flex-1 overflow-auto custom-scrollbar p-6">
                    <motion.div
                      key={activeTab} 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}
                    >
                      <CodeRenderer 
                        code={activeTab === 'developer.ts' ? (isTypingComplete ? FILES_CONTENT['developer.ts'] : typedCode) : FILES_CONTENT[activeTab]} 
                        lang={activeTab.split('.')[1]} 
                      />
                    </motion.div>
                  </div>

                  {/* Terminal Drawer */}
                  <AnimatePresence>
                    {isTerminalOpen && (
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: 200 }} exit={{ height: 0 }}
                        className="bg-[#1e1e1e] border-t border-black/40 shadow-inner overflow-hidden"
                      >
                        <div className="flex items-center px-4 h-9 bg-[#1e1e1e] border-b border-white/5 text-[11px] font-bold text-[#969696] uppercase tracking-wide">
                           <span className="text-white border-b border-white h-full flex items-center">Terminal</span>
                           <div className="ml-auto"><X size={14} className="cursor-pointer" onClick={() => setIsTerminalOpen(false)} /></div>
                        </div>
                        <div className="p-4 font-mono text-[12px] h-[calc(100%-36px)] overflow-y-auto">
                           {terminalLogs.map((log, i) => (
                              <div key={i} className="mb-1">{log.startsWith('>') ? <span className="text-[#dcdcaa]">{log}</span> : <span className="text-[#cccccc]">{log}</span>}</div>
                           ))}
                           {buildStep === 2 && <div className="text-green-400 mt-2 font-bold animate-pulse">✓ Done. Site is live.</div>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Status Bar */}
                  <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-[11px] justify-between">
                     <div className="flex items-center gap-3">
                       <span className="flex items-center gap-1"><GitGraph size={12}/> main*</span>
                       <span className="flex items-center gap-1"><AlertCircle size={12}/> 0</span>
                     </div>
                     <div className="flex items-center gap-4">
                       <span>UTF-8</span>
                       <span>TypeScript JSX</span>
                       <CheckCircle2 size={12}/>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- ALUMINUM STAND --- */}
        <div className="flex flex-col items-center relative z-10 -mt-2">
           {/* Neck with Aluminum Shading */}
           <div className="w-[160px] h-[80px] bg-gradient-to-b from-[#e2e8f0] to-[#94a3b8] shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]" 
                style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0% 100%)' }} />
           {/* Heavy Solid Base */}
           <div className="w-[280px] h-[12px] bg-[#cbd5e1] rounded-t-sm rounded-b-md shadow-lg border-t border-white/40" />
           {/* Ground Contact Shadow */}
           <div className="w-[320px] h-[8px] bg-black/10 blur-md mt-1 rounded-[100%]" />
        </div>
      </motion.div>
      
      {/* View Site Action Button */}
      <AnimatePresence>
        {buildStep === 2 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-8 z-30">
            <button onClick={handleScrollDown} className="px-8 py-3 bg-black text-white rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
              Explore Portfolio Site
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Section1;