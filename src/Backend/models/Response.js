import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },     // main Q
  subQuestionId: { type: mongoose.Schema.Types.ObjectId, required: true },  // subQ
  question: String,               // subquestion text
  answer: String,                 // user answer
  correctAnswer: mongoose.Schema.Types.Mixed,  // for easy display
  isCorrect: Boolean,
});

const responseSchema = new mongoose.Schema(
  {
    formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
    answers: [answerSchema],
    score: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Response", responseSchema);
