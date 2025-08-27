import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FormResponses() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [formTitle, setFormTitle] = useState("");

  // Fetch form details
  useEffect(() => {
    fetch(`http://localhost:5000/api/forms/${id}`)
      .then(res => res.json())
      .then(data => setFormTitle(data.title))
      .catch(err => console.error("Error fetching form details:", err));
  }, [id]);

  // Fetch form responses
  useEffect(() => {
    fetch(`http://localhost:5000/api/forms/${id}/responses`)
      .then(res => res.json())
      .then(data => setResponses(data))
      .catch(err => console.error("Error fetching responses:", err));
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Responses for: {formTitle || "Loading..."}
      </h1>
      {responses.length === 0 ? (
        <p className="text-gray-500">No responses yet.</p>
      ) : (
        <table className="border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Answers</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((r, i) => (
              <tr key={r._id}>
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">
                  {r.answers.map((ans, j) => (
                    <div key={j}>{String(ans.answer)}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
