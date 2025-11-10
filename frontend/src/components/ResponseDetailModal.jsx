import React from "react";
import { X, Star } from "lucide-react";

export default function ResponseDetailModal({ response, form, isOpen, onClose, responseIndex }) {
  if (!isOpen || !response) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl sm:max-w-2xl md:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Response #{responseIndex + 1}</h2>
            <p className="text-blue-100 mt-1 text-sm sm:text-base">{formatDate(response.submittedAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200 self-end sm:self-auto"
          >
            <X size={24} />
          </button>
        </div>

        {/* Questions & Answers */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[calc(90vh-140px)]">
          <div className="space-y-4 sm:space-y-6">
            {form?.questions?.map((question, index) => {
              const answerObj = response.answers.find(
                (a) =>
                  a.questionId === question.id ||
                  a.questionId === question._id ||
                  a.questionText === question.text
              );

              const answer = answerObj?.answer;

              return (
                <div
                  key={question.id || question._id || index}
                  className="border-l-4 border-blue-500 pl-4 sm:pl-6 py-3 sm:py-4 bg-gray-50 rounded-r-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-3 gap-1 sm:gap-0">
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                      Q{index + 1}: {question.text}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium self-start sm:self-auto">
                      {question.type}
                    </span>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                    {/* Rating Question */}
                    {question.type === "rating" && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex">
                          {Array.from({ length: question.scale || 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={
                                i < (answer || 0)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-gray-600 ml-2">
                          ({answer || 0}/{question.scale || 5})
                        </span>
                      </div>
                    )}

                    {/* Categorize Question */}
                    {question.type === "categorize" && (
                      <div className="space-y-3">
                        {answer && typeof answer === "object" ? (
                          Object.keys(answer).map((category, i) => (
                            <div key={i} className="bg-gray-50 p-3 rounded-lg border">
                              <p className="font-medium text-gray-800 mb-2">{category}</p>
                              {Array.isArray(answer[category]) && answer[category].length > 0 ? (
                                <ul className="list-disc ml-5 text-gray-700">
                                  {answer[category].map((item, j) => (
                                    <li key={j}>{item}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-500 italic">No items categorized here</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No categories found.</p>
                        )}
                      </div>
                    )}

                    {/* File Upload Question */}
                    {question.type === "file" && (
                      <div className="space-y-2">
                        {answer ? (
                          Array.isArray(answer) ? (
                            answer.map((file, i) => (
                              <a
                                key={i}
                                href={`https://form-builder-production-cee9.up.railway.app${file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {file.split("/").pop()}
                              </a>
                            ))
                          ) : (
                            <a
                              href={`https://form-builder-production-cee9.up.railway.app${answer}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {answer.split("/").pop()}
                            </a>
                          )
                        ) : (
                          <p className="text-gray-500 italic">No file uploaded</p>
                        )}
                      </div>
                    )}

                    {/* Other Question Types */}
                    {question.type !== "rating" && question.type !== "categorize" && question.type !== "file" && (
                      Array.isArray(answer) ? (
                        <div className="flex flex-wrap gap-2">
                          {answer.map((item, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-700 font-medium">
                          {answer || <span className="text-gray-400 italic">No answer provided</span>}
                        </p>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
