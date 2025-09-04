import { X } from "lucide-react";

function CheckboxQuestion({ question, onChange }) {
  const options = Array.isArray(question.options) ? question.options : [];

  const normalizeSelected = () => {
    const ans = question.answer;
    if (!Array.isArray(ans)) return [];
    if (ans.every((v) => typeof v === "number")) return ans;

    return ans
      .map((val) => options.indexOf(val))
      .filter((idx) => idx !== -1);
  };

  const selected = normalizeSelected();

  const updateOption = (idx, val) => {
    const nextOptions = [...options];
    nextOptions[idx] = val;
    onChange({ ...question, options: nextOptions });
  };

  const addOption = () => {
    onChange({ ...question, options: [...options, ""] });
  };

  const removeOption = (idxToRemove) => {
    const nextOptions = options.filter((_, i) => i !== idxToRemove);
    const nextSelected = selected
      .filter((i) => i !== idxToRemove)
      .map((i) => (i > idxToRemove ? i - 1 : i));

    onChange({
      ...question,
      options: nextOptions,
      answer: nextSelected,
    });
  };

  const toggleSelect = (idx) => {
    const nextSelected = selected.includes(idx)
      ? selected.filter((i) => i !== idx)
      : [...selected, idx];

    onChange({ ...question, answer: nextSelected });
  };

  return (
    <div className="rounded-2xl p-4 shadow-sm bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Checkbox Question</h3>
        <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-md">
          CHECKBOX
        </span>
      </div>

      {/* Question Input */}
      <input
        type="text"
        placeholder="Enter your question"
        value={question.text || ""}
        onChange={(e) => onChange({ ...question, text: e.target.value })}
        className="w-full border-b text-gray-800 text-sm py-2 mb-4 focus:outline-none focus:border-green-500"
      />

      {/* Options */}
      <div className="space-y-3">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selected.includes(idx)}
              onChange={() => toggleSelect(idx)}
              className="text-green-600"
            />

            {/* Option input */}
            <input
              type="text"
              value={opt}
              onChange={(e) => updateOption(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className="flex-1 px-3 text-sm border-b border-gray-300 bg-transparent 
                         focus:outline-none focus:border-green-400 
                         hover:border-green-300 placeholder-gray-400 transition-all"
            />

            {/* Delete button */}
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
          className="text-green-600 text-sm font-medium hover:underline mt-2"
        >
          + Add Option
        </button>
      </div>
    </div>
  );
}

export default CheckboxQuestion;
