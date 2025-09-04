import React from "react";

export default function LongAnswer({ question, onChange }) {
  const answer = question.answer || "";
  const text = question.text || "";

  const handleTextChange = (e) => {
    onChange({ ...question, text: e.target.value });
  };

  const handleAnswerChange = (e) => {
    onChange({ ...question, answer: e.target.value });
  };

  return (
    <div className="shadow-sm rounded-2xl p-4 bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Long Answer</h3>
        <span className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-md">
          LONG-ANSWER
        </span>
      </div>

      {/* Question Input */}
      <input
        type="text"
        placeholder="Enter your question..."
        value={text}
        onChange={handleTextChange}
        className="w-150 border-b px-3 py-2 mb-3 text-sm focus:outline-none focus:border-purple-500"
      />

      {/* Answer Textarea */}
      <textarea
        placeholder="Write your detailed answer here..."
        value={answer}
        onChange={handleAnswerChange}
        rows={6}
        className="w-200 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 resize-y"
      />
    </div>
  );
}
