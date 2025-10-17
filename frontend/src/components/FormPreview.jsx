import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function FormPreview({ title, description, questions, currentTheme }) {
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with responses:', responses);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setResponses({});
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Thank you!</h2>
        <p className="text-gray-600 text-sm sm:text-base">Your response has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="p-6 sm:p-8 border-b-4"
        style={{
          backgroundColor: currentTheme.colors.secondary,
          borderColor: currentTheme.colors.primary
        }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
          {title}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <div className="space-y-6 sm:space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
              <label className="block text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">
                {index + 1}. {question.text}
              </label>

              {question.type === 'mcq' && (
                <div className="space-y-2">
                  {question.options?.map((option, idx) => (
                    <label key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                        className="w-4 h-4"
                        style={{ accentColor: currentTheme.colors.primary }}
                        aria-checked={responses[question.id] === option}
                      />
                      <span className="text-sm sm:text-base text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'checkbox' && (
                <div className="space-y-2">
                  {question.options?.map((option, idx) => (
                    <label key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        value={option}
                        onChange={(e) => {
                          const current = responses[question.id] || [];
                          if (e.target.checked) {
                            handleResponseChange(question.id, [...current, option]);
                          } else {
                            handleResponseChange(question.id, current.filter(v => v !== option));
                          }
                        }}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: currentTheme.colors.primary }}
                      />
                      <span className="text-sm sm:text-base text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'short' && (
                <input
                  type="text"
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                  placeholder="Your answer"
                />
              )}

              {question.type === 'long' && (
                <textarea
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition resize-none text-sm sm:text-base"
                  placeholder="Your answer"
                  rows="4"
                />
              )}

              {question.type === 'dropdown' && (
                <select
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                >
                  <option value="">Select an option</option>
                  {question.options?.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              )}

              {question.type === 'rating' && (
                <div className="flex gap-2 flex-wrap">
                  {[...Array(question.scale || 5)].map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleResponseChange(question.id, idx + 1)}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 transition font-medium text-sm sm:text-base"
                      style={{
                        borderColor: responses[question.id] === idx + 1 ? currentTheme.colors.primary : '#d1d5db',
                        backgroundColor: responses[question.id] === idx + 1 ? currentTheme.colors.primary : 'white',
                        color: responses[question.id] === idx + 1 ? 'white' : '#6b7280'
                      }}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}

              {question.type === 'date' && (
                <input
                  type="date"
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                />
              )}

              {question.type === 'time' && (
                <input
                  type="time"
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                />
              )}

              {question.type === 'file' && (
                <input
                  type="file"
                  onChange={(e) => handleResponseChange(question.id, e.target.files[0])}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                />
              )}

              {question.type === 'categorize' && (
                <div className="space-y-4">
                  {question.items?.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span className="text-sm sm:text-base text-gray-700 min-w-[100px]">{item}</span>
                      <select
                        onChange={(e) => {
                          const current = responses[question.id] || {};
                          handleResponseChange(question.id, { ...current, [item]: e.target.value });
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                      >
                        <option value="">Select category</option>
                        {question.categories?.map((cat, catIdx) => (
                          <option key={catIdx} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </form>
    </div>
  );
}
