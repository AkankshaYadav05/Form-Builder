export default function CheckboxQuestion({ question, onChange }) {
  const updateOption = (idx, val) => {
    const updated = [...question.options];
    updated[idx] = val;
    onChange({ ...question, options: updated });
  };

  return (
    <div className="border border-dashed rounded-2xl p-4 bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Checkbox Question</h3>
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">
          CHECKBOX
        </span>
      </div>

      <p className="text-sm mb-2">Select all that apply:</p>
      {question.options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <input type="checkbox" disabled />
          <input
            type="text"
            value={opt}
            onChange={(e) => updateOption(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
            className="border rounded-lg px-3 py-1 text-sm flex-1"
          />
        </div>
      ))}
    </div>
  );
}
