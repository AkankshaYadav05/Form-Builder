import React from 'react';
import { Plus, X } from 'lucide-react';

function MCQ({ question, onChange }) {
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

  const selectOption = (index) => {
    onChange({ ...question, selected: index });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <input
          type="text"
          value={question.text}
          onChange={(e) => updateText(e.target.value)}
          className="text-lg font-medium w-full focus:outline-none border-b border-gray-200 pb-2"
          placeholder="Enter your multiple choice question"
        />
      </div>

      <div className="space-y-3 mb-4">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* ✅ clickable radio button */}
            <input
              type="radio"
              name={`mcq-${question.id || "default"}`}
              checked={question.selected === index}
              onChange={() => selectOption(index)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />

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

export default MCQ;
