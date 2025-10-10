import React, { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";

function MCQ({ question, onChange }) {
  const [dragIndex, setDragIndex] = useState(null);

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

  // ✅ Drag handlers
  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === index) return;
    const newOptions = [...question.options];
    const dragged = newOptions[dragIndex];
    newOptions.splice(dragIndex, 1);
    newOptions.splice(index, 0, dragged);
    setDragIndex(index);
    onChange({ ...question, options: newOptions });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-6">
      {/* Question text */}
      <div className="mb-4">
        <input
          type="text"
          value={question.text}
          onChange={(e) => updateText(e.target.value)}
          className="text-base sm:text-lg sm:text-lg font-medium w-full focus:outline-none border-b border-gray-200 pb-2"
          placeholder="Enter your multiple choice question"
        />
      </div>

      {/* Options */}
      <div className="space-y-2 sm:space-y-3 mb-4">
        {question.options.map((option, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            className="flex items-center gap-2 sm:gap-3 w-full cursor-move"
          >
            {/* Drag handle */}
            <GripVertical className="text-gray-400 flex-shrink-0" size={18} />

            {/* Radio */}
            <input
              type="radio"
              name={`mcq-${question.id || "default"}`}
              checked={question.selected === index}
              onChange={() => selectOption(index)}
              className="w-3 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 flex-shrink-0"
            />

            {/* Option input */}
            <input
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder={`Option ${index + 1}`}
            />

            {/* Delete button */}
            {question.options.length > 1 && (
              <button
                onClick={() => removeOption(index)}
                className="flex-shrink-0 text-red-500 hover:text-red-700 p-0.5"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Option */}
      <button
        onClick={addOption}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
      >
        <Plus size={16} />
        Add Option
      </button>
    </div>
  );
}

export default MCQ;
