import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  type: String,
  title: String,
  passage: String,
  clozeText: String,
  categories: [String],
  items: [String],
  image: String // store image path or base64
});

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Form', FormSchema);
