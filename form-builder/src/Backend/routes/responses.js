// routes/responses.js
import express from "express";
import Response from "../models/Response.js";
import Form from "../models/Form.js"; // optional for validation
import mongoose from "mongoose";

const router = express.Router();

// POST /api/forms/:id/responses  -> create a response for a form
router.post("/forms/:id/responses", async (req, res) => {
  try {
    const formId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ message: "Invalid form id" });
    }

    // optional: verify form exists
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    const { studentName, answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    const response = new Response({
      formId,
      studentName: studentName || null,
      answers
    });

    await response.save();
    res.status(201).json({ message: "Response saved", responseId: response._id });
  } catch (err) {
    console.error("Save response error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/forms/:id/responses -> list responses for a form
router.get("/forms/:id/responses", async (req, res) => {
  try {
    const formId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ message: "Invalid form id" });
    }
    const responses = await Response.find({ formId }).sort({ submittedAt: -1 });
    res.json(responses);
  } catch (err) {
    console.error("Fetch responses error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
