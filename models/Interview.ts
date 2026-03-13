// models/Interview.ts
import mongoose from 'mongoose';

const RoundSchema = new mongoose.Schema({
  roundName: { type: String }, // Removed required
  interviewDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Passed', 'Rejected'], 
    default: 'Scheduled' 
  },
  notes: { type: String }
});

const InterviewSchema = new mongoose.Schema({
  companyName: { type: String }, // Removed required
  role: { type: String }, // Removed required
  ctc: { type: String },
  location: { type: String }, 
  workMode: { type: String, enum: ['Remote', 'Hybrid', 'On-site', 'Flexible'], default: 'Remote' },
  hrName: { type: String },
  phoneNumber: { type: String },
  
  status: { 
    type: String, 
    enum: ['Applied', 'In Progress', 'Offered', 'Rejected', 'Ghosted'], 
    default: 'Applied' 
  },
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'Medium' 
  },
  
  rounds: [RoundSchema]
}, { timestamps: true });

export default mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);