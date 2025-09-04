import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Save, 
  Eye, 
  Settings, 
  Image as ImageIcon,
  Type,
  CheckSquare,
  List,
  Star,
  Calendar,
  Mail,
  Hash,
  Upload,
  AlignLeft,
  BarChart3
} from 'lucide-react';
import { useForm } from '../contexts/FormContext';
import toast from 'react-hot-toast';

// Question Components
import TextQuestion from '../components/questions/TextQuestion';
import MCQQuestion from '../components/questions/MCQQuestion';
import CheckboxQuestion from '../components/questions/CheckboxQuestion';
import SelectQuestion from '../components/questions/SelectQuestion';
import RatingQuestion from '../components/questions/RatingQuestion';
import DateQuestion from '../components/questions/DateQuestion';
import EmailQuestion from '../components/questions/EmailQuestion';
import NumberQuestion from '../components/questions/NumberQuestion';
import FileUploadQuestion from '../components/questions/FileUploadQuestion';
import TextareaQuestion from '../components/questions/TextareaQuestion';
import ClozeQuestion from '../components/questions/ClozeQuestion';
import CategorizeQuestion from '../components/questions/CategorizeQuestion';
import ComprehensionQuestion from '../components/questions/ComprehensionQuestion';

export default function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createForm, updateForm, fetchForm, currentForm } = useForm();
  
  const [formData, setFormData] = useState({
    title: 'Untitled Form',
    description: '',
    headerImage: null,
    questions: [],
    settings: {
      allowAnonymous: true,
      multipleSubmissions: false,
      showProgressBar: true,
      collectEmail: false,
      customTheme: {
        primaryColor: '#3B82F6',
        backgroundColor: '#F9FAFB',
        fontFamily: 'Inter'
      }
    },
    status: 'draft'
  });
  
  const [activeTab, setActiveTab] = useState('build');
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load form data if editing
  useEffect(() => {
    if (id) {
      fetchForm(id).then(form => {
        if (form) {
          setFormData(form);
        }
      });
    }
  }, [id]);

  const questionTypes = [
    { type: 'text', label: 'Short Text', icon: Type, component: TextQuestion },
    { type: 'textarea', label: 'Long Text', icon: AlignLeft, component: TextareaQuestion },
    { type: 'mcq', label: 'Multiple Choice', icon: CheckSquare, component: MCQQuestion },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, component: CheckboxQuestion },
    { type: 'select', label: 'Dropdown', icon: List, component: SelectQuestion },
    { type: 'rating', label: 'Rating', icon: Star, component: RatingQuestion },
    { type: 'date', label: 'Date', icon: Calendar, component: DateQuestion },
    { type: 'email', label: 'Email', icon: Mail, component: EmailQuestion },
    { type: 'number', label: 'Number', icon: Hash, component: NumberQuestion },
    { type: 'file', label: 'File Upload', icon: Upload, component: FileUploadQuestion },
    { type: 'cloze', label: 'Cloze (Fill Blanks)', icon: Type, component: ClozeQuestion },
    { type: 'categorize', label: 'Categorize', icon: BarChart3, component: CategorizeQuestion },
    { type: 'comprehension', label: 'Comprehension', icon: AlignLeft, component: ComprehensionQuestion }
  ];

  const addQuestion = (type) => {
    const newQuestion = {
      id: crypto.randomUUID(),
      type,
      title: '',
      description: '',
      required: false,
      options: type === 'mcq' || type === 'checkbox' || type === 'select' ? [''] : [],
      // Type-specific defaults
      ...(type === 'rating' && { maxRating: 5 }),
      ...(type === 'cloze' && { clozeText: '', blanks: [] }),
      ...(type === 'categorize' && { categories: [''], items: [{ text: '', correctCategory: '' }] }),
      ...(type === 'comprehension' && { passage: '', subQuestions: [] })
    };
    
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    setShowQuestionTypes(false);
  };

  const updateQuestion = (questionId, updates) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const deleteQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const moveQuestion = (questionId, direction) => {
    const currentIndex = formData.questions.findIndex(q => q.id === questionId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= formData.questions.length) return;
    
    const newQuestions = [...formData.questions];
    [newQuestions[currentIndex], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[currentIndex]];
    
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleSave = async (publish = false) => {
    if (!formData.title.trim()) {
      toast.error('Please enter a form title');
      return;
    }

    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    setSaving(true);
    
    const dataToSave = {
      ...formData,
      status: publish ? 'published' : 'draft'
    };

    try {
      let result;
      if (id) {
        result = await updateForm(id, dataToSave);
      } else {
        result = await createForm(dataToSave);
      }

      if (result.success) {
        if (publish) {
          navigate(`/preview/${result.form._id}`);
        }
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'header') {
          setFormData(prev => ({ ...prev, headerImage: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900"
                placeholder="Untitled Form"
              />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                formData.status === 'published' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {formData.status}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/preview/${id || 'new'}`)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
              
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <span>{saving ? 'Publishing...' : 'Publish'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-32">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Questions</h3>
              
              <div className="space-y-2">
                {questionTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => addQuestion(type.type)}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <type.icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {/* Form Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Describe your form..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Image
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'header')}
                      className="hidden"
                      id="header-image"
                    />
                    <label
                      htmlFor="header-image"
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Upload Image</span>
                    </label>
                    {formData.headerImage && (
                      <img
                        src={formData.headerImage}
                        alt="Header preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              <AnimatePresence>
                {formData.questions.map((question, index) => {
                  const QuestionComponent = questionTypes.find(t => t.type === question.type)?.component;
                  
                  return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-xl shadow-sm border p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500">
                          Question {index + 1}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => moveQuestion(question.id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveQuestion(question.id, 'down')}
                            disabled={index === formData.questions.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            className="p-1 text-red-400 hover:text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {QuestionComponent && (
                        <QuestionComponent
                          question={question}
                          onChange={(updates) => updateQuestion(question.id, updates)}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Add Question Button */}
              {formData.questions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Add your first question
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Choose from various question types to build your form
                  </p>
                  <button
                    onClick={() => setShowQuestionTypes(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Add Question
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowQuestionTypes(true)}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Question</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Question Types Modal */}
      <AnimatePresence>
        {showQuestionTypes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQuestionTypes(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Choose Question Type
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {questionTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => addQuestion(type.type)}
                    className="flex flex-col items-center space-y-2 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <type.icon className="w-6 h-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}