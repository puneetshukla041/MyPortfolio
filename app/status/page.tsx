"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Constants ---
type InterviewType = {
  _id?: string;
  companyName: string;
  hrName: string;
  phoneNumber: string;
  role: string;
  location: string; // <-- Added Location
  experienceRequired: string;
  interviewDate: string;
  status: string;
  topicsToStudy: string;
  priority: string;
};

const PAGE_LIMIT = 10;
const ACCESS_PIN = "765534"; // Your defined PIN

// --- Premium Apple Glass Input Component ---
const InputField = ({ 
  label, placeholder, value, onChange, type = 'text', required = false, options = [] 
}: { 
  label: string, placeholder?: string, value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void, 
  type?: string, required?: boolean,
  options?: { value: string, label: string }[] // <-- Added dynamic options support
}) => (
  <div className="space-y-1.5 group w-full">
    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-2 flex items-center gap-1.5 group-focus-within:text-blue-500 transition-colors duration-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative isolate">
      {type === 'textarea' ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full rounded-[1.5rem] border border-white/60 bg-white/40 backdrop-blur-md py-4 px-5 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white/80 focus:ring-[3px] focus:ring-blue-500/20 sm:text-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:bg-white/60 min-h-[120px] resize-none cursor-text outline-none"
        />
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full rounded-[1.2rem] border border-white/60 bg-white/40 backdrop-blur-md py-3.5 px-5 text-zinc-900 focus:border-blue-500 focus:bg-white/80 focus:ring-[3px] focus:ring-blue-500/20 sm:text-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:bg-white/60 cursor-pointer appearance-none outline-none font-medium"
        >
          {/* Dynamic options mapping */}
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
          className="block w-full rounded-[1.2rem] border border-white/60 bg-white/40 backdrop-blur-md py-3.5 px-5 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white/80 focus:ring-[3px] focus:ring-blue-500/20 sm:text-[15px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:bg-white/60 cursor-text outline-none"
        />
      )}
    </div>
  </div>
);

// --- Mobile Label Component ---
const MobileLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="md:hidden text-[10px] font-bold text-zinc-400 uppercase tracking-widest mr-2 min-w-[80px]">
    {children}
  </span>
);

export default function StatusPage() {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // --- App State ---
  const [interviews, setInterviews] = useState<InterviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit & Table State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const initialFormState = {
    companyName: '', hrName: '', phoneNumber: '', role: '', location: '',
    experienceRequired: '', interviewDate: '', status: 'Scheduled',
    topicsToStudy: '', priority: 'Medium'
  };
  const [formData, setFormData] = useState<InterviewType>(initialFormState);

  // --- Auth & Data Effects ---
  useEffect(() => {
    const hasAccess = localStorage.getItem('dashboard_access_granted');
    if (hasAccess === 'true') {
      setIsAuthenticated(true);
    }
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
    const formattedDate = interview.interviewDate 
      ? new Date(interview.interviewDate).toISOString().split('T')[0] 
      : '';
      
    setFormData({ ...interview, interviewDate: formattedDate });
    setEditingId(interview._id || null);
    setShowForm(true);
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
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

  const filteredInterviews = interviews.filter(i => 
    i.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalItems = filteredInterviews.length;
  const totalPages = Math.ceil(totalItems / PAGE_LIMIT);
  const currentData = filteredInterviews.slice((currentPage - 1) * PAGE_LIMIT, currentPage * PAGE_LIMIT);

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(currentData.map(i => i._id as string));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) setSelectedIds(prev => [...prev, id]);
    else setSelectedIds(prev => prev.filter(i => i !== id));
  };

  const activeInterviews = interviews.filter(i => i.status === 'Scheduled' || i.status === 'Awaiting Feedback').length;
  const highPriority = interviews.filter(i => i.priority === 'High').length;
  const offers = interviews.filter(i => i.status === 'Offered').length;

  // --- Renders ---

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="text-zinc-400 font-bold tracking-widest uppercase text-sm animate-pulse">Checking Access...</div>
      </div>
    );
  }

  // Auth Overlay Screen
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 overflow-hidden selection:bg-blue-200">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-blue-300/20 blur-[120px] mix-blend-multiply" />
          <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-300/20 blur-[120px] mix-blend-multiply" />
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 w-full max-w-sm bg-white/60 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white/60 text-center"
        >
          <div className="w-16 h-16 bg-zinc-900 rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">Restricted Access</h2>
          <p className="text-[13px] text-zinc-500 font-medium mb-8">Please enter the PIN to view your dashboard.</p>
          
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN"
                className={`block w-full text-center tracking-[0.5em] text-lg rounded-[1.2rem] border ${pinError ? 'border-red-500/50 focus:border-red-500/50 bg-red-50/50' : 'border-white/60 focus:border-blue-500'} bg-white/50 backdrop-blur-md py-4 px-5 text-zinc-900 placeholder:text-zinc-400 placeholder:tracking-normal focus:bg-white/80 focus:ring-[3px] focus:ring-blue-500/20 shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all outline-none`}
                autoFocus
              />
              {pinError && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[11px] font-bold tracking-wider uppercase mt-2">
                  Incorrect PIN
                </motion.p>
              )}
            </div>
            <motion.button 
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="w-full py-4 text-[15px] font-bold text-white bg-zinc-900 rounded-[1.2rem] shadow-lg hover:bg-black transition-all cursor-pointer mt-2"
            >
              Unlock Dashboard
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Main Dashboard View
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="text-zinc-400 font-bold tracking-widest uppercase text-sm animate-pulse">Loading System...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] text-zinc-900 font-sans p-4 sm:p-6 md:p-8 overflow-hidden selection:bg-blue-200">
      
      {/* Decorative Glass Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-blue-300/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-300/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-300/10 blur-[140px] mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 pl-2">
         
          <div className="w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full px-5 py-3.5 bg-white/50 backdrop-blur-xl border border-white/60 rounded-[1.2rem] text-[15px] font-medium text-zinc-900 focus:outline-none focus:border-blue-500 focus:bg-white/80 focus:ring-[3px] focus:ring-blue-500/20 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.03)] cursor-text outline-none placeholder:text-zinc-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Metrics Cards Grid (Glassmorphism) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <motion.div whileHover={{ y: -4 }} className="bg-white/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col justify-center cursor-pointer transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34C759] shadow-[0_0_12px_rgba(52,199,89,0.8)]"></span>
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Total</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[2.5rem] leading-none font-bold text-zinc-900 tracking-tight">{totalItems}</span>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col justify-center cursor-pointer transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007AFF] shadow-[0_0_12px_rgba(0,122,255,0.8)]"></span>
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Active</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[2.5rem] leading-none font-bold text-zinc-900 tracking-tight">{activeInterviews}</span>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col justify-center cursor-pointer transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#AF52DE] shadow-[0_0_12px_rgba(175,82,222,0.8)]"></span>
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Priority</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[2.5rem] leading-none font-bold text-zinc-900 tracking-tight">{highPriority}</span>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col justify-center cursor-pointer transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9500] shadow-[0_0_12px_rgba(255,149,0,0.8)]"></span>
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Offers</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[2.5rem] leading-none font-bold text-zinc-900 tracking-tight">{offers}</span>
            </div>
          </motion.div>
        </div>

        {/* Apple Data Table Section */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white/60 overflow-hidden flex flex-col flex-grow relative">
          
          <div className="p-5 md:px-8 md:py-6 border-b border-white/40 flex flex-wrap justify-between items-center gap-4 bg-white/30 z-10">
            <div className="flex gap-3">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={openNewForm}
                className="bg-zinc-900 hover:bg-black text-white px-6 py-3 rounded-full text-[13px] font-bold tracking-wide transition-all shadow-md cursor-pointer"
              >
                + New Entry
              </motion.button>
              
              <motion.button whileTap={{ scale: 0.95 }} className="bg-white/50 backdrop-blur-md border border-white/60 hover:bg-white/80 text-zinc-700 px-6 py-3 rounded-full text-[13px] font-bold tracking-wide transition-all shadow-sm cursor-pointer">
                Filter View
              </motion.button>
            </div>

            <div className="flex gap-3">
              <motion.button whileTap={{ scale: 0.95 }} className="bg-white/50 backdrop-blur-md border border-white/60 hover:bg-white/80 text-zinc-700 px-6 py-3 rounded-full text-[13px] font-bold tracking-wide transition-all shadow-sm cursor-pointer">
                Export Data
              </motion.button>
            </div>
          </div>

          {totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
              <h3 className="text-2xl font-bold text-zinc-800 mb-2 tracking-tight">No records found</h3>
              <p className="text-zinc-500 font-medium">Click "+ New Entry" to log your first application.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  
                  {/* Sticky Header */}
                  <thead className="hidden md:table-header-group bg-white/40 backdrop-blur-xl sticky top-0 z-[1]">
                    <tr>
                      <th scope="col" className="w-16 px-8 py-5 border-b border-white/40 text-center">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 text-blue-500 border-zinc-300 rounded-md cursor-pointer transition-colors"
                          checked={selectedIds.length === currentData.length && currentData.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th className="px-4 py-5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/40 text-center">No.</th>
                      <th className="px-4 py-5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/40">Contact Info</th>
                      <th className="px-4 py-5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/40">Company & Role</th>
                      <th className="px-4 py-5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/40">Status</th>
                      <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/40 text-right">Actions</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-white/40 bg-transparent">
                    {currentData.map((interview, index) => {
                      const serialNumber = (currentPage - 1) * PAGE_LIMIT + index + 1;
                      const isSelected = selectedIds.includes(interview._id as string);

                      return (
                        <tr 
                          key={interview._id}
                          className={`block md:table-row mb-4 md:mb-0 bg-white/40 md:bg-transparent rounded-[2rem] md:rounded-none shadow-sm md:shadow-none border border-white/50 md:border-0 transition-colors ${isSelected ? "bg-blue-50/50" : "hover:bg-white/60"}`}
                        >
                          <td className="flex md:table-cell items-center justify-between p-5 md:px-8 md:py-6 border-b border-white/40 md:border-0 md:text-center">
                            <MobileLabel>Select</MobileLabel>
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 text-blue-500 border-zinc-300 rounded-md cursor-pointer transition-colors"
                              checked={isSelected}
                              onChange={(e) => handleSelectOne(interview._id as string, e.target.checked)}
                            />
                          </td>

                          <td className="hidden md:table-cell px-4 py-6 text-center">
                            <span className="text-[13px] font-bold text-zinc-400">
                              {String(serialNumber).padStart(2, '0')}
                            </span>
                          </td>

                          <td className="flex md:table-cell flex-col md:flex-row items-start md:items-center justify-between p-5 md:px-4 md:py-6 border-b border-white/40 md:border-0">
                            <MobileLabel>Contact</MobileLabel>
                            <div className="w-full md:w-auto text-right md:text-left mt-1 md:mt-0 cursor-pointer">
                              <div className="text-[15px] font-bold text-zinc-800">{interview.hrName || 'Not specified'}</div>
                              <div className="text-[13px] text-zinc-500 font-medium mt-0.5">{interview.phoneNumber || 'No contact'}</div>
                            </div>
                          </td>

                          <td className="flex md:table-cell flex-col md:flex-row items-start md:items-center justify-between p-5 md:px-4 md:py-6 border-b border-white/40 md:border-0">
                            <MobileLabel>Company</MobileLabel>
                            <div className="w-full md:w-auto text-right md:text-left mt-1 md:mt-0 cursor-pointer">
                              <span className="inline-flex px-3.5 py-1.5 rounded-full text-[11px] font-bold border border-[#007AFF]/20 bg-[#007AFF]/10 text-[#007AFF] uppercase tracking-wider">
                                {interview.companyName}
                              </span>
                              <div className="text-[14px] text-zinc-600 font-semibold mt-2">
                                {interview.role || 'Role unassigned'}
                                {interview.location && <span className="text-zinc-400 font-medium"> • {interview.location}</span>}
                              </div>
                            </div>
                          </td>

                          <td className="flex md:table-cell flex-col md:flex-row items-start md:items-center justify-between p-5 md:px-4 md:py-6 border-b border-white/40 md:border-0">
                            <MobileLabel>Status</MobileLabel>
                            <div className="w-full md:w-auto text-right md:text-left mt-1 md:mt-0 cursor-pointer">
                              <div className="text-[14px] text-zinc-800 font-bold mb-2 flex items-center gap-2 md:justify-start justify-end">
                                <span className={`w-2 h-2 rounded-full ${
                                  interview.status === 'Completed' ? 'bg-green-500' :
                                  interview.status === 'Offered' ? 'bg-blue-500' :
                                  interview.status === 'Rejected' ? 'bg-red-500' :
                                  'bg-orange-400'
                                }`}></span>
                                {interview.status}
                              </div>
                              <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                                interview.priority === 'High' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' :
                                interview.priority === 'Medium' ? 'bg-[#FF9500]/10 text-[#FF9500]' :
                                'bg-zinc-200/50 text-zinc-600'
                              }`}>
                                {interview.priority} Priority
                              </span>
                            </div>
                          </td>

                          <td className="block md:table-cell p-5 md:px-8 md:py-6 bg-white/30 md:bg-transparent rounded-b-[2rem] md:rounded-none border-t border-white/40 md:border-0">
                            <div className="flex items-center justify-end gap-5 text-[13px] font-bold">
                              <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(interview)}
                                className="text-[#007AFF] hover:opacity-70 transition-opacity cursor-pointer p-2 md:p-0"
                              >
                                Edit
                              </motion.button>
                              <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(interview._id as string)}
                                className="text-[#FF3B30] hover:opacity-70 transition-opacity cursor-pointer p-2 md:p-0"
                              >
                                Delete
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* iOS Pill Pagination */}
              <div className="border-t border-white/40 bg-white/30 p-5 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-[13px] text-zinc-500 font-medium tracking-wide">
                  Showing <span className="text-zinc-900 font-bold">{totalItems === 0 ? 0 : ((currentPage - 1) * PAGE_LIMIT) + 1}</span> - <span className="text-zinc-900 font-bold">{Math.min(currentPage * PAGE_LIMIT, totalItems)}</span> of <span className="text-zinc-900 font-bold">{totalItems}</span>
                </div>
                
                <div className="flex items-center gap-2 p-1.5 bg-white/50 backdrop-blur-md rounded-full shadow-sm border border-white/60">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-full text-zinc-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer text-[13px] font-bold"
                  >
                    Prev
                  </motion.button>
                  
                  <div className="flex items-center px-1">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-bold bg-zinc-900 text-white shadow-md">
                      {currentPage}
                    </span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-4 py-2 rounded-full text-zinc-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer text-[13px] font-bold"
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* iOS Native Modal Overlay */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ y: "100%", scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: "100%", scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white/80 backdrop-blur-3xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
            >
              {/* iOS Drag Indicator (Visual only) */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-zinc-300 rounded-full sm:hidden"></div>

              {/* Header */}
              <div className="px-8 pt-10 pb-6 border-b border-white/50 bg-white/40 flex justify-between items-center sticky top-0 z-20">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    {editingId ? 'Edit Entry' : 'New Entry'}
                  </h2>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-zinc-200/50 hover:bg-zinc-200 text-zinc-600 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer text-[13px] font-bold uppercase tracking-widest"
                >
                  Close
                </motion.button>
              </div>

              {/* Form Body */}
              <div className="px-8 pt-8 pb-10 overflow-y-auto custom-scrollbar flex-1">
                <form id="interview-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Company Name" placeholder="Apple" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                    <InputField label="Role" placeholder="Engineer" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Date" placeholder="" type="date" value={formData.interviewDate} onChange={e => setFormData({...formData, interviewDate: e.target.value})} />
                    <InputField label="Location" placeholder="Remote / London / NY" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="HR Contact" placeholder="Name" value={formData.hrName} onChange={e => setFormData({...formData, hrName: e.target.value})} />
                    <InputField label="Phone" placeholder="Number" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                      label="Status" 
                      type="select" 
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      options={[
                        { value: 'Scheduled', label: 'Scheduled' },
                        { value: 'Completed', label: 'Completed' },
                        { value: 'Awaiting Feedback', label: 'Awaiting Feedback' },
                        { value: 'Offered', label: 'Offered' },
                        { value: 'Rejected', label: 'Rejected' }
                      ]}
                    />
                    <InputField 
                      label="Priority" 
                      type="select" 
                      value={formData.priority} 
                      onChange={e => setFormData({...formData, priority: e.target.value})} 
                      options={[
                        { value: 'High', label: 'High Priority' },
                        { value: 'Medium', label: 'Medium Priority' },
                        { value: 'Low', label: 'Low Priority' }
                      ]}
                    />
                  </div>

                  <div className="w-full">
                    <InputField label="Notes" placeholder="Type here..." type="textarea" value={formData.topicsToStudy} onChange={e => setFormData({...formData, topicsToStudy: e.target.value})} />
                  </div>
                </form>
              </div>

              {/* Sticky Footer */}
              <div className="px-8 py-6 bg-white/60 border-t border-white/50 flex flex-col-reverse sm:flex-row justify-end gap-3 sticky bottom-0 z-20">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full sm:w-auto px-8 py-3.5 text-[15px] font-bold text-zinc-600 bg-white/50 border border-white/60 rounded-[1.2rem] hover:bg-white transition-all shadow-sm cursor-pointer"
                  disabled={isSubmitting}
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  form="interview-form"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 text-[15px] font-bold text-white bg-[#007AFF] rounded-[1.2rem] shadow-[0_4px_16px_rgba(0,122,255,0.4)] hover:bg-blue-500 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Save')}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        /* Invisible but functional scrollbar to maintain the clean Apple look */
        .custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
