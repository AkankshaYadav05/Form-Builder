import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String, default: null },
  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['mcq', 'text', 'textarea', 'checkbox', 'radio', 'select', 'file', 'rating', 'date', 'email', 'number', 'cloze', 'categorize', 'comprehension']
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  required: { type: Boolean, default: false },
  options: [optionSchema],
  image: { type: String, default: null },
  
  // Cloze specific fields
  clozeText: { type: String, default: '' },
  blanks: [{
    position: Number,
    correctAnswer: String,
    options: [String]
  }],
  
  // Categorize specific fields
  categories: [String],
  items: [{
    text: String,
    correctCategory: String
  }],
  
  // Comprehension specific fields
  passage: { type: String, default: '' },
  subQuestions: [{
    question: String,
    type: { type: String, enum: ['mcq', 'text'], default: 'text' },
    options: [String],
    correctAnswer: String
  }],
  
  // Rating specific
  maxRating: { type: Number, default: 5 },
  
  // Validation
  validation: {
    minLength: Number,
    maxLength: Number,
    pattern: String
  }
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  headerImage: { type: String, default: null },
  questions: [questionSchema],
  settings: {
    allowAnonymous: { type: Boolean, default: true },
    multipleSubmissions: { type: Boolean, default: false },
    showProgressBar: { type: Boolean, default: true },
    collectEmail: { type: Boolean, default: false },
    customTheme: {
      primaryColor: { type: String, default: '#3B82F6' },
      backgroundColor: { type: String, default: '#F9FAFB' },
      fontFamily: { type: String, default: 'Inter' }
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analytics: {
    views: { type: Number, default: 0 },
    submissions: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for better performance
formSchema.index({ createdBy: 1, createdAt: -1 });
formSchema.index({ status: 1 });

export default mongoose.model('Form', formSchema);