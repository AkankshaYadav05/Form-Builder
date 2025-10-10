import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';

function FileUpload({ question, onChange }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const updateText = (text) => {
    onChange({ ...question, text });
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadedFiles = [];

      for (let file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        uploadedFiles.push(res.data.filePath); // backend returns /uploads/filename
      }

      // Save uploaded file paths in question state
      onChange({ ...question, files: uploadedFiles });
    } catch (err) {
      console.error('Upload failed', err);
      alert('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-6 w-full">
      <div className="mb-4">
        <input
          type="text"
          value={question.text}
          onChange={(e) => updateText(e.target.value)}
          className="text-base sm:text-lg font-medium w-full focus:outline-none border-b border-gray-200 pb-2"
          placeholder="Enter your file upload question"
        />
      </div>

      <div
        onClick={openFileDialog}
        className={`cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center bg-gray-50 hover:bg-gray-100 transition min-h-[120px] sm:min-h-[160px] flex flex-col justify-center ${
          uploading ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <Upload size={28} className="mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600 text-sm sm:text-base">
          Drag and drop files here or click to browse
        </p>
        {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {question.files && question.files.length > 0 && (
        <ul className="mt-3 sm:mt-4 list-disc list-inside text-sm sm:text-base text-gray-700">
          {question.files.map((file, idx) => (
            <li key={idx}>
              <a href={`http://localhost:5000${file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {file.split('/').pop()}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileUpload;
