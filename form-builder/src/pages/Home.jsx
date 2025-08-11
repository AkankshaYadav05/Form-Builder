import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-center px-6 py-20">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Custom Form Builder</h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
        Create delightful forms with Categorize, Cloze, and Comprehension questions. Add header and question images, then share a preview link.
      </p>

      <div className="flex justify-center gap-4 mb-20">
        <button
          onClick={() => navigate('/editor')}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-semibold transition"
        >
          Create a Form
        </button>
        <button
          className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-md font-semibold transition"
        >
          See Features
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto px-4">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-left">
          <h3 className="text-xl font-semibold mb-2">Header & Images</h3>
          <p className="text-gray-600">
            Upload a header image and attach images to individual questions.
          </p>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-left">
          <h3 className="text-xl font-semibold mb-2">Three Question Types</h3>
          <p className="text-gray-600">
            Categorize, Cloze (fill-in-the-blank), and Comprehension with sub-questions.
          </p>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-left">
          <h3 className="text-xl font-semibold mb-2">Share & Collect</h3>
          <p className="text-gray-600">
            Save and share a preview link; submissions are stored locally for this demo.
          </p>
        </div>
      </div>
        
      <div className="flex justify-center w-full mt-10 px-9">
        <button onClick={() => navigate('/allForms')}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-semibold transition"
        >
          Forms List
        </button>
      </div>

    </div>
  );
}

export default Home;
