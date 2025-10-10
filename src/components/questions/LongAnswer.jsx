import React from 'react';

function LongAnswer({ question, onChange }) {
  const updateText = (text) => {
    onChange({ ...question, text });
  };

  const updateAnswer = (answer) => {
    onChange({ ...question, answer });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-6">
      <div className="mb-4">
        <input
          type="text"
          value={question.text}
          onChange={(e) => updateText(e.target.value)}
          className="text-base sm:text-lg font-medium w-full focus:outline-none border-b border-gray-200 pb-2"
          placeholder="Enter your long answer question"
        />
      </div>

      <div className="mt-4">
        <textarea
          value={question.answer || ""}
          onChange={(e) => updateAnswer(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y bg-gray-50"
          rows="4"
          placeholder="Write your long answer here..."
        />
      </div>
    </div>
  );
}

export default LongAnswer;
