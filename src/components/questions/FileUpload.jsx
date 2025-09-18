import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

function FileUpload({ question, onChange }) {
  const fileInputRef = useRef(null);

  const updateText = (text) => {
    onChange({ ...question, text });
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    onChange({ ...question, files });
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <input
          type="text"
          value={question.text}
          onChange={(e) => updateText(e.target.value)}
          className="text-lg font-medium w-full focus:outline-none border-b border-gray-200 pb-2"
          placeholder="Enter your file upload question"
        />
      </div>

      {/* Upload area */}
      <div
        onClick={openFileDialog}
        className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition"
      >
        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600">Drag and drop files here or click to browse</p>
        <p className="text-sm text-gray-500 mt-1">Supports various file formats</p>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Show selected files */}
      {question.files && question.files.length > 0 && (
        <ul className="mt-4 list-disc list-inside text-sm text-gray-700">
          {question.files.map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileUpload;
