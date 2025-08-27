import express from 'express';
import Form from '../models/Form.js';

const router = express.Router();

// POST /api/forms
router.post('/', async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/forms/:id
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//PUT
router.put('/:id', async (req, res) => {
  try {
    const updatedForm = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedForm);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/forms/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Form.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Form not found' });
    res.status(200).json({ message: 'Form deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { formId, answers } = req.body;
    const response = new Response({ formId, answers });
    await response.save();
    res.status(201).json({ message: 'Response saved', response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
