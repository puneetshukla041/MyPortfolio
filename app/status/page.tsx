"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuSearch, LuPlus, LuFilter, LuDownload, 
  LuPen, LuTrash2, LuChevronLeft, LuChevronRight, LuLock, LuBriefcase, LuMapPin, LuDollarSign, LuCalendarClock, LuBellPlus, LuX
} from 'react-icons/lu';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Advanced Types ---
type RoundType = {
  _id?: string;
  roundName: string;
  interviewDate: string;
  status: string;
  notes: string;
};

type InterviewType = {
  _id?: string;
  companyName: string;
  role: string;
  ctc: string;
  location: string;
  workMode: string;
  hrName: string;
  phoneNumber: string;
  status: string;
  priority: string;
  rounds: RoundType[];
};

const PAGE_LIMIT = 10;
const ACCESS_PIN = "765534";

// --- Premium Apple Glass Input Component ---
const InputField = ({ 
  label, placeholder, value, onChange, type = 'text', required = false, options = [], icon: Icon
}: { 
  label: string, placeholder?: string, value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void, 
  type?: string, required?: boolean,
  options?: { value: string, label: string }[],
  icon?: any
}) => (
  <div className="space-y-1.5 group w-full">
    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-2 flex items-center gap-1.5 group-focus-within:text-blue-500 transition-colors duration-300">
      {Icon && <Icon className="w-3 h-3" />} {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative isolate">
      {type === 'textarea' ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full rounded-[1.5rem] border border-white/60 bg-white/40 backdrop-blur-md py-3.5 px-5 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white/80 focus:ring-[3px] focus:ring-blue-500/20 sm:text-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:bg-white/60 min-h-[80px] resize-none cursor-text outline-none"
        />
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full rounded-[1.2rem] border border-white/60 bg-white/40 backdrop-blur-md py-3.5 px-5 text-zinc-900 focus:border-blue-500 focus:bg-white/80 focus:ring-[3px] focus:ring-blue-500/20 sm:text-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:bg-white/60 cursor-pointer appearance-none outline-none font-medium"
        >
          <option value="" disabled>Select option...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full rounded-[1.2rem] border border-white/60 bg-white/40 backdrop-blur-md py-3.5 px-5 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white/80 focus:ring-[3px] focus:ring-blue-500/20 sm:text-[14px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:bg-white/60 cursor-text outline-none"
        />
      )}
    </div>
  </div>
);

export default function StatusPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [interviews, setInterviews] = useState<InterviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const initialFormState: InterviewType = {
    companyName: '', role: '', ctc: '', location: '', workMode: 'Remote',
    hrName: '', phoneNumber: '', status: 'Applied', priority: 'Medium',
    rounds: []
  };
  const [formData, setFormData] = useState<InterviewType>(initialFormState);

  useEffect(() => {
    const hasAccess = localStorage.getItem('dashboard_access_granted');
    if (hasAccess === 'true') setIsAuthenticated(true);
    setAuthLoading(false);
    fetchInterviews();
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ACCESS_PIN) {
      localStorage.setItem('dashboard_access_granted', 'true');
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const fetchInterviews = async () => {
    try {
      const res = await fetch('/api/interviews');
      const data = await res.json();
      setInterviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(16);
    doc.text('Advanced Application Pipeline', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 26);

    const tableColumn = ["Company", "Role & Details", "CTC", "Latest Round", "Overall Status"];
    const tableRows: string[][] = [];

    interviews.forEach(interview => {
      const latestRound = interview.rounds && interview.rounds.length > 0 
        ? `${interview.rounds[interview.rounds.length - 1].roundName} (${interview.rounds[interview.rounds.length - 1].status})` 
        : 'No rounds yet';

      const rowData = [
        interview.companyName,
        `${interview.role}\n${interview.workMode} | ${interview.location || 'N/A'}`,
        interview.ctc || 'Not Disclosed',
        latestRound,
        interview.status
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 32,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [0, 122, 255], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 247] }
    });

    doc.save(`Pipeline_Export_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingId) {
        setInterviews(prev => prev.map(i => i._id === editingId ? { ...formData, _id: editingId } : i));
        await fetch(`/api/interviews`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, _id: editingId }) 
        });
      } else {
        const tempId = Math.random().toString(36).substr(2, 9);
        setInterviews(prev => [...prev, { ...formData, _id: tempId }]);
        await fetch('/api/interviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      
      setFormData(initialFormState);
      setEditingId(null);
      setShowForm(false);
      await fetchInterviews();
    } catch (error) {
      console.error("Error saving data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (interview: InterviewType) => {
    // Format dates for the round inputs
    const formattedRounds = (interview.rounds || []).map(r => ({
      ...r,
      interviewDate: r.interviewDate ? new Date(r.interviewDate).toISOString().split('T')[0] : ''
    }));

    setFormData({ ...interview, rounds: formattedRounds });
    setEditingId(interview._id || null);
    setShowForm(true);
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this application permanently?')) return;
    setInterviews(prev => prev.filter(i => i._id !== id));
    try {
      await fetch(`/api/interviews`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id })
      });
      await fetchInterviews();
    } catch (error) {
      console.error("Error deleting", error);
    }
  };

  const openNewForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setShowForm(true);
  };

  // --- Dynamic Rounds Handlers ---
  const addRound = () => {
    setFormData(prev => ({
      ...prev,
      rounds: [...prev.rounds, { roundName: '', interviewDate: '', status: 'Scheduled', notes: '' }]
    }));
  };

  const updateRound = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newRounds = [...prev.rounds];
      newRounds[index] = { ...newRounds[index], [field]: value };
      return { ...prev, rounds: newRounds };
    });
  };

  const removeRound = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rounds: prev.rounds.filter((_, i) => i !== index)
    }));
  };

  const filteredInterviews = interviews.filter(i => 
    i.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalItems = filteredInterviews.length;
  const totalPages = Math.ceil(totalItems / PAGE_LIMIT);
  const currentData = filteredInterviews.slice((currentPage - 1) * PAGE_LIMIT, currentPage * PAGE_LIMIT);

  const activeInterviews = interviews.filter(i => i.status === 'In Progress').length;
  const highPriority = interviews.filter(i => i.priority === 'High').length;
  const offers = interviews.filter(i => i.status === 'Offered').length;

  if (authLoading) return <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center"><div className="text-zinc-400 font-bold tracking-widest uppercase text-sm animate-pulse">Loading Core...</div></div>;

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 overflow-hidden selection:bg-blue-200">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-blue-300/20 blur-[120px] mix-blend-multiply" />
          <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-300/20 blur-[120px] mix-blend-multiply" />
        </div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 w-full max-w-sm bg-white/60 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white/60 text-center">
          <div className="w-16 h-16 bg-zinc-900 rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl"><LuLock className="w-7 h-7 text-white" /></div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">Restricted Access</h2>
          <p className="text-[13px] text-zinc-500 font-medium mb-8">Please enter the PIN to view your dashboard.</p>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="Enter PIN" className={`block w-full text-center tracking-[0.5em] text-lg rounded-[1.2rem] border ${pinError ? 'border-red-500/50 focus:border-red-500/50 bg-red-50/50' : 'border-white/60 focus:border-blue-500'} bg-white/50 backdrop-blur-md py-4 px-5 text-zinc-900 placeholder:text-zinc-400 focus:bg-white/80 focus:ring-[3px] focus:ring-blue-500/20 shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all outline-none`} autoFocus />
              {pinError && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] font-bold tracking-wider uppercase mt-2">Incorrect PIN</motion.p>}
            </div>
            <motion.button whileTap={{ scale: 0.96 }} type="submit" className="w-full py-4 text-[15px] font-bold text-white bg-zinc-900 rounded-[1.2rem] shadow-lg hover:bg-black transition-all cursor-pointer mt-2">Unlock Dashboard</motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center"><div className="text-zinc-400 font-bold tracking-widest uppercase text-sm animate-pulse">Syncing Data...</div></div>;

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] text-zinc-900 font-sans p-4 sm:p-6 md:p-8 overflow-hidden selection:bg-blue-200">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-blue-300/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-300/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-300/10 blur-[140px] mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 pl-2">
          <div className="w-full md:w-80 relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"><LuSearch className="w-5 h-5" /></div>
            <input type="text" placeholder="Search roles or companies..." className="w-full pl-12 pr-5 py-3.5 bg-white/50 backdrop-blur-xl border border-white/60 rounded-[1.2rem] text-[15px] font-medium text-zinc-900 focus:outline-none focus:border-blue-500 focus:bg-white/80 focus:ring-[3px] focus:ring-blue-500/20 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.03)] cursor-text outline-none placeholder:text-zinc-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <motion.div whileHover={{ y: -4 }} className="bg-white/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col justify-center cursor-pointer transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34C759] shadow-[0_0_12px_rgba(52,199,89,0.8)]"></span>
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Total Sent</span>
            </div>
            <div className="flex items-baseline gap-1.5"><span className="text-[2.5rem] leading-none font-bold text-zinc-900 tracking-tight">{totalItems}</span></div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col justify-center cursor-pointer transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007AFF] shadow-[0_0_12px_rgba(0,122,255,0.8)]"></span>
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">In Progress</span>
            </div>
            <div className="flex items-baseline gap-1.5"><span className="text-[2.5rem] leading-none font-bold text-zinc-900 tracking-tight">{activeInterviews}</span></div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col justify-center cursor-pointer transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#AF52DE] shadow-[0_0_12px_rgba(175,82,222,0.8)]"></span>
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Priority</span>
            </div>
            <div className="flex items-baseline gap-1.5"><span className="text-[2.5rem] leading-none font-bold text-zinc-900 tracking-tight">{highPriority}</span></div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col justify-center cursor-pointer transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9500] shadow-[0_0_12px_rgba(255,149,0,0.8)]"></span>
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Offers</span>
            </div>
            <div className="flex items-baseline gap-1.5"><span className="text-[2.5rem] leading-none font-bold text-zinc-900 tracking-tight">{offers}</span></div>
          </motion.div>
        </div>

        {/* Data Table */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white/60 overflow-hidden flex flex-col flex-grow relative">
          
          {/* Table Header Controls */}
          <div className="p-5 md:px-8 md:py-6 border-b border-white/40 flex flex-wrap justify-between items-center gap-4 bg-white/30 z-10">
            <div className="flex gap-3">
              <motion.button whileTap={{ scale: 0.95 }} onClick={openNewForm} className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-6 py-3 rounded-full text-[13px] font-bold tracking-wide transition-all shadow-md cursor-pointer">
                <LuPlus className="w-4 h-4" /> Add Application
              </motion.button>
            </div>
            <div className="flex gap-3">
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleExportPDF} className="flex items-center gap-2 bg-white/50 backdrop-blur-md border border-white/60 hover:bg-white/80 text-[#007AFF] px-6 py-3 rounded-full text-[13px] font-bold tracking-wide transition-all shadow-sm cursor-pointer">
                <LuDownload className="w-4 h-4" /> Export Report
              </motion.button>
            </div>
          </div>

          {totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
              <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mb-4 text-zinc-300 shadow-sm border border-white/60"><LuBriefcase className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-zinc-800 mb-2 tracking-tight">No applications yet</h3>
              <p className="text-zinc-500 font-medium">Click "Add Application" to start tracking your pipeline.</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="hidden md:table-header-group bg-white/40 backdrop-blur-xl sticky top-0 z-[1]">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/40">Role & Company</th>
                    <th className="px-4 py-5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/40">Details (CTC & Loc)</th>
                    <th className="px-4 py-5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/40">Progress (Rounds)</th>
                    <th className="px-4 py-5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/40">Overall Status</th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40 bg-transparent">
                  {currentData.map((interview) => (
                    <tr key={interview._id} className="block md:table-row mb-4 md:mb-0 bg-white/40 md:bg-transparent rounded-[2rem] md:rounded-none shadow-sm md:shadow-none border border-white/50 md:border-0 hover:bg-white/60 transition-colors">
                      
                      <td className="block md:table-cell p-5 md:px-8 md:py-6 border-b border-white/40 md:border-0">
                        <div className="flex flex-col">
                          <span className="text-[16px] font-bold text-zinc-900">{interview.role}</span>
                          <span className="text-[13px] font-semibold text-[#007AFF] mt-1 uppercase tracking-wider">{interview.companyName}</span>
                        </div>
                      </td>

                      <td className="block md:table-cell p-5 md:px-4 md:py-6 border-b border-white/40 md:border-0">
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-600"><LuDollarSign className="w-3.5 h-3.5 text-zinc-400"/> {interview.ctc || 'N/A'}</div>
                            <div className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-600"><LuMapPin className="w-3.5 h-3.5 text-zinc-400"/> {interview.location || 'N/A'} <span className="text-zinc-400 text-[11px]">({interview.workMode})</span></div>
                         </div>
                      </td>

                      <td className="block md:table-cell p-5 md:px-4 md:py-6 border-b border-white/40 md:border-0">
                        <div className="flex flex-col gap-1">
                          <div className="text-[13px] font-bold text-zinc-800">
                            {interview.rounds?.length > 0 ? `${interview.rounds.length} Round(s) Total` : 'No rounds logged'}
                          </div>
                          {interview.rounds?.length > 0 && (
                            <div className="text-[12px] text-zinc-500 font-medium mt-1 bg-white/50 inline-flex px-2 py-1 rounded border border-white/60 w-max">
                              Latest: {interview.rounds[interview.rounds.length - 1].roundName} 
                              <span className="text-zinc-400 ml-1">({interview.rounds[interview.rounds.length - 1].status})</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="block md:table-cell p-5 md:px-4 md:py-6 border-b border-white/40 md:border-0">
                        <div className="flex flex-col items-start gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest ${
                            interview.status === 'Applied' ? 'bg-zinc-200/50 text-zinc-600' :
                            interview.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600' :
                            interview.status === 'Offered' ? 'bg-green-500/10 text-green-600' :
                            'bg-red-500/10 text-red-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              interview.status === 'Applied' ? 'bg-zinc-400' :
                              interview.status === 'In Progress' ? 'bg-blue-500' :
                              interview.status === 'Offered' ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            {interview.status}
                          </span>
                        </div>
                      </td>

                      <td className="block md:table-cell p-5 md:px-8 md:py-6 bg-white/30 md:bg-transparent rounded-b-[2rem] md:rounded-none border-t border-white/40 md:border-0">
                        <div className="flex items-center justify-end gap-3 text-[13px] font-bold">
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleEdit(interview)} className="flex items-center gap-1.5 text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/20 px-3 py-2 rounded-xl transition-colors cursor-pointer">
                            <LuPen className="w-4 h-4" /> Edit
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDelete(interview._id as string)} className="flex items-center gap-1.5 text-[#FF3B30] bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 px-3 py-2 rounded-xl transition-colors cursor-pointer">
                            <LuTrash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Slide-Up Modal Overlay */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md cursor-pointer" />

            <motion.div
              initial={{ y: "100%", scale: 0.95, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: "100%", scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl bg-[#F5F5F7]/95 backdrop-blur-3xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden flex flex-col h-[95vh] sm:h-[90vh]"
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-5 border-b border-black/5 bg-white/50 flex justify-between items-center sticky top-0 z-20">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{editingId ? 'Edit Application' : 'New Application'}</h2>
                  <p className="text-zinc-500 text-[13px] font-medium mt-1">Track company details and multiple interview rounds.</p>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} type="button" onClick={() => setShowForm(false)} className="w-10 h-10 bg-zinc-200/50 hover:bg-zinc-200 text-zinc-600 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer">
                  <LuX className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Form Body */}
              <div className="px-8 py-8 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-transparent to-white/30">
                <form id="interview-form" onSubmit={handleSubmit} className="space-y-10">
                  
                  {/* Section: Base Details */}
                  <div className="space-y-6">
                    <h3 className="text-[12px] font-bold text-zinc-800 uppercase tracking-widest border-b border-zinc-200 pb-2">1. Company & Role</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Company Name" placeholder="e.g. Google, Stripe" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} icon={LuBriefcase}/>
                      <InputField label="Role Applied For" placeholder="e.g. Senior Frontend Engineer" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField label="Target CTC" placeholder="e.g. 40 LPA or $150k" value={formData.ctc} onChange={e => setFormData({...formData, ctc: e.target.value})} icon={LuDollarSign} />
                      <InputField label="Location" placeholder="e.g. London / Bangalore" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} icon={LuMapPin} />
                      <InputField label="Work Mode" type="select" value={formData.workMode} onChange={e => setFormData({...formData, workMode: e.target.value})} options={[{ value: 'Remote', label: 'Remote' }, { value: 'Hybrid', label: 'Hybrid' }, { value: 'On-site', label: 'On-site' }]} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Overall Status" type="select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} options={[{ value: 'Applied', label: 'Applied' }, { value: 'In Progress', label: 'In Progress' }, { value: 'Offered', label: 'Offered' }, { value: 'Rejected', label: 'Rejected' }, { value: 'Ghosted', label: 'Ghosted' }]} />
                      <InputField label="Priority" type="select" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} options={[{ value: 'High', label: 'High Priority' }, { value: 'Medium', label: 'Medium Priority' }, { value: 'Low', label: 'Low Priority' }]} />
                    </div>
                  </div>

                  {/* Section: Timeline / Rounds */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <h3 className="text-[12px] font-bold text-zinc-800 uppercase tracking-widest">2. Interview Rounds Tracker</h3>
                      <button type="button" onClick={addRound} className="text-[12px] font-bold text-[#007AFF] flex items-center gap-1.5 hover:underline cursor-pointer"><LuPlus className="w-4 h-4"/> Add Round</button>
                    </div>

                    {formData.rounds.length === 0 ? (
                      <div className="p-8 border-2 border-dashed border-zinc-300 rounded-[2rem] text-center bg-white/30">
                        <p className="text-zinc-500 text-[14px] font-medium">No rounds logged yet.</p>
                        <button type="button" onClick={addRound} className="mt-3 px-5 py-2 bg-white rounded-full text-[13px] font-bold text-zinc-700 shadow-sm border border-zinc-200 hover:bg-zinc-50 cursor-pointer">Add First Round</button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.rounds.map((round, idx) => (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className="relative p-6 bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                            <div className="absolute top-6 right-6 text-zinc-300 font-bold text-2xl opacity-20 select-none pointer-events-none">#{idx + 1}</div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 relative z-10">
                              <InputField label="Round Name" placeholder="e.g. Technical Screen" value={round.roundName} onChange={(e) => updateRound(idx, 'roundName', e.target.value)} required />
                              <InputField label="Date" type="date" value={round.interviewDate} onChange={(e) => updateRound(idx, 'interviewDate', e.target.value)} icon={LuCalendarClock} />
                              <InputField label="Round Status" type="select" value={round.status} onChange={(e) => updateRound(idx, 'status', e.target.value)} options={[{ value: 'Scheduled', label: 'Scheduled' }, { value: 'Completed', label: 'Completed' }, { value: 'Passed', label: 'Passed' }, { value: 'Rejected', label: 'Rejected' }]} />
                            </div>
                            <div className="relative z-10">
                              <InputField label="Feedback / Preparation Notes" type="textarea" placeholder="What to study? What went well?" value={round.notes} onChange={(e) => updateRound(idx, 'notes', e.target.value)} />
                            </div>
                            
                            <div className="mt-4 flex justify-end relative z-10">
                              <button type="button" onClick={() => removeRound(idx)} className="text-[12px] font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
                                <LuTrash2 className="w-3.5 h-3.5" /> Remove Round
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                </form>
              </div>

              {/* Sticky Footer */}
              <div className="px-8 py-5 bg-white/80 backdrop-blur-xl border-t border-black/5 flex justify-end gap-3 sticky bottom-0 z-20">
                <motion.button whileTap={{ scale: 0.96 }} type="button" onClick={() => setShowForm(false)} className="px-8 py-3.5 text-[14px] font-bold text-zinc-600 bg-white border border-zinc-200 rounded-[1.2rem] hover:bg-zinc-50 transition-all shadow-sm cursor-pointer" disabled={isSubmitting}>
                  Cancel
                </motion.button>
                <motion.button whileTap={{ scale: 0.96 }} type="submit" form="interview-form" disabled={isSubmitting} className="flex justify-center items-center gap-2 px-8 py-3.5 text-[14px] font-bold text-white bg-[#007AFF] rounded-[1.2rem] shadow-[0_4px_16px_rgba(0,122,255,0.4)] hover:bg-blue-500 transition-all cursor-pointer disabled:opacity-70">
                  {isSubmitting ? 'Saving...' : (editingId ? <><LuPen className="w-4 h-4"/> Update Pipeline</> : <><LuPlus className="w-4 h-4"/> Save Application</>)}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}