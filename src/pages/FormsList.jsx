import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Edit3, Trash2, Eye, Calendar, Share2 } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import ShareModal from '../components/ShareModal';
import DeleteModal from '../components/DeleteModal';

function FormsList() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [shareModal, setShareModal] = useState({ isOpen: false, formId: null, formTitle: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, form: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/forms');
      setForms(response.data);
    } catch (error) {
      console.error('Error loading forms:', error);
      setMessage({ type: 'error', text: 'Failed to load forms. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (formId) => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/forms/${formId}`);
      setForms(forms.filter(form => form._id !== formId));
      
      setMessage({ type: 'success', text: 'Form deleted successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete form. Please try again.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, form: null });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getQuestionTypeIcon = (type) => {
    const icons = {
      mcq: '🔘',
      short: '📝',
      long: '📄',
      rating: '⭐',
      checkbox: '☑️',
      dropdown: '📋',
      file: '📎',
      date: '📅',
      time: '🕐',
      categorize: '🗂️'
    };
    return icons[type] || '❓';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-8xl mx-6 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition duration-200"
              >
                <ArrowLeft size={16} /> Back to Home
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Forms</h1>
                <p className="text-gray-600 text-sm">Manage and organize your forms</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/editor')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
            >
              <Plus size={16} /> Create New Form
            </button>
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div
            className={`p-4 rounded-lg flex justify-between items-center ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="text-xl font-bold hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading forms...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <Edit3 size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">No forms yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Get started by creating your first form. Choose from our templates or start from scratch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/editor')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
              >
                <Plus size={18} />
                Create Your First Form
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById("templates");
                  if (element) {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  } else {
                    navigate('/');
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
              >
                Browse Templates
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard 
                icon={<Edit3 className="w-6 h-6" />}
                title="Total Forms"
                value={forms.length}
                color="blue"
              />
              <StatsCard 
                icon={<Calendar className="w-6 h-6" />}
                title="Total Questions"
                value={forms.reduce((total, form) => total + (form.questions?.length || 0), 0)}
                color="green"
              />
              <StatsCard 
                icon={<Plus className="w-6 h-6" />}
                title="This Month"
                value={forms.filter(form => {
                  const formDate = new Date(form.createdAt);
                  const now = new Date();
                  return formDate.getMonth() === now.getMonth() && formDate.getFullYear() === now.getFullYear();
                }).length}
                color="purple"
              />
            </div>

            {/* Forms Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate flex-1 mr-2">
                        {form.title}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate(`/editor?edit=${form._id}`)}
                          className="p-2 text-blue-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                          title="Edit form"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setShareModal({ isOpen: true, formId: form._id, formTitle: form.title })}
                          className="p-2 text-green-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition duration-200"
                          title="Share form"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, form })}
                          className="p-2 text-red-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                          title="Delete form"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {form.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Calendar size={14} />
                      <span>Created {formatDate(form.createdAt)}</span>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-2">
                        {form.questions?.length || 0} question{(form.questions?.length || 0) !== 1 ? 's' : ''}
                      </div>
                      {form.questions && form.questions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {form.questions.slice(0, 5).map((question, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              title={question.text}
                            >
                              <span>{getQuestionTypeIcon(question.type)}</span>
                              <span className="capitalize">{question.type}</span>
                            </span>
                          ))}
                          {form.questions.length > 5 && (
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                              +{form.questions.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/editor?edit=${form._id}`)}
                        className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm font-medium"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => navigate(`/forms/${form._id}/responses`)}
                        className="flex items-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm font-medium"
                        title="View responses"
                      >
                        <Eye size={14} />
                        View Responses
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, formId: null, formTitle: '' })}
        formId={shareModal.formId}
        formTitle={shareModal.formTitle}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, form: null })}
        onConfirm={() => deleteForm(deleteModal.form?._id)}
        formTitle={deleteModal.form?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default FormsList;