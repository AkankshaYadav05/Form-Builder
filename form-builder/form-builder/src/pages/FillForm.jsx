// src/pages/FillForm.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function FillForm() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5000/api/forms/${formId}`)
      .then(res => res.json())
      .then(data => {
        setForm(data);
        setAnswers({});
      });
  }, [formId]);

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert {questionId: value} → [{questionId, answer}]
    const answersArray = Object.keys(answers).map(qId => ({
      questionId: qId,
      answer: answers[qId]
    }));

    try {
      const res = await fetch(`http://localhost:5000/api/forms/${formId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId,
          answers: answersArray
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Error:", errData);
        return;
      }

      alert("Response submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      {form.questions?.map((q, index) => (
        <div key={q._id} className="mb-4">
          <label className="block mb-1">{q.title}</label>
          <input
            type="text"
            className="border p-2 w-full"
            onChange={(e) => handleChange(q._id, e.target.value)}
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
