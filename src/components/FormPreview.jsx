import React from 'react';
import { Star } from 'lucide-react';

function FormPreview({ title, description, questions, currentTheme }) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-8 border border-gray-200"
      style={{ backgroundColor: currentTheme.colors.secondary }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {index + 1}. {question.text || "Untitled Question"}
              </h3>
              
              {question.type === 'mcq' && (
                <div className="space-y-2">
                  {question.options?.map((option, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name={`q${index}`} className="text-blue-600" />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {question.type === 'checkbox' && (
                <div className="space-y-2">
                  {question.options?.map((option, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="text-blue-600 rounded" />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {question.type === 'short' && (
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your answer..."
                />
              )}
              
              {question.type === 'long' && (
                <textarea 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Your answer..."
                />
              )}
              
              {question.type === 'rating' && (
                <div className="flex gap-2">
                  {Array.from({ length: question.scale || 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={24}
                      className="text-gray-300 hover:text-yellow-400 cursor-pointer transition duration-200"
                    />
                  ))}
                </div>
              )}
              
              {question.type === 'dropdown' && (
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Select an option...</option>
                  {question.options?.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
        
        {questions.length > 0 && (
          <div className="mt-8 text-center">
            <button 
              className="px-8 py-3 rounded-lg text-white font-medium transition duration-200"
              style={{ backgroundColor: currentTheme.colors.primary }}
              onSubmit={() => navigate("/forms")}
            >
              Submit Form
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormPreview;