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
    const updated = { ...question, options: question.options.filter((_, i) => i !== idx) };
    onChange(updated);
  };

  return (
    <div className="border border-dashed rounded-2xl p-4 shadow-sm bg-white">
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
        className="w-full border-b text-gray-800 text-sm py-2 mb-4 focus:outline-none focus:border-indigo-500"
      />

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={opt}
              onChange={(e) => updateOption(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => removeOption(idx)}
              className="text-red-500 hover:text-red-600"
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
