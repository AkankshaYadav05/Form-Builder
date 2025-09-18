import React from 'react';
import { Clock } from 'lucide-react';

function Time({ question, onChange }) {
  const updateText = (text) => {
    onChange({ ...question, text });
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
          className="text-lg font-medium w-75 focus:outline-none border-b border-gray-200 pb-2"
          placeholder="Enter your time question"
        />
      </div>

      {/* Time input */}
      <div className="mt-4 relative">
        <input
          type="time"
          value={question.answer || ""}
          onChange={(e) => updateAnswer(e.target.value)}
          className="w-75 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        />
      </div>
    </div>
  );
}

export default Time;
