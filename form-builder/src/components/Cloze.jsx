import React from "react";

export default function ClozeQuestion({ question, onChange, onDelete }) {
  const { title = "New Question", text = "", image } = question;

  const handleTitleChange = (e) => {
    onChange({ ...question, title: e.target.value });
  };

  const handleTextChange = (e) => {
    onChange({ ...question, text: e.target.value });
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onChange({ ...question, image: url });
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 w-full mt-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-lg font-semibold">Cloze</h2>
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
        <label className="block text-sm font-medium text-gray-700">
          Cloze text (use {"{{double braces}}"} for blanks)
        </label>

        <textarea
          rows="3"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
          placeholder="The capital of {{France}} is {{Paris}}."
          value={text}
          onChange={handleTextChange}
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Question Image</label>
        <label className="flex items-center justify-between border border-gray-300 rounded-md p-2 bg-gray-100 cursor-pointer text-sm text-gray-600 w-fit hover:bg-gray-200">
          Choose File
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        {image && (
          <img
            src={image}
            alt="Preview"
            className="mt-2 w-16 h-16 object-cover rounded border border-gray-300"
          />
        )}
      </div>
    </div>
  );
}
