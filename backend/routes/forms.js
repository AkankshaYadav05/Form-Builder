import express from 'express';
import Form from '../models/Form.js';
import Response from '../models/Response.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Create form
router.post('/', authenticate, async (req, res) => {
  try {
    const formData = {
      ...req.body,
      createdBy: req.user._id
    };

    const form = new Form(formData);
    await form.save();

    res.status(201).json({
      message: 'Form created successfully',
      form
    });
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ message: 'Failed to create form' });
  }
});

// Get all forms for authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const query = { createdBy: req.user._id };
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const forms = await Form.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email');

    const total = await Form.countDocuments(query);

    res.json({
      forms,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get forms error:', error);
    res.status(500).json({ message: 'Failed to fetch forms' });
  }
});

// Get single form (public access for filling)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Increment view count
    await Form.findByIdAndUpdate(req.params.id, { $inc: { 'analytics.views': 1 } });

    res.json(form);
  } catch (error) {
    console.error('Get form error:', error);
    res.status(500).json({ message: 'Failed to fetch form' });
  }
});

// Update form
router.put('/:id', authenticate, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, createdBy: req.user._id });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found or unauthorized' });
    }

    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Form updated successfully',
      form: updatedForm
    });
  } catch (error) {
    console.error('Update form error:', error);
    res.status(500).json({ message: 'Failed to update form' });
  }
});

// Delete form
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, createdBy: req.user._id });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found or unauthorized' });
    }

    // Delete associated responses
    await Response.deleteMany({ formId: req.params.id });
    
    // Delete form
    await Form.findByIdAndDelete(req.params.id);

    res.json({ message: 'Form and all responses deleted successfully' });
  } catch (error) {
    console.error('Delete form error:', error);
    res.status(500).json({ message: 'Failed to delete form' });
  }
});

// Duplicate form
router.post('/:id/duplicate', authenticate, async (req, res) => {
  try {
    const originalForm = await Form.findOne({ _id: req.params.id, createdBy: req.user._id });
    
    if (!originalForm) {
      return res.status(404).json({ message: 'Form not found or unauthorized' });
    }

    const duplicatedForm = new Form({
      ...originalForm.toObject(),
      _id: undefined,
      title: `${originalForm.title} (Copy)`,
      status: 'draft',
      analytics: { views: 0, submissions: 0, completionRate: 0 },
      createdAt: undefined,
      updatedAt: undefined
    });

    await duplicatedForm.save();

    res.status(201).json({
      message: 'Form duplicated successfully',
      form: duplicatedForm
    });
  } catch (error) {
    console.error('Duplicate form error:', error);
    res.status(500).json({ message: 'Failed to duplicate form' });
  }
});

// Get form analytics
router.get('/:id/analytics', authenticate, async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, createdBy: req.user._id });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found or unauthorized' });
    }

    const responses = await Response.find({ formId: req.params.id });
    
    const analytics = {
      totalViews: form.analytics.views,
      totalSubmissions: responses.length,
      completionRate: form.analytics.views > 0 ? Math.round((responses.length / form.analytics.views) * 100) : 0,
      averageScore: responses.length > 0 ? Math.round(responses.reduce((acc, r) => acc + r.score, 0) / responses.length) : 0,
      submissionsOverTime: responses.reduce((acc, r) => {
        const date = r.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {}),
      questionAnalytics: form.questions.map(q => {
        const questionResponses = responses.map(r => 
          r.answers.find(a => a.questionId.toString() === q._id.toString())
        ).filter(Boolean);
        
        return {
          questionId: q._id,
          title: q.title,
          type: q.type,
          totalAnswers: questionResponses.length,
          correctAnswers: questionResponses.filter(a => a.isCorrect).length,
          averageTime: questionResponses.length > 0 ? 
            Math.round(questionResponses.reduce((acc, a) => acc + (a.timeSpent || 0), 0) / questionResponses.length) : 0
        };
      })
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

export default router;