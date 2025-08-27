import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RenderQuestion from "../components/RenderQuestion";

export default function FillForm() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({}); // { subQId: "answer" }

  useEffect(() => {
    fetch(`http://localhost:5000/api/forms/${formId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched form:", data);
        setForm(data);
        setAnswers({});
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [formId]);

  // subQuestion-based change handler
  const handleChange = (subQuestionId, value) => {
    setAnswers((prev) => ({ ...prev, [subQuestionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // build answers with both questionId + subQuestionId
    const answersArray = Object.entries(answers).map(([subQId, answer]) => {
      const q = form.questions.find(q =>
        q.subQuestions.some(sq => sq._id === subQId)
      );
      const subQ = q.subQuestions.find(sq => sq._id === subQId);

      return {
        questionId: q._id,
        subQuestionId: subQId,
        answer
      };
    });

    try {
      const res = await fetch(`http://localhost:5000/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, answers: answersArray }),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Error:", errData);
        return;
      }

      const data = await res.json();
      console.log("Response saved:", data);

      alert("Response submitted successfully!");
      navigate(`/responses/${data.response._id}`); // if you want to show result page
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  if (!form) return <p className="text-center p-6">Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow-md rounded-xl"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800">
        {form.title}
      </h1>
      <p className="text-center text-gray-500 mb-4">{form.description}</p>

      {form.questions.length > 0 ? (
        form.questions.map((q, index) => (
          <RenderQuestion
            key={q._id}
            question={q}
            answers={answers}
            setAnswers={setAnswers}
          />
        ))
      ) : (
        <p className="text-center text-red-600">
          This form has no questions configured.
        </p>
      )}

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
