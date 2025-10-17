import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuestionRenderer } from '../components/QuestionRenderer';
import { LoadingScreen, SuccessScreen, FormHeader, SubmitButton } from '../components/FormScreens';

export default function FillForm() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadForm = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/forms/${formId}`);
        if (!response.ok) throw new Error('Form not found');
        const formData = await response.json();
        setForm(formData);
      } catch (error) {
        console.error('Error loading form:', error);
        setForm(null);
      }
    };
    if (formId) loadForm();
  }, [formId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: false }));
  };

  const validateAll = () => {
    let valid = true;
    const newErrors = {};
    form.questions.forEach((question) => {
      const answer = answers[question.id];
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        newErrors[question.id] = true;
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;

    setIsSubmitting(true);

    try {
      const answersArray = form.questions.map((q) => ({
        questionId: q._id,
        subQuestionId: q.subQuestionId || q._id,
        question: q.text,
        answer: answers[q.id] || '',
      }));

      const response = await fetch(`http://localhost:5000/api/responses/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: form._id, answers: answersArray }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert(data.message || 'Failed to submit form.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      alert('Failed to submit form. Check console for details.');
    }
  };

  if (!form) {
    return <LoadingScreen />;
  }

  if (showSuccess) {
    return <SuccessScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 sm:py-8 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <FormHeader title={form.title} description={form.description} />

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100">
            {form.questions.map((question) => (
              <QuestionRenderer
                key={question.id}
                question={question}
                answer={answers[question.id]}
                hasError={errors[question.id]}
                onChange={(value) => handleAnswerChange(question.id, value)}
              />
            ))}

            <SubmitButton isSubmitting={isSubmitting} onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
