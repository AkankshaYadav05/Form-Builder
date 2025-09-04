import express from 'express';
import Response from '../models/Response.js';
import Form from '../models/Form.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Submit response
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { formId, answers, respondentEmail, respondentName, completionTime } = req.body;

    // Validate form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.status !== 'published') {
      return res.status(400).json({ message: 'Form is not accepting responses' });
    }

    // Calculate score for questions with correct answers
    let score = 0;
    let totalScorable = 0;

    const processedAnswers = answers.map(answer => {
      const question = form.questions.id(answer.questionId);
      if (!question) return answer;

      let isCorrect = null;

      // Check correctness based on question type
      if (question.type === 'mcq' && question.options.some(opt => opt.isCorrect)) {
        totalScorable++;
        const correctOption = question.options.find(opt => opt.isCorrect);
        isCorrect = answer.answer === correctOption.text;
        if (isCorrect) score++;
      } else if (question.type === 'cloze' && question.blanks.length > 0) {
        totalScorable++;
        // For cloze, check if all blanks are filled correctly
        const userAnswers = Array.isArray(answer.answer) ? answer.answer : [answer.answer];
        const correctAnswers = question.blanks.map(blank => blank.correctAnswer);
        isCorrect = userAnswers.length === correctAnswers.length && 
                   userAnswers.every((ans, idx) => ans?.toLowerCase().trim() === correctAnswers[idx]?.toLowerCase().trim());
        if (isCorrect) score++;
      }

      return {
        ...answer,
        questionType: question.type,
        isCorrect
      };
    });

    const finalScore = totalScorable > 0 ? Math.round((score / totalScorable) * 100) : 0;

    const response = new Response({
      formId,
      respondentEmail,
      respondentName: respondentName || 'Anonymous',
      answers: processedAnswers,
      score: finalScore,
      totalQuestions: form.questions.length,
      completionTime: completionTime || 0,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await response.save();

    // Update form analytics
    await Form.findByIdAndUpdate(formId, {
      $inc: { 'analytics.submissions': 1 }
    });

    res.status(201).json({
      message: 'Response submitted successfully',
      responseId: response._id,
      score: finalScore
    });
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ message: 'Failed to submit response' });
  }
});

// Get responses for a form
router.get('/form/:formId', authenticate, async (req, res) => {
  try {
    const { formId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Verify form ownership
    const form = await Form.findOne({ _id: formId, createdBy: req.user._id });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or unauthorized' });
    }

    const responses = await Response.find({ formId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Response.countDocuments({ formId });

    res.json({
      responses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get responses error:', error);
    res.status(500).json({ message: 'Failed to fetch responses' });
  }
});

// Get single response
router.get('/:id', authenticate, async (req, res) => {
  try {
    const response = await Response.findById(req.params.id)
      .populate('formId', 'title questions createdBy')
      .populate('formId.createdBy', 'name email');

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Check if user owns the form
    if (response.formId.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(response);
  } catch (error) {
    console.error('Get response error:', error);
    res.status(500).json({ message: 'Failed to fetch response' });
  }
});

export default router;