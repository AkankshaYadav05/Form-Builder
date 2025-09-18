import React from 'react';

function ShortAnswer({ question, onChange }) {
  const updateText = (text) => {
    onChange({ ...question, text });
  };

  const updateAnswer = (answer) => {
    onChange({ ...question, answer });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <input
          type="text"
          value={question.text}
          onChange={(e) => updateText(e.target.value)}
          className="text-lg font-medium w-full focus:outline-none border-b border-gray-200 pb-2"
          placeholder="Enter your short answer question"
        />
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={question.answer || ""}
          onChange={(e) => updateAnswer(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          placeholder="Write your answer here..."
        />
      </div>
    </div>
  );
}

export default ShortAnswer;
