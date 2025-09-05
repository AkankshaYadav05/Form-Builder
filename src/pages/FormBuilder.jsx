import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../contexts/FormContext';
import { 
  Plus, 
  Save, 
  Eye, 
  Settings, 
  Trash2, 
  GripVertical,
  Type,
  CheckSquare,
  Circle,
  List,
  Image,
  Star,
  Calendar,
  Mail,
  Hash,
  FileText,
  Layers,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentForm, createForm, updateForm, fetchForm, setCurrentForm } = useForm();
  
  const [formData, setFormData] = useState({
    title: 'Untitled Form',
    description: '',
    headerImage: '',
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

  const [activeTab, setActiveTab] = useState('builder');
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    if (id) {
      fetchForm(id);
    } else {
      setCurrentForm(null);
    }
  }, [id]);

  useEffect(() => {
    if (currentForm) {
      setFormData(currentForm);
    }
  }, [currentForm]);

  const questionTypes = [
    { type: 'text', label: 'Short Text', icon: <Type className="w-4 h-4" /> },
    { type: 'textarea', label: 'Long Text', icon: <FileText className="w-4 h-4" /> },
    { type: 'mcq', label: 'Multiple Choice', icon: <Circle className="w-4 h-4" /> },
    { type: 'checkbox', label: 'Checkboxes', icon: <CheckSquare className="w-4 h-4" /> },
    { type: 'select', label: 'Dropdown', icon: <List className="w-4 h-4" /> },
    { type: 'rating', label: 'Rating', icon: <Star className="w-4 h-4" /> },
    { type: 'date', label: 'Date', icon: <Calendar className="w-4 h-4" /> },
    { type: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { type: 'number', label: 'Number', icon: <Hash className="w-4 h-4" /> },
    { type: 'file', label: 'File Upload', icon: <Image className="w-4 h-4" /> },
    { type: 'cloze', label: 'Cloze (Fill in blanks)', icon: <Layers className="w-4 h-4" /> },
    { type: 'categorize', label: 'Categorize', icon: <Layers className="w-4 h-4" /> },
    { type: 'comprehension', label: 'Comprehension', icon: <BookOpen className="w-4 h-4" /> }
  ];

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      title: `New ${questionTypes.find(qt => qt.type === type)?.label || 'Question'}`,
      description: '',
      required: false,
      options: type === 'mcq' || type === 'checkbox' || type === 'select' ? [
        { text: 'Option 1', image: null, isCorrect: false },
        { text: 'Option 2', image: null, isCorrect: false }
      ] : [],
      image: null,
      clozeText: type === 'cloze' ? 'This is a sample text with _____ blanks to fill.' : '',
      blanks: type === 'cloze' ? [{ position: 0, correctAnswer: 'sample', options: [] }] : [],
      categories: type === 'categorize' ? ['Category 1', 'Category 2'] : [],
      items: type === 'categorize' ? [
        { text: 'Item 1', correctCategory: 'Category 1' },
        { text: 'Item 2', correctCategory: 'Category 2' }
      ] : [],
      passage: type === 'comprehension' ? 'Enter your passage here...' : '',
      subQuestions: type === 'comprehension' ? [
        { question: 'Sample question about the passage?', type: 'text', options: [], correctAnswer: '' }
      ] : [],
      maxRating: type === 'rating' ? 5 : undefined,
      validation: {}
    };

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
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

  const moveQuestion = (fromIndex, toIndex) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      const [removed] = newQuestions.splice(fromIndex, 1);
      newQuestions.splice(toIndex, 0, removed);
      return { ...prev, questions: newQuestions };
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a form title');
      return;
    }

    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    try {
      if (id) {
        await updateForm(id, formData);
      } else {
        const result = await createForm(formData);
        if (result.success) {
          navigate(`/builder/${result.form._id}`);
        }
      }
    } catch (error) {
      toast.error('Failed to save form');
    }
  };

  const handlePublish = async () => {
    const updatedFormData = { ...formData, status: 'published' };
    setFormData(updatedFormData);
    
    try {
      if (id) {
        await updateForm(id, updatedFormData);
        toast.success('Form published successfully!');
      } else {
        const result = await createForm(updatedFormData);
        if (result.success) {
          navigate(`/builder/${result.form._id}`);
          toast.success('Form published successfully!');
        }
      }
    } catch (error) {
      toast.error('Failed to publish form');
    }
  };

  const renderQuestionEditor = (question, index) => {
    return (
      <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
            <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {questionTypes.find(qt => qt.type === question.type)?.label}
            </span>
          </div>
          <button
            onClick={() => deleteQuestion(question.id)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Title
            </label>
            <input
              type="text"
              value={question.title}
              onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter question title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={question.description}
              onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="2"
              placeholder="Add a description or help text"
            />
          </div>

          {/* Question Type Specific Fields */}
          {(question.type === 'mcq' || question.type === 'checkbox' || question.type === 'select') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => {
                      const newOptions = [...question.options];
                      newOptions[optionIndex] = { ...option, text: e.target.value };
                      updateQuestion(question.id, { options: newOptions });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  {question.type === 'mcq' && (
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={option.isCorrect}
                        onChange={() => {
                          const newOptions = question.options.map((opt, idx) => ({
                            ...opt,
                            isCorrect: idx === optionIndex
                          }));
                          updateQuestion(question.id, { options: newOptions });
                        }}
                        className="text-blue-600"
                      />
                      <span className="ml-1 text-xs text-gray-500">Correct</span>
                    </label>
                  )}
                  <button
                    onClick={() => {
                      const newOptions = question.options.filter((_, idx) => idx !== optionIndex);
                      updateQuestion(question.id, { options: newOptions });
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [...question.options, { text: `Option ${question.options.length + 1}`, image: null, isCorrect: false }];
                  updateQuestion(question.id, { options: newOptions });
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Option
              </button>
            </div>
          )}

          {question.type === 'cloze' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cloze Text (Use _____ for blanks)
              </label>
              <textarea
                value={question.clozeText}
                onChange={(e) => updateQuestion(question.id, { clozeText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Enter text with _____ for blanks that users need to fill"
              />
            </div>
          )}

          {question.type === 'categorize' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                {question.categories.map((category, catIndex) => (
                  <div key={catIndex} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => {
                        const newCategories = [...question.categories];
                        newCategories[catIndex] = e.target.value;
                        updateQuestion(question.id, { categories: newCategories });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Category ${catIndex + 1}`}
                    />
                    <button
                      onClick={() => {
                        const newCategories = question.categories.filter((_, idx) => idx !== catIndex);
                        updateQuestion(question.id, { categories: newCategories });
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newCategories = [...question.categories, `Category ${question.categories.length + 1}`];
                    updateQuestion(question.id, { categories: newCategories });
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Category
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items to Categorize
                </label>
                {question.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => {
                        const newItems = [...question.items];
                        newItems[itemIndex] = { ...item, text: e.target.value };
                        updateQuestion(question.id, { items: newItems });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Item ${itemIndex + 1}`}
                    />
                    <select
                      value={item.correctCategory}
                      onChange={(e) => {
                        const newItems = [...question.items];
                        newItems[itemIndex] = { ...item, correctCategory: e.target.value };
                        updateQuestion(question.id, { items: newItems });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {question.categories.map((cat, catIdx) => (
                        <option key={catIdx} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const newItems = question.items.filter((_, idx) => idx !== itemIndex);
                        updateQuestion(question.id, { items: newItems });
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newItems = [...question.items, { text: `Item ${question.items.length + 1}`, correctCategory: question.categories[0] || '' }];
                    updateQuestion(question.id, { items: newItems });
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Item
                </button>
              </div>
            </div>
          )}

          {question.type === 'comprehension' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passage
                </label>
                <textarea
                  value={question.passage}
                  onChange={(e) => updateQuestion(question.id, { passage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Enter the passage for comprehension questions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Questions about the passage
                </label>
                {question.subQuestions.map((subQ, subIndex) => (
                  <div key={subIndex} className="border border-gray-200 rounded-md p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Question {subIndex + 1}</span>
                      <button
                        onClick={() => {
                          const newSubQuestions = question.subQuestions.filter((_, idx) => idx !== subIndex);
                          updateQuestion(question.id, { subQuestions: newSubQuestions });
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={subQ.question}
                      onChange={(e) => {
                        const newSubQuestions = [...question.subQuestions];
                        newSubQuestions[subIndex] = { ...subQ, question: e.target.value };
                        updateQuestion(question.id, { subQuestions: newSubQuestions });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                      placeholder="Enter question"
                    />
                    <select
                      value={subQ.type}
                      onChange={(e) => {
                        const newSubQuestions = [...question.subQuestions];
                        newSubQuestions[subIndex] = { ...subQ, type: e.target.value };
                        updateQuestion(question.id, { subQuestions: newSubQuestions });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="text">Text Answer</option>
                      <option value="mcq">Multiple Choice</option>
                    </select>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newSubQuestions = [...question.subQuestions, { question: '', type: 'text', options: [], correctAnswer: '' }];
                    updateQuestion(question.id, { subQuestions: newSubQuestions });
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Question
                </button>
              </div>
            </div>
          )}

          {question.type === 'rating' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Rating
              </label>
              <select
                value={question.maxRating}
                onChange={(e) => updateQuestion(question.id, { maxRating: parseInt(e.target.value) })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={3}>3 Stars</option>
                <option value={5}>5 Stars</option>
                <option value={10}>10 Points</option>
              </select>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id={`required-${question.id}`}
              checked={question.required}
              onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={`required-${question.id}`} className="ml-2 block text-sm text-gray-700">
              Required question
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="text-xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                placeholder="Untitled Form"
              />
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                formData.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {formData.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              
              {id && (
                <button
                  onClick={() => navigate(`/preview/${id}`)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
              )}

              <button
                onClick={handlePublish}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <span>{formData.status === 'published' ? 'Update' : 'Publish'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Types Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Questions</h3>
              <div className="space-y-2">
                {questionTypes.map((questionType) => (
                  <button
                    key={questionType.type}
                    onClick={() => addQuestion(questionType.type)}
                    className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors border border-gray-200 hover:border-blue-300"
                  >
                    {questionType.icon}
                    <span className="text-sm font-medium">{questionType.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Builder */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Form Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Form Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter form title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Describe what this form is for"
                    />
                  </div>
                </div>
              </div>

              {/* Questions */}
              {formData.questions.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start building your form by adding questions from the sidebar
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.questions.map((question, index) => 
                    renderQuestionEditor(question, index)
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;