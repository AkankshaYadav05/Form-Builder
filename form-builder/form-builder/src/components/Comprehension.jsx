import React from "react";

export default function ComprehensionQuestion({ question, onChange, onDelete }) {
  const { title = "New Question", passage = "", subQuestions = [{ text: "", image: null }]} = question;

  const handleTitleChange = (e) => {
    onChange({ ...question, title: e.target.value });
  };

  const handlePassageChange = (e) => {
    onChange({ ...question, passage: e.target.value });
  };

  const handleSubQuestionChange = (index, updatedSubQ) => {
    const newSubQuestions = [...subQuestions];
    newSubQuestions[index] = updatedSubQ;
    onChange({ ...question, subQuestions: newSubQuestions });
  };

  const addSubQuestion = () => {
    onChange({ ...question, subQuestions: [...subQuestions, { text: "", image: null }] });
  };

  const removeSubQuestion = (index) => {
    const newSubQuestions = subQuestions.filter((_, i) => i !== index);
    onChange({ ...question, subQuestions: newSubQuestions });
  };

  const handleSubQuestionTextChange = (index, e) => {
    const newSubQuestions = [...subQuestions];
    newSubQuestions[index].text = e.target.value;
    onChange({ ...question, subQuestions: newSubQuestions });
  };

  const handleSubQuestionImageChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      const newSubQuestions = [...subQuestions];
      newSubQuestions[index].image = url;
      onChange({ ...question, subQuestions: newSubQuestions });
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 w-full mt-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-lg font-semibold">Comprehension</h2>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700 font-medium">
          Remove
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Passage</label>
        <textarea
          rows="4"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
          placeholder="Write or paste the passage here."
          value={passage}
          onChange={handlePassageChange}
        ></textarea>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Questions</h3>
        {subQuestions.map((subQ, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-md border border-gray-300 mb-3 relative"
          >
            {subQuestions.length > 1 && (
              <button
                className="absolute top-2 right-2 text-red-500 text-sm"
                onClick={() => removeSubQuestion(index)}
              >
                ✕
              </button>
            )}

            <input
              type="text"
              placeholder="Enter question"
              className="block w-full border border-gray-300 rounded-md p-2 text-sm mb-3 focus:ring focus:ring-blue-200 focus:border-blue-400"
              value={subQ.text}
              onChange={(e) => handleSubQuestionTextChange(index, e)}
            />

            <label className="flex items-center justify-between border border-gray-300 rounded-md p-2 bg-gray-100 cursor-pointer text-sm text-gray-600 w-fit hover:bg-gray-200">
              Choose File
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleSubQuestionImageChange(index, e)}
              />
            </label>

            {subQ.image && (
              <img
                src={subQ.image}
                alt="Preview"
                className="mt-2 w-16 h-16 object-cover rounded border border-gray-300"
              />
            )}
          </div>
        ))}
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
          onClick={addSubQuestion}
        >
          + Add Sub-question
        </button>
      </div>
    </div>
  );
}
