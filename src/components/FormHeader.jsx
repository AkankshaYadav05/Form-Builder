import { useState } from 'react';
import { Save, Eye, LayoutGrid as Layout, Menu, X, List, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FormHeader({ activeTab, setActiveTab, onSave, loading, isEditing }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 shadow-sm">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Desktop Back + Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Desktop Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Mobile Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 rounded-lg transition"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>

          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="text-lg sm:text-xl font-bold text-gray-800 hover:text-blue-600 transition"
            aria-label="Go home"
          >
            FormBuilder
          </button>
        </div>

        {/* Center: Tabs */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setActiveTab('build')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'build' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Layout size={18} />
            Build
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'preview' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Eye size={18} />
            Preview
          </button>
        </div>

        {/* Right: Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
          </button>

          <button
            onClick={() => navigate('/forms')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <List size={18} />
            My Forms
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          aria-label="Open menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {/* Back Button */}
            <button
              onClick={() => {
                navigate(-1);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <ArrowLeft size={18} /> Back
            </button>

            {/* Tabs */}
            <button
              onClick={() => {
                setActiveTab('build');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                activeTab === 'build' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Layout size={18} />
              Build
            </button>

            <button
              onClick={() => {
                setActiveTab('preview');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                activeTab === 'preview' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Eye size={18} />
              Preview
            </button>

            {/* Actions */}
            <button
              onClick={() => {
                onSave();
                setMobileMenuOpen(false);
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
            </button>

            <button
              onClick={() => {
                navigate('/forms');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <List size={18} />
              My Forms
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
