import mongoose from 'mongoose';

// Options schema (used in MCQ and Cloze blanks with choices)
const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

// Sub-question schema (used inside Comprehension)
const SubQuestionSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["mcq"] }, // only MCQ for now
  question: { type: String, required: true },
  options: [OptionSchema],  // for MCQ choices
  correctAnswer: { type: mongoose.Schema.Types.Mixed }, // could be string or index
  image: String
});

// Cloze blank schema
const ClozeBlankSchema = new mongoose.Schema({
  index: { type: Number, required: true },         // blank position
  answer: { type: String, required: true },        // correct answer
  options: [OptionSchema]                          // if present → MCQ style blank
});

// Categorize item schema
const CategorizeItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  correctCategory: { type: String, required: true }
});

// Main Question schema
const QuestionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ["comprehension", "cloze", "categorize", "mcq"] 
  },
  title: { type: String },   
  passage: String,           // for comprehension
  clozeText: String,         // for cloze question text
  blanks: [ClozeBlankSchema],// for cloze blanks
  categories: [String],      // for categorize
  items: [CategorizeItemSchema], // categorize items
  questionText: String,      // for standalone MCQ
  options: [OptionSchema],   // for standalone MCQ
  subQuestions: [SubQuestionSchema], // comprehension sub-questions
  image: String
});

// Form schema
const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Form", FormSchema);
