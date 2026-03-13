"use client";

import { useState, useEffect } from 'react';

type InterviewType = {
  _id?: string;
  companyName: string;
  hrName: string;
  phoneNumber: string;
  role: string;
  experienceRequired: string;
  interviewDate: string;
  status: string;
  topicsToStudy: string;
  priority: string;
};

export default function StatusPage() {
  const [interviews, setInterviews] = useState<InterviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '', hrName: '', phoneNumber: '', role: '',
    experienceRequired: '', interviewDate: '', status: 'Scheduled',
    topicsToStudy: '', priority: 'Medium'
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

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
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ 
          companyName: '', hrName: '', phoneNumber: '', role: '',
          experienceRequired: '', interviewDate: '', status: 'Scheduled',
          topicsToStudy: '', priority: 'Medium'
        });
        setShowForm(false);
        await fetchInterviews();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans p-4 md:p-8 selection:bg-zinc-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Control Bar (No Heading) */}
        <div className="flex justify-end mb-8">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded hover:bg-zinc-200 transition-colors"
          >
            {showForm ? 'Cancel' : 'Add Record'}
          </button>
        </div>

        {/* Data Entry Form */}
        {showForm && (
          <div className="mb-8 bg-[#0a0a0a] border border-zinc-800 p-6 rounded-lg">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input type="text" placeholder="Company Name" required className="form-input" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
              <input type="text" placeholder="Role" required className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
              <input type="date" required className="form-input text-zinc-400" value={formData.interviewDate} onChange={e => setFormData({...formData, interviewDate: e.target.value})} />
              <input type="text" placeholder="HR Name" required className="form-input" value={formData.hrName} onChange={e => setFormData({...formData, hrName: e.target.value})} />
              <input type="text" placeholder="Phone Number" className="form-input" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
              <select className="form-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="High">Priority: High</option>
                <option value="Medium">Priority: Medium</option>
                <option value="Low">Priority: Low</option>
              </select>
              <textarea placeholder="Preparation Notes / Topics" className="form-input md:col-span-2 lg:col-span-3 min-h-[80px] resize-y" value={formData.topicsToStudy} onChange={e => setFormData({...formData, topicsToStudy: e.target.value})} />
              <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-2">
                <button type="submit" disabled={isSubmitting} className="bg-white text-black text-sm font-medium px-6 py-2.5 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Empty State */}
        {interviews.length === 0 && !showForm && (
          <div className="text-center py-12 text-zinc-600 text-sm">
            No records found.
          </div>
        )}

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {interviews.map((interview) => (
            <div key={interview._id} className="bg-[#0a0a0a] border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-colors flex flex-col h-full">
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-white font-medium text-lg">{interview.companyName}</div>
                  <div className="text-zinc-500 text-sm mt-0.5">{interview.role}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-2 py-1 rounded border ${
                    interview.priority === 'High' ? 'border-red-900 text-red-400 bg-red-950/30' : 
                    interview.priority === 'Medium' ? 'border-amber-900 text-amber-400 bg-amber-950/30' : 
                    'border-zinc-800 text-zinc-400 bg-zinc-900'
                  }`}>
                    {interview.priority}
                  </span>
                  <span className="text-xs text-zinc-400">{interview.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-sm border-t border-zinc-800/50 py-4 mt-auto">
                <div>
                  <div className="text-zinc-600 text-xs mb-1">Date</div>
                  <div className="text-zinc-300">{new Date(interview.interviewDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-zinc-600 text-xs mb-1">Contact</div>
                  <div className="text-zinc-300 truncate">{interview.hrName}</div>
                  <div className="text-zinc-500 text-xs">{interview.phoneNumber}</div>
                </div>
              </div>

              {interview.topicsToStudy && (
                <div className="pt-4 border-t border-zinc-800/50">
                  <div className="text-zinc-600 text-xs mb-1">Notes</div>
                  <div className="text-zinc-400 text-sm line-clamp-2">{interview.topicsToStudy}</div>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        .form-input {
          @apply w-full bg-black border border-zinc-800 text-zinc-200 px-4 py-3 rounded text-sm focus:outline-none focus:border-zinc-600 focus:bg-[#0a0a0a] transition-all placeholder:text-zinc-600;
        }
        /* Custom scrollbar for webkit */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}