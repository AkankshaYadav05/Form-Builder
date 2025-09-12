import { useState } from "react";

export default function Dropdown({ question, onChange }) {
  const [newOption, setNewOption] = useState("");
  const [adding, setAdding] = useState(false);

  const addOption = () => {
    if (!newOption.trim()) return;
    const updated = {
      ...question,
      options: [...(question.options || []), newOption],
      selected: newOption, // auto select newly added
    };
    onChange(updated);
    setNewOption("");
    setAdding(false);
  };

  return (
    <div className="shadow-sm rounded-2xl p-4 bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Dropdown Selection</h3>
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">
          DROPDOWN
        </span>
      </div>

      {/* Normal dropdown */}
      {!adding ? (
        <>
          <p className="text-sm mb-2">Please select an option:</p>
          <select
            value={question.selected || ""}
            onChange={(e) => {
              if (e.target.value === "__add_new__") {
                setAdding(true);
              } else {
                onChange({ ...question, selected: e.target.value });
              }
            }}
            className="border rounded-lg px-3 py-2 text-sm w-75 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select an option...</option>
            {question.options?.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
            <option value="__add_new__">+ Add new</option>
          </select>
        </>
      ) : (
        /* Input to add new option */
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Enter new option"
            className="border rounded-lg px-3 py-2 text-sm w-100 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={addOption}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600"
          >
            Add
          </button>
          <button
            onClick={() => {
              setAdding(false);
              setNewOption("");
            }}
            className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
