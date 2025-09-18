import React from "react";
import { Plus, X, ChevronDown } from "lucide-react";

function Dropdown({ question, onChange }) {
  const updateText = (text) => {
    onChange({ ...question, text });
  };

  const updateOption = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    onChange({ ...question, options: newOptions });
  };

  const addOption = () => {
    onChange({
      ...question,
      options: [...question.options, `Option ${question.options.length + 1}`],
    });
  };

  const removeOption = (index) => {
    if (question.options.length > 1) {
      const newOptions = question.options.filter((_, i) => i !== index);
      onChange({ ...question, options: newOptions });
    }
  };

  const updateAnswer = (answer) => {
    onChange({ ...question, answer });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Question text */}
      <div className="mb-4">
        <input
          type="text"
          value={question.text}
          onChange={(e) => updateText(e.target.value)}
          className="text-lg font-medium w-full focus:outline-none border-b border-gray-200 pb-2"
          placeholder="Enter your dropdown question"
        />
      </div>

      {/* Dropdown preview */}
      <div className="mb-4">
        <div className="relative">
          <select
            value={question.answer || ""}
            onChange={(e) => updateAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-gray-50"
          >
            <option value="" disabled>
              Select an option...
            </option>
            {question.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Editable options list */}
      <div className="space-y-3 mb-4">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
            <input
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Option ${index + 1}`}
            />
            {question.options.length > 1 && (
              <button
                onClick={() => removeOption(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add option button */}
      <button
        onClick={addOption}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <Plus size={16} />
        Add Option
      </button>
    </div>
  );
}

export default Dropdown;
