import React from "react";
import { Calendar, Eye, Trash2 } from "lucide-react";

export default function ResponseCard({ response, index, onView, onDelete }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Response #{index + 1}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(response.submittedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(response)}
            className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <Eye size={14} />
            View
          </button>

          <button
            onClick={() => onDelete(response._id)}
            className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {response.answers &&
          response.answers.slice(0, 3).map((ans, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-gray-400 min-w-[20px]">Q{i + 1}:</span>
              <span className="text-gray-700 truncate">
                {Array.isArray(ans.answer)
                  ? ans.answer.join(", ")
                  : String(ans.answer || "No answer")}
              </span>
            </div>
          ))}
        {response.answers && response.answers.length > 3 && (
          <p className="text-sm text-blue-600">
            +{response.answers.length - 3} more answers
          </p>
        )}
      </div>
    </div>
  );
}
