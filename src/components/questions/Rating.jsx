import React from "react";

export default function Rating({ question, onChange }) {
  const text = question.text || "";
  const scale = question.scale || 5;
  const answer = question.answer || null;

  const handleTextChange = (e) => {
    onChange({ ...question, text: e.target.value });
  };

  const handleRatingClick = (value) => {
    onChange({ ...question, answer: value });
  };

  return (
    <div className="shadow-sm rounded-2xl p-4 bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Rating</h3>
        <span className="bg-yellow-50 text-yellow-600 text-xs px-2 py-1 rounded-md">
          RATING
        </span>
      </div>

      {/* Question Input */}
      <input
        type="text"
        placeholder="Enter your rating question..."
        value={text}
        onChange={handleTextChange}
        className="w-100 border-b px-3 py-2 mb-3 text-sm focus:outline-none focus:border-purple-500"
      />

      {/* Rating Buttons */}
      <div className="flex gap-2 mt-2">
        {Array.from({ length: scale }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            onClick={() => handleRatingClick(value)}
            className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-medium transition ${
              answer === value
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
