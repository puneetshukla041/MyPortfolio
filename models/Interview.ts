// models/Interview.ts
import mongoose from 'mongoose';

const RoundSchema = new mongoose.Schema({
  roundName: { type: String, required: true }, // e.g., "Technical", "HR", "System Design"
  interviewDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Passed', 'Rejected'], 
    default: 'Scheduled' 
  },
  notes: { type: String }
});

const InterviewSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  ctc: { type: String }, // e.g., "30 LPA", "150k USD"
  location: { type: String }, 
  workMode: { type: String, enum: ['Remote', 'Hybrid', 'On-site', 'Flexible'], default: 'Remote' },
  hrName: { type: String },
  phoneNumber: { type: String },
  
  // Overall status of the application
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
  
  // Array to hold multiple rounds
  rounds: [RoundSchema]
}, { timestamps: true });

export default mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);