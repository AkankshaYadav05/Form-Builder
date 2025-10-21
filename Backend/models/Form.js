import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true }, 
  type: { 
    type: String, 
    required: true, 
    enum: ["mcq", "short", "long", "rating", "checkbox", "dropdown", "file", "date", "time", "categorize"] 
  },
  text: { type: String, required: true },
  
  // For MCQ, Checkbox, Dropdown
  options: [{ type: String }],
  
  // For Rating
  scale: { type: Number, default: 5 },
  
  // For Categorize
  categories: [{ type: String }],
  items: [{ type: String }],
  
  // Optional fields
  required: { type: Boolean, default: false },
  placeholder: String,
  description: String
});

// Form schema
const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  questions: [QuestionSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  theme: { type: String, default: "default" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
FormSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Form", FormSchema);