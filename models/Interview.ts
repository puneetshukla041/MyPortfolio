// models/Interview.ts
import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  hrName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String }, // <-- NEW
  experienceRequired: { type: String },
  interviewDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Awaiting Feedback', 'Offered', 'Rejected'], 
    default: 'Scheduled' 
  },
  topicsToStudy: { type: String },
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'Medium' 
  }
}, { timestamps: true });

export default mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);