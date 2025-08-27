export default function RenderQuestion({ question, answers, setAnswers }) {
  const handleChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const renderInput = (q) => {
    // --- Handle MCQ ---
    if (q.type === "mcq" && Array.isArray(q.options)) {
      return q.options.map((opt, i) => (
        <div key={i} className="flex items-center mb-1">
          <input
            type="radio"
            name={q._id}
            value={opt}
            checked={answers[q._id] === opt}
            onChange={() => handleChange(q._id, opt)}
          />
          <span className="ml-2">{opt}</span>
        </div>
      ));
    }

    // --- Handle Fill-in-the-blank / Short ---
    if (q.type === "fill" || q.type === "short") {
      return (
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={answers[q._id] || ""}
          onChange={(e) => handleChange(q._id, e.target.value)}
        />
      );
    }

    // --- Handle Cloze ---
    if (q.type === "cloze") {
      return (
        <textarea
          className="border p-2 rounded w-full"
          value={answers[q._id] || ""}
          placeholder="Fill in the missing text..."
          onChange={(e) => handleChange(q._id, e.target.value)}
        />
      );
    }

    // --- Handle Categorize ---
    if (q.type === "categorize" && Array.isArray(q.categories)) {
      return (
        <select
          className="border p-2 rounded"
          value={answers[q._id] || ""}
          onChange={(e) => handleChange(q._id, e.target.value)}
        >
          <option value="">Select a category</option>
          {q.categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      );
    }

    return <p className="text-gray-400 italic">Unsupported question type</p>;
  };

  return (
    <div className="p-4 border rounded-md mb-4 bg-gray-50">
      {/* Question Title */}
      <h2 className="text-xl font-semibold mb-2">{question.title}</h2>

      {/* If comprehension type, show passage + subQuestions */}
      {question.type === "comprehension" && question.passage && (
        <p className="mb-3 text-gray-700 whitespace-pre-line">{question.passage}</p>
      )}

      {/* If comprehension has subQuestions */}
      {question.type === "comprehension" && Array.isArray(question.subQuestions) ? (
        question.subQuestions.map((subQ) => (
          <div key={subQ._id} className="ml-4 mb-4">
            <label className="block font-medium mb-1">{subQ.question}</label>
            {renderInput(subQ)}
          </div>
        ))
      ) : (
        // If not comprehension, render the question directly
        <div className="mt-2">{renderInput(question)}</div>
      )}

    </div>
  );
}
