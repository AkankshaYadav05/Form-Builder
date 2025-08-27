import express from 'express';
import Form from '../models/Form.js';
import Response from "../models/Response.js";

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


router.post("/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const submittedAnswers = req.body.answers; // [{ questionId, answer }]

    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    let score = 0;

    const answers = form.questions.map((q) => {
      const userAnsObj = submittedAnswers.find(
        (a) => a.questionId === q._id.toString()
      );
      const userAnswer = userAnsObj ? userAnsObj.answer : "";

      let isCorrect = false;

      switch (q.type) {
        case "text":
        case "mcq":
          isCorrect =
            userAnswer?.toString().trim().toLowerCase() ===
            q.correctAnswer?.toString().trim().toLowerCase();
          break;

        case "cloze":
          {
            const expected = Array.isArray(q.correctAnswer)
              ? q.correctAnswer.map((s) => s?.trim().toLowerCase())
              : [String(q.correctAnswer ?? "").trim().toLowerCase()];

            const given = Array.isArray(userAnswer)
              ? userAnswer.map((s) => s?.trim().toLowerCase())
              : [String(userAnswer ?? "").trim().toLowerCase()];

            isCorrect =
              expected.length === given.length &&
              expected.every((exp, i) => exp === given[i]);
          }
          break;

        case "categorize":
          {
            const expectedMap = q.correctAnswer || {}; // { item: category }
            isCorrect = Object.keys(expectedMap).every((item) => {
              const expectedCat = expectedMap[item];
              const givenCat = userAnswer?.[item];
              return (
                givenCat &&
                givenCat.toString().trim().toLowerCase() ===
                  expectedCat.toString().trim().toLowerCase()
              );
            });
          }
          break;

        default:
          // if unknown type, mark as incorrect
          isCorrect = false;
      }

      if (isCorrect) score++;

      return {
        questionId: q._id,
        question: q.title,
        type: q.type,
        answer: userAnswer,
        isCorrect,
      };
    });

    const percentageScore = Math.round(
      (score / form.questions.length) * 100
    );

    const response = new Response({
      formId: id,
      answers,
      score: percentageScore,
      submittedAt: new Date(),
    });

    await response.save();
    res.status(201).json(response);
  } catch (err) {
    console.error("Error saving response:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
