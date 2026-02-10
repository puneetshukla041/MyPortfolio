'use client';

import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, FileJson, CheckCircle2, Loader2, 
  Search, GitGraph, Files, Settings, MoreHorizontal, 
  X, Minus, ChevronRight, ChevronDown, 
  Hash, LayoutTemplate, Bug, Menu, AlertCircle, 
  Bell, Split, MoreVertical, Terminal
} from 'lucide-react';

// --- Types & Constants ---
type TabName = 'developer.ts' | 'styles.css' | 'README.md';
type ViewName = 'EXPLORER' | 'SEARCH' | 'SCM' | 'EXTENSIONS' | 'SETTINGS';

// OPTIMIZATION: Moved outside component to prevent recreation on re-renders
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

// OPTIMIZATION: Memoized Tooltip
const Tooltip = memo(({ text, children }: { text: string, children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center justify-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div 
            // APPLE STYLE: Snappy spring pop-in
            initial={{ opacity: 0, scale: 0.85, x: 10 }} 
            animate={{ opacity: 1, scale: 1, x: 0 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
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

// OPTIMIZATION: Memoized Syntax Highlighter
const CodeRenderer = memo(({ code, lang }: { code: string, lang: string }) => {
    const lines = useMemo(() => code.split('\n'), [code]);

    return (
      <div className="font-mono text-[13px] md:text-[14px] leading-relaxed whitespace-pre font-medium min-w-max will-change-contents">
        {lines.map((line, i) => (
          <div key={i} className="table-row group">
             <span className="table-cell text-right pr-4 md:pr-6 text-[#6e7681] select-none w-8 md:w-10 text-[12px] md:text-[13px] group-hover:text-[#c6c6c6] transition-colors">{i + 1}</span>
             <span className="table-cell">
               {line.split(/(\s+|[{}()[\],:;'"=])/g).map((token, j) => {
                 let color = "#d4d4d4";
                 if (lang === 'ts') {
                   if (['import', 'from', 'const', 'export', 'default', 'return', 'true', 'false'].includes(token)) color = "#569cd6";
                   else if (['Developer', 'String', 'Array', 'puneet'].includes(token)) color = "#4ec9b0";
                   else if (token.startsWith('"') || token.startsWith("'")) color = "#ce9178";
                   else if (!isNaN(Number(token))) color = "#b5cea8";
                   else if (token.match(/^[A-Z]/)) color = "#4ec9b0";
                   else if (line.includes(':') && !line.includes('import') && token !== ':' && token.trim() !== '') {
                     const parts = line.split(':');
                     if(parts[0].includes(token)) color = "#9cdcfe";
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

const Section1 = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<TabName>('developer.ts');
  const [openTabs, setOpenTabs] = useState<TabName[]>(['developer.ts', 'styles.css', 'README.md']);
  const [activeView, setActiveView] = useState<ViewName>('EXPLORER');
  
  // Responsive Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Terminal & Execution State
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [showToast, setShowToast] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editor State
  const [typedCode, setTypedCode] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Effects ---

  // Detect Mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false); 
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setUnsavedChanges(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // OPTIMIZATION: Improved Typing Effect
  useEffect(() => {
    if (activeTab === 'developer.ts' && !isRunning && typedCode.length === 0) {
      setIsTypingComplete(false);
      let i = 0;
      const code = FILES_CONTENT['developer.ts'];
      
      const interval = setInterval(() => {
        setTypedCode(code.substring(0, i + 1));
        i++;
        
        if (i > code.length) {
          clearInterval(interval);
          setIsTypingComplete(true);
          setTimeout(() => {
            setBuildStep(prev => prev === 0 ? prev : prev); 
            setShowToast(true);
          }, 800);
        }
      }, 12); 
      return () => clearInterval(interval);
    } else {
        setIsTypingComplete(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // --- Handlers ---
  const handleTabClick = (tab: TabName) => {
    if (!openTabs.includes(tab)) setOpenTabs([...openTabs, tab]);
    setActiveTab(tab);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleCloseTab = (e: React.MouseEvent, tab: TabName) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t !== tab);
    setOpenTabs(newTabs);
    if (activeTab === tab && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1]);
    }
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
      { msg: "wait  - compiling...", delay: 1000 },
      { msg: "event - compiled client and server successfully in 1241 ms", delay: 1800, color: '#4ec9b0' },
      { msg: "info  - Collecting page data...", delay: 2400 },
      { msg: "info  - Generating static pages (3/3)", delay: 3200 },
      { msg: "info  - Finalizing page optimization...", delay: 4000 },
      { msg: "✓ Build complete. Ready for production.", delay: 4800, success: true, color: '#4ec9b0' },
    ];
    steps.forEach((step) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, step.msg]);
        if (step.success) { setBuildStep(2); setIsRunning(false); }
      }, step.delay);
    });
  };

  const handleScrollDown = () => {
    const nextSection = document.getElementById('section2');
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
    else window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  // --- RENDER SIDEBAR CONTENT ---
  const renderSidebarContent = () => {
    switch (activeView) {
      case 'EXPLORER':
        return (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="px-5 py-3 text-[11px] tracking-wide text-[#bbbbbb] flex justify-between items-center bg-transparent select-none cursor-pointer">
              EXPLORER <MoreHorizontal size={14} className="cursor-pointer" />
            </div>
            <div className="flex flex-col mb-1">
               <div className="px-1 py-1 flex items-center gap-1 text-[#cccccc] font-bold cursor-pointer hover:bg-white/5 transition-colors">
                 <ChevronRight size={14} /> <span className="text-[11px] font-bold">OPEN EDITORS</span>
               </div>
            </div>
            <div className="flex flex-col">
              <div className="px-1 py-1 flex items-center gap-1 text-[#cccccc] font-bold cursor-pointer hover:bg-white/5 transition-colors">
                <ChevronDown size={14} /> <span className="text-[11px] font-bold">PORTFOLIO</span>
              </div>
              {Object.keys(FILES_CONTENT).map((file) => (
                <div 
                  key={file}
                  onClick={() => handleTabClick(file as TabName)}
                  className={`pl-5 py-1 flex items-center gap-1.5 cursor-pointer transition-colors text-[13px] border-l-[3px]
                    ${activeTab === file ? 'bg-white/10 text-white border-[#007acc]' : 'border-transparent text-[#cccccc] hover:bg-white/5 hover:text-white'}`}
                >
                   {file.endsWith('ts') && <FileJson size={14} className="text-[#3178c6]" />}
                   {file.endsWith('css') && <Hash size={14} className="text-[#569cd6]" />}
                   {file.endsWith('md') && <LayoutTemplate size={14} className="text-[#cccccc]" />}
                   <span>{file}</span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'SEARCH':
        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
             <div className="px-5 py-3 text-[11px] tracking-wide text-[#bbbbbb] flex justify-between">SEARCH</div>
             <div className="px-4 mb-4">
               <div className="bg-neutral-900 flex items-center px-2 py-1 rounded-sm border border-transparent focus-within:border-[#007acc] ring-1 ring-transparent focus-within:ring-[#007acc]">
                 <input 
                   type="text" 
                   placeholder="Search" 
                   className="bg-transparent border-none outline-none text-white w-full text-[13px] placeholder:text-[#858585]"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <div className="flex gap-1">
                   <span className="text-[10px] text-[#858585] border border-[#555] rounded px-1 cursor-pointer hover:text-white">.*</span>
                 </div>
               </div>
             </div>
             {searchQuery && (
               <div className="px-4 text-xs text-[#cccccc]">
                 {Object.entries(FILES_CONTENT).map(([name, content]) => {
                    const match = content.toLowerCase().includes(searchQuery.toLowerCase());
                    return match ? (
                      <div key={name} className="mb-2 cursor-pointer group" onClick={() => handleTabClick(name as TabName)}>
                        <div className="flex items-center gap-2 font-bold group-hover:text-white">
                          <ChevronRight size={12}/> {name}
                        </div>
                        <div className="pl-6 text-[#858585] truncate opacity-70 group-hover:opacity-100">
                          {content.substring(content.toLowerCase().indexOf(searchQuery.toLowerCase()), content.toLowerCase().indexOf(searchQuery.toLowerCase()) + 30)}...
                        </div>
                      </div>
                    ) : null;
                 })}
               </div>
             )}
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <section className="relative w-full h-screen bg-transparent text-[#cccccc] flex overflow-hidden font-sans selection:bg-[#264f78] selection:text-white z-10 [mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)]">
      
      {/* 1. ACTIVITY BAR (Hidden on Mobile) */}
      <div className="hidden md:flex flex-col w-12 bg-transparent border-r border-white/10 items-center py-3 gap-2 z-30 select-none">
        <Tooltip text="Explorer (Ctrl+Shift+E)">
           <div className={`p-2 border-l-2 ${activeView === 'EXPLORER' && isSidebarOpen ? 'border-white' : 'border-transparent'}`}>
             <Files size={24} strokeWidth={1.5} className={`cursor-pointer transition-colors ${activeView === 'EXPLORER' && isSidebarOpen ? 'text-white' : 'text-[#858585] hover:text-white'}`} onClick={() => { setActiveView('EXPLORER'); setIsSidebarOpen(true); }} />
           </div>
        </Tooltip>
        <Tooltip text="Search (Ctrl+Shift+F)">
           <div className={`p-2 border-l-2 ${activeView === 'SEARCH' && isSidebarOpen ? 'border-white' : 'border-transparent'}`}>
             <Search size={24} strokeWidth={1.5} className={`cursor-pointer transition-colors ${activeView === 'SEARCH' && isSidebarOpen ? 'text-white' : 'text-[#858585] hover:text-white'}`} onClick={() => { setActiveView('SEARCH'); setIsSidebarOpen(true); }} />
           </div>
        </Tooltip>
        <Tooltip text="Source Control (Ctrl+Shift+G)">
           <div className={`p-2 border-l-2 ${activeView === 'SCM' && isSidebarOpen ? 'border-white' : 'border-transparent'}`}>
             <GitGraph size={24} strokeWidth={1.5} className={`cursor-pointer transition-colors ${activeView === 'SCM' && isSidebarOpen ? 'text-white' : 'text-[#858585] hover:text-white'}`} onClick={() => { setActiveView('SCM'); setIsSidebarOpen(true); }} />
           </div>
        </Tooltip>
        <Tooltip text="Extensions (Ctrl+Shift+X)">
           <div className={`p-2 border-l-2 ${activeView === 'EXTENSIONS' && isSidebarOpen ? 'border-white' : 'border-transparent'}`}>
             <Bug size={24} strokeWidth={1.5} className={`cursor-pointer transition-colors ${activeView === 'EXTENSIONS' && isSidebarOpen ? 'text-white' : 'text-[#858585] hover:text-white'}`} onClick={() => { setActiveView('EXTENSIONS'); setIsSidebarOpen(true); }} />
           </div>
        </Tooltip>
        
        <div className="mt-auto flex flex-col gap-4 mb-2">
          <Tooltip text="Accounts">
             <div className="p-2 cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-[#007acc] text-white text-[10px] flex items-center justify-center font-bold">PS</div>
             </div>
          </Tooltip>
          <Tooltip text="Settings">
             <div className="p-2 cursor-pointer">
                <Settings size={24} strokeWidth={1.5} className="text-[#858585] hover:text-white transition-colors" />
             </div>
          </Tooltip>
        </div>
      </div>

      {/* 2. SIDEBAR PANEL (Responsive) */}
      <motion.div 
        initial={false}
        // APPLE STYLE: Smooth physics based expansion
        animate={{ 
          width: isSidebarOpen ? (isMobile ? 240 : 260) : 0, 
          opacity: isSidebarOpen ? 1 : 0 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`flex flex-col bg-neutral-950/90 border-r border-white/10 overflow-hidden whitespace-nowrap z-40 h-full
          ${isMobile ? 'absolute top-0 left-0 shadow-2xl' : 'relative'}
        `}
        style={{ willChange: 'width, opacity' }}
      >
        {renderSidebarContent()}
      </motion.div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 z-30 cursor-pointer" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* 3. MAIN EDITOR AREA */}
      <div className="flex-1 flex flex-col h-full relative bg-transparent z-10 min-w-0">
        
        {/* TABS BAR */}
        <div className="flex bg-transparent h-9 items-center border-b border-white/10 select-none">
           {/* Mobile Hamburger */}
           <div className="md:hidden px-3 h-full flex items-center justify-center text-[#cccccc] cursor-pointer hover:bg-white/10" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
             <Menu size={16} />
           </div>

           {/* Scrollable Tabs */}
           <div className="flex flex-1 overflow-x-auto no-scrollbar h-full">
             <AnimatePresence initial={false}>
               {openTabs.map((tabName) => (
                 <motion.div 
                   key={tabName}
                   onClick={() => setActiveTab(tabName)}
                   // APPLE STYLE: Tabs slide in/out smoothly
                   initial={{ opacity: 0, width: 0 }}
                   animate={{ opacity: 1, width: "auto" }}
                   exit={{ opacity: 0, width: 0 }}
                   transition={{ ease: "easeInOut", duration: 0.2 }}
                   className={`group flex items-center gap-2 px-3 h-full text-[13px] cursor-pointer border-r border-white/10 min-w-fit transition-colors relative overflow-hidden
                     ${activeTab === tabName ? 'bg-white/10 text-white' : 'bg-transparent text-[#999] hover:bg-white/5'}`}
                 >
                    {tabName === 'developer.ts' && <FileJson size={14} className="text-[#3178c6]" />}
                    {tabName === 'styles.css' && <Hash size={14} className="text-[#569cd6]" />}
                    {tabName === 'README.md' && <LayoutTemplate size={14} className="text-[#cccccc]" />}
                    <motion.span layout>{tabName}</motion.span>
                    <X size={14} className={`ml-2 rounded-sm p-[1px] hover:bg-white/10 cursor-pointer ${activeTab === tabName || unsavedChanges ? 'block' : 'hidden group-hover:block'}`} onClick={(e) => handleCloseTab(e, tabName)} />
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
           
           {/* Editor Toolbar */}
           <div className="flex-shrink-0 flex items-center gap-3 px-3 h-full bg-transparent border-l border-white/10">
             <motion.div 
               whileTap={{ scale: 0.9 }}
               className={`flex items-center justify-center w-6 h-6 rounded cursor-pointer transition-all duration-300 ${showToast ? 'bg-[#007acc] shadow-[0_0_10px_rgba(0,122,204,0.8)]' : 'hover:bg-white/10'}`} 
               onClick={handleRunCode}
             >
                {isRunning ? <Loader2 size={14} className="animate-spin text-white" /> : <Play size={14} className={`${showToast ? 'text-white fill-white' : 'text-[#cccccc] fill-[#cccccc]'}`} />}
             </motion.div>
             <div className="hidden sm:flex gap-3">
               <Split size={14} className="text-[#cccccc] hover:bg-white/10 cursor-pointer" />
               <MoreVertical size={14} className="text-[#cccccc] hover:bg-white/10 cursor-pointer" />
             </div>
           </div>
        </div>

        {/* BREADCRUMBS */}
        <div className="flex items-center gap-1 px-4 py-0.5 text-[11px] text-[#666] bg-transparent shadow-sm border-b border-transparent overflow-hidden whitespace-nowrap cursor-default">
           <span>portfolio</span> <ChevronRight size={10} /> <span>src</span> <ChevronRight size={10} /> <span className="text-white/80">{activeTab}</span>
        </div>

        {/* EDITOR CONTENT */}
        <div className="flex-1 relative flex overflow-hidden bg-transparent">
          <div className="flex-1 pt-2 pl-0 overflow-auto custom-scrollbar" onClick={() => { if(!isRunning) setUnsavedChanges(true); }}>
            <motion.div
              key={activeTab} 
              // APPLE STYLE: Cross-dissolve feel
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="min-h-full pb-20 md:pb-0"
            >
              <CodeRenderer 
                code={activeTab === 'developer.ts' ? (isTypingComplete ? FILES_CONTENT['developer.ts'] : typedCode) : FILES_CONTENT[activeTab]} 
                lang={activeTab.split('.')[1]} 
              />
            </motion.div>
          </div>
          
          {/* Minimap (Desktop Only) */}
          <div className="hidden lg:block w-16 bg-white/5 overflow-hidden opacity-50 select-none pointer-events-none absolute right-0 top-0 bottom-0">
              <div className="transform scale-[0.1] origin-top-left p-2">
                 <pre className="text-white">{FILES_CONTENT[activeTab]}</pre>
              </div>
          </div>
        </div>

        {/* --- PROFESSIONAL BUILD NOTIFICATION --- */}
        <AnimatePresence>
          {showToast && (
            <motion.div 
              // APPLE STYLE: Notification "Pop" + Slide in from right with heavy damping
              initial={{ x: 50, opacity: 0, scale: 0.9 }} 
              animate={{ x: 0, opacity: 1, scale: 1 }} 
              exit={{ x: 50, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute bottom-12 right-1/2 translate-x-1/2 md:translate-x-0 md:right-6 z-50 bg-[#252526] border border-white/10 shadow-2xl rounded-lg w-[90%] max-w-[320px] overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 py-2 bg-neutral-900 border-b border-white/10">
                 <span className="text-[11px] font-bold text-white flex items-center gap-2">
                   <Terminal size={12} className="text-[#007acc]" /> Build Configuration
                 </span>
                 <X size={12} className="cursor-pointer hover:text-white text-[#858585]" onClick={() => setShowToast(false)}/>
              </div>
              <div className="p-3 text-[12px] text-[#cccccc]">
                 <p className="mb-3 leading-relaxed">The workspace contains a new configuration. Would you like to run the build task to preview?</p>
                 <div className="flex gap-2">
                   <button 
                     onClick={handleRunCode}
                     className="bg-[#007acc] hover:bg-[#006bb3] text-white px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all shadow-[0_0_10px_rgba(0,122,204,0.3)] cursor-pointer"
                   >
                     Run Build Task
                   </button>
                   <button 
                     onClick={() => setShowToast(false)}
                     className="bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                   >
                     Dismiss
                   </button>
                 </div>
              </div>
              <motion.div 
                 initial={{ width: "100%" }} 
                 animate={{ width: "0%" }} 
                 transition={{ duration: 10, ease: "linear" }}
                 className="h-0.5 bg-[#007acc]"
                 onAnimationComplete={() => setShowToast(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Toast */}
        <AnimatePresence>
          {buildStep === 2 && (
             <motion.div 
               // APPLE STYLE: Spring up from bottom
               initial={{ y: 100, opacity: 0, scale: 0.9 }} 
               animate={{ y: 0, opacity: 1, scale: 1 }}
               exit={{ y: 20, opacity: 0 }}
               transition={{ type: "spring", stiffness: 300, damping: 20 }}
               className="absolute bottom-12 right-6 md:right-6 z-50 w-[90%] md:w-auto left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0"
             >
                <button
                  onClick={handleScrollDown}
                  className="bg-[#007acc] text-white px-4 py-3 md:py-2 rounded-lg shadow-xl flex items-center justify-center gap-2 text-xs font-medium hover:bg-[#006bb3] w-full md:w-auto cursor-pointer"
                >
                  <CheckCircle2 size={14} /> Deployment Complete. Open Preview.
                </button>
             </motion.div>
          )}
        </AnimatePresence>

        {/* TERMINAL PANEL */}
        <AnimatePresence>
          {isTerminalOpen && (
            <motion.div
              // APPLE STYLE: Bottom sheet slide up with physics
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
              className="absolute bottom-0 left-0 right-0 h-[40vh] md:h-[200px] bg-neutral-900 border-t border-white/10 z-30 shadow-2xl"
            >
              <div className="flex items-center px-4 gap-6 text-[11px] font-bold text-[#666] border-b border-white/10 h-8 select-none">
                 <span className="text-white border-b border-white h-full flex items-center cursor-pointer uppercase">Terminal</span>
                 <span className="hidden sm:flex hover:text-white cursor-pointer h-full items-center uppercase">Output</span>
                 <span className="hidden sm:flex hover:text-white cursor-pointer h-full items-center uppercase">Debug Console</span>
                 <div className="ml-auto flex gap-3">
                    <Minus size={14} className="cursor-pointer hover:text-white" onClick={() => setIsTerminalOpen(false)} />
                    <X size={14} className="cursor-pointer hover:text-white" onClick={() => setIsTerminalOpen(false)} />
                 </div>
              </div>
              <div ref={scrollRef} className="p-4 font-mono text-[12px] overflow-y-auto h-[calc(100%-32px)] custom-scrollbar">
                 <div className="text-[#cccccc] mb-2">Microsoft Windows [Version 10.0.19045]</div>
                 {terminalLogs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      // Staggered line entry
                      initial={{ opacity: 0, x: -5 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ duration: 0.2 }}
                      className="mt-0.5 break-words"
                    >
                       {log.startsWith('>') ? <span className="text-[#dcdcaa]">{log}</span> : 
                        log.startsWith('wait') ? <span className="text-white">{log}</span> :
                        log.startsWith('event') ? <span className="text-[#4ec9b0]">{log}</span> :
                        log.startsWith('warn') ? <span className="text-[#cca700]">{log}</span> :
                        <span className="text-[#cccccc]">{log}</span>}
                    </motion.div>
                 ))}
                 {buildStep === 2 && (
                   <motion.div 
                     initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                     className="mt-4 text-[#4ec9b0]"
                   >
                      Done in 4.82s. <span className="text-white animate-pulse">_</span>
                   </motion.div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STATUS BAR REMOVED HERE */}

      </div>
    </section>
  );
};
export default Section1;