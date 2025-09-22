import express from "express";
import Response from "../models/Response.js";
import Form from "../models/Form.js"; 
import mongoose from "mongoose";

const router = express.Router();

// POST /api/submit - General submit endpoint
router.post("/submit", async (req, res) => {
  try {
    const { formId, answers } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    // Process answers
    const processedAnswers = answers.map(userAnswer => {
      const question = form.questions.find(q => q.id === userAnswer.questionId);
      
      return {
        questionId: userAnswer.questionId,
        questionText: question ? question.text : "Question not found",
        questionType: question ? question.type : "unknown",
        answer: userAnswer.answer,
        isCorrect: false // Can be enhanced with scoring logic
      };
    });

    const response = new Response({
      formId,
      answers: processedAnswers,
      score: 0, // Can be calculated based on correct answers
      submittedAt: new Date(),
      submitterInfo: {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await response.save();
    
    res.status(201).json({ 
      message: "Response saved successfully", 
      response: {
        _id: response._id,
        submittedAt: response.submittedAt,
        score: response.score
      }
    });
  } catch (err) {
    console.error("Submit response error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/responses - Get all responses (with optional form filter)
router.get("/", async (req, res) => {
  try {
    const { formId } = req.query;
    const filter = formId ? { formId } : {};
    
    const responses = await Response.find(filter)
      .populate('formId', 'title description')
      .sort({ submittedAt: -1 });
    
    res.json(responses);
  } catch (err) {
    console.error("Fetch responses error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/responses/:id - Get specific response
router.get("/:id", async (req, res) => {
  try {
    const response = await Response.findById(req.params.id)
      .populate('formId', 'title description');
    
    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }
    
    res.json(response);
  } catch (err) {
    console.error("Fetch response error:", err);
    res.status(500).json({ message: err.message });
  }
});



// DELETE /api/responses/:id - Delete specific response
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Response.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Response not found" });
    }
    
    res.json({ message: "Response deleted successfully" });
  } catch (err) {
    console.error("Delete response error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;