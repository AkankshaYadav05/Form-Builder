import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Settings, Palette, Eye } from 'lucide-react';

function FormHeader({ 
  activeTab, 
  setActiveTab, 
  onSave, 
  loading, 
  isEditing 
}) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full h-16 flex justify-between items-center px-6 bg-white shadow-sm border-b z-50">
      <div className="flex items-center gap-3">
        <span className="text-xl">✨</span>
        <h1 className="text-lg font-semibold text-gray-800">Form Builder</h1>
      </div>
      
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {['build', 'design', 'preview'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === tab 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'build' && <Settings size={16} className="inline mr-2" />}
            {tab === 'design' && <Palette size={16} className="inline mr-2" />}
            {tab === 'preview' && <Eye size={16} className="inline mr-2" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition duration-200"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onSave}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 disabled:opacity-50"
        >
          <Save size={16} /> {loading ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update Form" : "Save Form")}
        </button>
        <button
          onClick={() => navigate("/forms")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
        >
          All Forms
        </button>
      </div>
    </header>
  );
}

export default FormHeader;