export default function FileUpload({ question }) {
  return (
    <div className="shadow-sm rounded-2xl p-4 bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">File Upload</h3>
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">
          FILE-UPLOAD
        </span>
      </div>

      <p className="text-sm mb-2">Please upload your file</p>
      <div className="border border-dashed rounded-lg p-6 text-center text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
        📁 Click to upload or drag and drop
        <p className="text-xs text-gray-400 mt-1">Accepted formats: pdf, doc, docx</p>
      </div>
    </div>
  );
}
