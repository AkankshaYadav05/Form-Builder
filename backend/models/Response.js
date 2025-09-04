import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  questionType: {
    type: String,
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: null
  },
  timeSpent: {
    type: Number,
    default: 0
  }
});

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  respondentEmail: {
    type: String,
    default: null
  },
  respondentName: {
    type: String,
    default: 'Anonymous'
  },
  answers: [answerSchema],
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  completionTime: {
    type: Number,
    default: 0
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['completed', 'partial'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Index for analytics
responseSchema.index({ formId: 1, createdAt: -1 });
responseSchema.index({ respondentEmail: 1 });

export default mongoose.model('Response', responseSchema);