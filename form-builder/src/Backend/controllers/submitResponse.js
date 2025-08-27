import Form from "../models/Form.js";
import Response from "../models/Response.js";

export const submitResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body; 
    // answers = [{ questionId, subQuestionId, answer }, ...]

    // fetch form with questions + subQuestions
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    let score = 0;
    let processedAnswers = [];

    for (const ans of answers) {
      const question = form.questions.id(ans.questionId);
      if (!question) continue;

      const subQ = question.subQuestions.id(ans.subQuestionId);
      if (!subQ) continue;

      const isCorrect = String(ans.answer).trim().toLowerCase() === 
                        String(subQ.correctAnswer).trim().toLowerCase();

      if (isCorrect) score++;

      processedAnswers.push({
        formId,
        questionId: ans.questionId,
        subQuestionId: ans.subQuestionId,
        question: subQ.question,
        answer: ans.answer,
        correctAnswer: subQ.correctAnswer,
        isCorrect
      });
    }

    // save response
    const response = new Response({
      formId,
      answers: processedAnswers,
      score,
    });

    await response.save();

    res.status(201).json({ message: "Response submitted", response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
