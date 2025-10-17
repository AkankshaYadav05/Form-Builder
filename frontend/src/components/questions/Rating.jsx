import React from 'react';
import { Star } from 'lucide-react';

function Rating({ question, onChange }) {
  const updateText = (text) => {
    onChange({ ...question, text });
  };

  const updateScale = (scale) => {
    onChange({ ...question, scale: parseInt(scale), rating: 0 }); // reset rating if scale changes
  };

  const updateRating = (rating) => {
    onChange({ ...question, rating });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-6">
      <div className="mb-4">
        <input
          type="text"
          value={question.text}
          onChange={(e) => updateText(e.target.value)}
          className="text-base sm:text-lg font-medium w-full focus:outline-none border-b border-gray-200 pb-2"
          placeholder="Enter your rating question"
        />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-gray-600">Scale:</span>
        <select
          value={question.scale}
          onChange={(e) => updateScale(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="3">1-3</option>
          <option value="5">1-5</option>
          <option value="7">1-7</option>
          <option value="10">1-10</option>
        </select>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: question.scale }, (_, index) => {
          const starNumber = index + 1;
          return (
            <Star
              key={index}
              size={28}
              onClick={() => updateRating(starNumber)}
              className={`cursor-pointer transition duration-200 ${
                starNumber <= (question.rating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Rating;
