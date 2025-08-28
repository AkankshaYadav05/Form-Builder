export default function Dropdown({ question, onChange }) {
  return (
    <div className="shadow-sm rounded-2xl p-4 bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Dropdown Selection</h3>
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">
          DROPDOWN
        </span>
      </div>

      <p className="text-sm mb-2">Please select an option:</p>
      <select
        value={question.selected || ""}
        onChange={(e) => onChange({ ...question, selected: e.target.value })}
        className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-blue-500"
      >
        <option value="">Select an option...</option>
        {question.options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
