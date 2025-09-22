import mongoose from 'mongoose';

// Answer schema for individual question responses
const AnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true }, 
  questionText: { type: String, required: true },
  questionType: { type: String, required: true },
  answer: { type: mongoose.Schema.Types.Mixed },
  isCorrect: { type: Boolean, default: false }
});

// Response schema
const ResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  answers: [AnswerSchema],
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  submitterInfo: {
    ip: String,
    userAgent: String,
    sessionId: String
  }
}, {
  timestamps: true
});

export default mongoose.model("Response", ResponseSchema);