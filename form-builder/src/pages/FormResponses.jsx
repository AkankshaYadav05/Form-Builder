import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FormResponses() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [questionsCount, setQuestionsCount] = useState(0);

  // Fetch form details
  useEffect(() => {
    fetch(`http://localhost:5000/api/forms/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormTitle(data.title);
        setQuestionsCount(data.questions?.length || 0);
      })
      .catch(err => console.error("Error fetching form details:", err));
  }, [id]);

  // Fetch form responses
  useEffect(() => {
    fetch(`http://localhost:5000/api/forms/${id}/responses`)
      .then(res => res.json())
      .then(data => setResponses(data))
      .catch(err => console.error("Error fetching responses:", err));
  }, [id]);

  // Summary stats
  const totalResponses = responses.length;
  const avgScore =
    totalResponses > 0
      ? Math.round(
          responses.reduce((acc, r) => acc + (r.score || 0), 0) / totalResponses
        )
      : 0;
  const passingGrades = responses.filter(r => (r.score || 0) >= 50).length;

  // Format timestamp
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {formTitle || "Loading..."}
      </h1>

      {/* Summary section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{totalResponses}</p>
          <p className="text-gray-500">Total Responses</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{questionsCount}</p>
          <p className="text-gray-500">Questions</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{avgScore}%</p>
          <p className="text-gray-500">Avg Score</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{passingGrades}</p>
          <p className="text-gray-500">Passing Grades</p>
        </div>
      </div>

      {/* Responses list */}
      {responses.length === 0 ? (
        <p className="text-gray-500">No responses yet.</p>
      ) : (
        <div className="space-y-6">
          {responses.map((res, i) => (
            <div
              key={res._id}
              className="bg-white rounded-lg shadow border border-gray-200 p-6"
            >
              {/* Response Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Response #{i + 1}
                </h2>
                <div className="flex items-center gap-3 mt-2 md:mt-0">
                  <p className="text-sm text-gray-500">
                    {formatDate(res.submittedAt)}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      res.score >= 50
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    Score: {res.score || 0}%
                  </span>
                </div>
              </div>

              {/* Answers */}
              <div className="space-y-4">
                {res.answers.map((ans, j) => (
                  <div key={j} className="border-l-4 pl-4 py-2 border-gray-300">
                    <p className="font-medium text-gray-800">
                      Q{j + 1}: {ans.question}
                      <span className="ml-2 text-sm text-gray-500">
                        ({ans.type})
                      </span>
                    </p>
                    <p
                      className={`mt-1 ${
                        ans.isCorrect
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }`}
                    >
                      Answer: {String(ans.answer)}{" "}
                      {ans.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
