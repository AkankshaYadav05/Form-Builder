import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  questionId: String,
  answer: mongoose.Schema.Types.Mixed // can be string, array, etc.
});

const ResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  answers: [AnswerSchema]
}, { timestamps: true });

export default mongoose.model("Response", ResponseSchema);
