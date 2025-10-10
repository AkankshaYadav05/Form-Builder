import express from 'express';
import Form from '../models/Form.js';
import Response from "../models/Response.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// GET all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error('Error fetching forms:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/forms - Create new form
router.post('/', isAuth, async (req, res) => {
  try {
    const formData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const form = new Form(formData);
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    console.error('Error creating form:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/forms/:id - Get specific form
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (err) {
    console.error('Error fetching form:', err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/forms/:id - Update form
router.put('/:id', isAuth, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedForm) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    res.json(updatedForm);
  } catch (err) {
    console.error('Error updating form:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/forms/:id - Delete form
router.delete('/:id', isAuth, async (req, res) => {
  try {
    const deleted = await Form.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    // Also delete all responses for this form
    await Response.deleteMany({ formId: req.params.id });
    
    res.status(200).json({ message: 'Form and associated responses deleted successfully' });
  } catch (err) {
    console.error('Error deleting form:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/forms/:id/submit - Submit form response
router.post("/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // Array of { questionId, answer }

    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Process answers and calculate score if needed
    const processedAnswers = answers.map(userAnswer => {
      const question = form.questions.find(q => q.id === userAnswer.questionId);
      
      if (!question) {
        return {
          questionId: userAnswer.questionId,
          questionText: "Question not found",
          questionType: "unknown",
          answer: userAnswer.answer,
        };
      }

      return {
        questionId: userAnswer.questionId,
        questionText: question.text,
        questionType: question.type,
        answer: userAnswer.answer,
      };
    });

    const response = new Response({
      formId: id,
      answers: processedAnswers,
      score: 0, // Can be calculated based on correct answers later
      submittedAt: new Date(),
      submitterInfo: {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        sessionId: req.sessionID || 'anonymous'
      }
    });

    await response.save();
    res.status(201).json({ 
      message: 'Response submitted successfully',
      response: {
        _id: response._id,
        submittedAt: response.submittedAt,
      }
    });
  } catch (err) {
    console.error("Error saving response:", err);
    res.status(500).json({ error: "Server error while saving response" });
  }
});

// GET /api/forms/:id/responses - Get all responses for a form
router.get('/:id/responses', isAuth, async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.id })
      .sort({ submittedAt: -1 });
    res.json(responses);
  } catch (err) {
    console.error('Error fetching responses:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;