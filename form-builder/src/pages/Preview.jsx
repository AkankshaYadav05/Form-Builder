import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;

  const handleSubmit = async () => {
    try {
      if (!formData) {
        alert("No form data to submit!");
        return;
      }
      console.log("Submitting form data:", formData);
      const res = await axios.post("http://localhost:5000/api/forms", formData);
      console.log("Server response:", res.data);
      alert("Form saved successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error saving form:", error);
      alert(
        error.response?.data?.message || 
        "Failed to save form. Please check console or backend."
      );
    }
  };
    if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h2 className="text-2xl font-bold mb-6">Untitled Form</h2>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
        >
          Submit
        </button>
      </div>
    );
  }

  function renderClozeText(text) {
  // Split by {{...}} and keep the delimiters with a regex
  const parts = text.split(/(\{\{.*?\}\})/g);

  return parts.map((part, i) => {
    if (part.startsWith("{{") && part.endsWith("}}")) {
      return (
        <input
          key={i}
          type="text"
          placeholder="..."
          className="inline-block border-b border-gray-400 w-20 mx-1 focus:outline-none focus:ring-1 focus:ring-indigo-600"
        />
      );
    } else {
      return <span key={i}>{part}</span>;
    }
  });
}


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-start-2 col-span-10">
          {/* Header card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {formData.image && (
              <img
                src={formData.image}
                alt="Form banner"
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">
                {formData.title || "Untitled Form"}
              </h1>
              {formData.description && (
                <p className="text-gray-700">{formData.description}</p>
              )}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
             {formData.questions?.length ? (
    formData.questions.map((q, i) => (
      <div
        key={q.id || i}
        className="bg-white p-6 rounded-lg shadow border border-gray-200"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Q{i + 1}: {q.title?.trim() || "Untitled Question"}
        </h2>

        {/* Comprehension question */}
        {q.type === "comprehension" && q.passage && (
          <p className="text-gray-700 whitespace-pre-line">{q.passage}</p>
        )}

        {/* Cloze question: replace {{word}} with input box */}
        {q.type === "cloze" && q.text && (
          <p className="text-gray-700">
            {q.text.split(/({{.*?}})/g).map((part, idx) => {
              if (part.startsWith("{{") && part.endsWith("}}")) {
                return (
                  <input
                    key={idx}
                    type="text"
                    placeholder="______"
                    className="border-b border-gray-400 w-20 mx-1 inline-block focus:outline-none focus:border-black"
                  />
                );
              }
              return part;
            })}
          </p>
        )}

        {/* Categorize question: show categories and items */}
        {q.type === "categorize" && (
          <>
            <div className="mb-2">
              <strong>Categories:</strong>{" "}
              {q.categories?.length ? q.categories.join(", ") : "None"}
            </div>
            <div>
              <strong>Items:</strong>{" "}
              {q.items?.length ? q.items.join(", ") : "None"}
            </div>
          </>
        )}

        {/* Question Image with improved styling */}
        {q.image && (
          <img
            src={q.image}
            alt={`Question ${i + 1} illustration`}
            className="mt-4 rounded border border-gray-300"
            style={{ maxHeight: "120px", width: "auto", objectFit: "contain" }}
          />
        )}
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500">No questions added yet.</p>
  )}
  </div>

          {/* Submit button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
