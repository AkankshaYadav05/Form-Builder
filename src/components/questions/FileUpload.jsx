import { useState } from "react";

export default function FileUpload({ question }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      if (!allowedTypes.includes(selected.type)) {
        alert("Only PDF, DOC, DOCX files are allowed.");
        return;
      }
      setFile(selected);
    }
  };

  return (
    <div className="shadow-sm rounded-2xl p-4 bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">File Upload</h3>
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">
          FILE-UPLOAD
        </span>
      </div>

      <p className="text-sm mb-2">Please upload your file</p>

      <label
        htmlFor="file-input"
        className="w-200 h-25 border border-dashed rounded-lg p-6 text-center text-sm text-gray-600 cursor-pointer hover:bg-gray-50 block"
      >
        📁 {file ? `Uploaded: ${file.name}` : "Click to upload or drag and drop"}
        <p className="text-xs text-gray-400 mt-1">
          Accepted formats: pdf, doc, docx
        </p>
        <input
          id="file-input"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
        
      </label>
      
    </div>
  );
}
