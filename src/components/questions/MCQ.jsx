import { X } from "lucide-react";

function MCQ({ question, onChange }) {
  const updateOption = (idx, val) => {
    const updated = { ...question, options: [...question.options] };
    updated.options[idx] = val;
    onChange(updated);
  };

  const addOption = () => {
    onChange({ ...question, options: [...question.options, ""] });
  };

  const removeOption = (idx) => {
    const updated = {
      ...question,
      options: question.options.filter((_, i) => i !== idx),
    };
    // if removed option was correct answer, reset correctAnswer
    if (question.correctAnswer === idx) {
      updated.correctAnswer = null;
    }
    onChange(updated);
  };

  const selectCorrectAnswer = (idx) => {
    onChange({ ...question, correctAnswer: idx });
  };

  return (
    <div className="rounded-2xl p-4 shadow-sm bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Multiple Choice Question</h3>
        <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-md">
          MCQ
        </span>
      </div>

      {/* Question Input */}
      <input
        type="text"
        placeholder="Enter your question"
        value={question.text}
        onChange={(e) => onChange({ ...question, text: e.target.value })}
        className="w-150 border-b text-gray-800 text-sm py-2 mb-4 focus:outline-none focus:border-indigo-500"
      />

      {/* Options with Radio Buttons */}
      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            {/* Radio button to select correct answer */}
            <input
              type="radio"
              name={`mcq-${question.id || "preview"}`}
              checked={question.correctAnswer === idx}
              onChange={() => selectCorrectAnswer(idx)}
              className="text-indigo-600"
            />

            {/* Option input */}
            <input
              type="text"
              value={opt}
              onChange={(e) => updateOption(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className="flex-1 w-150 px-3 text-sm border-b-0 border-gray-300 bg-transparent focus:outline-none focus:border-b 
                        focus:border-indigo-150 hover:border-b hover:border-indigo-150 placeholder-gray-150 transition-all" />

            {/* Delete option */}
            <button
              type="button"
              onClick={() => removeOption(idx)}
              className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
              title="Delete option"
            >
              <X size={18} />
            </button>
          </div>
        ))}

        {/* Add Option */}
        <button
          type="button"
          onClick={addOption}
          className="text-indigo-600 text-sm font-medium hover:underline mt-2"
        >
          + Add Option
        </button>
      </div>
    </div>
  );
}

export default MCQ;
