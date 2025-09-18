import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {PlusCircle,List,Save,Trash2,ArrowUp,ArrowDown,ArrowLeft,Type,CheckSquare,Star,Upload,Calendar,Clock,ChevronDown,Eye,Settings,Palette
} from "lucide-react";

// Question Components
import MCQ from "../components/questions/MCQ";
import LongAnswer from "../components/questions/LongAnswer";
import Rating from "../components/questions/Rating";
import Checkbox from "../components/questions/Checkbox";
import FileUpload from "../components/questions/FileUpload";
import Categorize from "../components/questions/Categorize";
import ShortAnswer from "../components/questions/ShortAnswer";
import Dropdown from "../components/questions/Dropdown";
import DateQuestion from "../components/questions/Date";
import TimeQuestion from "../components/questions/Time";

import SidebarBtn from "../components/SidebarBtn";

export default function FormBuilder() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form description");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('build');
  const [formTheme, setFormTheme] = useState('default');
  const navigate = useNavigate();
  const location = useLocation();

  const QUESTION_TEMPLATES = {
    mcq: { type: "mcq", text: "Multiple Choice Question", options: ["Option 1", "Option 2"] },
    long: { type: "long", text: "Long Answer Question" },
    rating: { type: "rating", text: "Rating Question", scale: 5 },
    checkbox: { type: "checkbox", text: "Checkbox Question", options: ["Option 1", "Option 2"] },
    file: { type: "file", text: "File Upload Question" },
    categorize: {
      type: "categorize",
      text: "Categorize Question",
      categories: ["Category 1", "Category 2"],
      items: ["Item 1", "Item 2"],
    },
    short: { type: "short", text: "Short Answer Question" },
    dropdown: { type: "dropdown", text: "Dropdown Question", options: ["Option 1", "Option 2"] },
    date: { type: "date", text: "Date Question" },
    time: { type: "time", text: "Time Question" },
  };

  const TEMPLATE_DATA = {
    event: {
      title: "Event Registration Form",
      description: "Register for our upcoming event",
      questions: [
        { id: crypto.randomUUID(), type: "short", text: "Full Name" },
        { id: crypto.randomUUID(), type: "short", text: "Email Address" },
        { id: crypto.randomUUID(), type: "mcq", text: "Which session are you most interested in?", options: ["Morning Session", "Afternoon Session", "Evening Session"] },
        { id: crypto.randomUUID(), type: "checkbox", text: "Dietary Requirements", options: ["Vegetarian", "Vegan", "Gluten-free", "No restrictions"] }
      ]
    },
    feedback: {
      title: "Customer Feedback Form",
      description: "Help us improve our services",
      questions: [
        { id: crypto.randomUUID(), type: "rating", text: "How satisfied are you with our service?", scale: 5 },
        { id: crypto.randomUUID(), type: "mcq", text: "How did you hear about us?", options: ["Social Media", "Friend Referral", "Google Search", "Advertisement"] },
        { id: crypto.randomUUID(), type: "long", text: "What can we improve?" },
        { id: crypto.randomUUID(), type: "checkbox", text: "Which features do you use most?", options: ["Dashboard", "Reports", "Integrations", "Mobile App"] }
      ]
    },
    job: {
      title: "Job Application Form",
      description: "Apply for a position at our company",
      questions: [
        { id: crypto.randomUUID(), type: "short", text: "Full Name" },
        { id: crypto.randomUUID(), type: "short", text: "Email Address" },
        { id: crypto.randomUUID(), type: "short", text: "Phone Number" },
        { id: crypto.randomUUID(), type: "dropdown", text: "Position Applied For", options: ["Software Engineer", "Product Manager", "Designer", "Marketing Specialist"] },
        { id: crypto.randomUUID(), type: "file", text: "Upload Resume" },
        { id: crypto.randomUUID(), type: "long", text: "Why do you want to work with us?" }
      ]
    },
    contact: {
      title: "Contact Us",
      description: "Get in touch with us",
      questions: [
        { id: crypto.randomUUID(), type: "short", text: "Name" },
        { id: crypto.randomUUID(), type: "short", text: "Email" },
        { id: crypto.randomUUID(), type: "short", text: "Subject" },
        { id: crypto.randomUUID(), type: "long", text: "Message" }
      ]
    },
    quiz: {
      title: "Knowledge Quiz",
      description: "Test your knowledge",
      questions: [
        { id: crypto.randomUUID(), type: "mcq", text: "What is your favorite programming language?", options: ["JavaScript", "Python", "Java", "C++"] },
        { id: crypto.randomUUID(), type: "rating", text: "How would you rate your coding skills?", scale: 5 },
        { id: crypto.randomUUID(), type: "checkbox", text: "Which frameworks have you used?", options: ["React", "Vue", "Angular", "Svelte"] }
      ]
    }
  };

  const COMPONENTS = {
    mcq: MCQ,
    long: LongAnswer,
    rating: Rating,
    checkbox: Checkbox,
    file: FileUpload,
    categorize: Categorize,
    short: ShortAnswer,
    dropdown: Dropdown,
    date: DateQuestion,
    time: TimeQuestion,
  };

  const questionTypes = [
    { key: 'mcq', label: 'Multiple Choice', icon: <CheckSquare size={16} /> },
    { key: 'short', label: 'Short Answer', icon: <Type size={16} /> },
    { key: 'long', label: 'Long Answer', icon: <List size={16} /> },
    { key: 'rating', label: 'Rating', icon: <Star size={16} /> },
    { key: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={16} /> },
    { key: 'dropdown', label: 'Dropdown', icon: <ChevronDown size={16} /> },
    { key: 'file', label: 'File Upload', icon: <Upload size={16} /> },
    { key: 'date', label: 'Date', icon: <Calendar size={16} /> },
    { key: 'time', label: 'Time', icon: <Clock size={16} /> },
    { key: 'categorize', label: 'Categorize', icon: <List size={16} /> },
  ];

  const themes = [
    { id: 'default', name: 'Default', colors: { primary: '#3B82F6', secondary: '#EFF6FF' } },
    { id: 'purple', name: 'Purple', colors: { primary: '#8B5CF6', secondary: '#F3E8FF' } },
    { id: 'green', name: 'Green', colors: { primary: '#10B981', secondary: '#ECFDF5' } },
    { id: 'orange', name: 'Orange', colors: { primary: '#F59E0B', secondary: '#FFFBEB' } },
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const templateId = searchParams.get('template');
    
    if (templateId && TEMPLATE_DATA[templateId]) {
      const template = TEMPLATE_DATA[templateId];
      setTitle(template.title);
      setDescription(template.description);
      setQuestions(template.questions);
    }
  }, [location]);

  const addQuestion = (type) => {
    setQuestions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...QUESTION_TEMPLATES[type] },
    ]);
  };

  const updateQuestion = (id, updated) =>
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));

  const deleteQuestion = (id) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  const moveQuestion = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    )
      return;

    const newQuestions = [...questions];
    const [removed] = newQuestions.splice(index, 1);
    newQuestions.splice(direction === "up" ? index - 1 : index + 1, 0, removed);
    setQuestions(newQuestions);
  };

  const saveForm = async () => {
    if (!title.trim()) {
      alert("Please enter a form title");
      return;
    }
    if (questions.length === 0) {
      alert("Add at least one question before saving");
      return;
    }
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for demo
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      const newForm = {
        id: crypto.randomUUID(),
        title,
        description,
        questions,
        theme: formTheme,
        createdAt: new Date().toISOString()
      };
      savedForms.push(newForm);
      localStorage.setItem('savedForms', JSON.stringify(savedForms));
      
      alert("Form saved successfully!");
      navigate("/forms");
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    } finally {
      setLoading(false);
    }
  };

  const currentTheme = themes.find(t => t.id === formTheme) || themes[0];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-16 flex justify-between items-center px-6 bg-white shadow-sm border-b z-50">
        <div className="flex items-center gap-3">
          <span className="text-xl">✨</span>
          <h1 className="text-lg font-semibold text-gray-800">Form Builder</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('build')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'build' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings size={16} className="inline mr-2" />
            Build
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'design' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Palette size={16} className="inline mr-2" />
            Design
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'preview' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye size={16} className="inline mr-2" />
            Preview
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition duration-200"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={saveForm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 disabled:opacity-50"
          >
            <Save size={16} /> {loading ? "Saving..." : "Save Form"}
          </button>
          <button
            onClick={() => navigate("/forms")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
          >
            All Forms
          </button>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
          {activeTab === 'build' && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Question</h2>
              <div className="space-y-2">
                {questionTypes.map((type) => (
                  <SidebarBtn
                    key={type.key}
                    icon={type.icon}
                    label={type.label}
                    onClick={() => addQuestion(type.key)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Form Theme</h2>
              <div className="space-y-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setFormTheme(theme.id)}
                    className={`w-full p-3 rounded-lg border-2 transition duration-200 ${
                      formTheme === theme.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      ></div>
                      <span className="font-medium text-gray-800">{theme.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="ml-90 flex-1 p-6 max-w-4xl mx-auto">
          {activeTab === 'preview' ? (
            /* Preview Mode */
            <div 
              className="bg-white rounded-lg shadow-sm p-8 border border-gray-200"
              style={{ backgroundColor: currentTheme.colors.secondary }}
            >
              <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
                  <p className="text-gray-600">{description}</p>
                </div>
                
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {index + 1}. {question.text || "Untitled Question"}
                      </h3>
                      
                      {question.type === 'mcq' && (
                        <div className="space-y-2">
                          {question.options?.map((option, i) => (
                            <label key={i} className="flex items-center gap-3 cursor-pointer">
                              <input type="radio" name={`q${index}`} className="text-blue-600" />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'checkbox' && (
                        <div className="space-y-2">
                          {question.options?.map((option, i) => (
                            <label key={i} className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" className="text-blue-600 rounded" />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'short' && (
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your answer..."
                        />
                      )}
                      
                      {question.type === 'long' && (
                        <textarea 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows="4"
                          placeholder="Your answer..."
                        />
                      )}
                      
                      {question.type === 'rating' && (
                        <div className="flex gap-2">
                          {Array.from({ length: question.scale || 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={24}
                              className="text-gray-300 hover:text-yellow-400 cursor-pointer transition duration-200"
                            />
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'dropdown' && (
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Select an option...</option>
                          {question.options?.map((option, i) => (
                            <option key={i} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
                
                {questions.length > 0 && (
                  <div className="mt-8 text-center">
                    <button 
                      className="px-8 py-3 rounded-lg text-white font-medium transition duration-200"
                      style={{ backgroundColor: currentTheme.colors.primary }}
                    >
                      Submit Form
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Build/Design Mode */
            <>
              {/* Form Title */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-3xl font-bold w-full focus:outline-none border-b border-gray-200 pb-2 mb-3"
                  placeholder="Form Title"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full focus:outline-none text-gray-600 resize-none"
                  placeholder="Form description"
                  rows="2"
                />
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const Component = COMPONENTS[question.type];
                  return (
                    <div key={question.id} className="relative group">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <button
                          onClick={() => moveQuestion(index, "up")}
                          className="p-2 bg-white border border-gray-300 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition duration-200"
                          disabled={index === 0}
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => moveQuestion(index, "down")}
                          className="p-2 bg-white border border-gray-300 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition duration-200"
                          disabled={index === questions.length - 1}
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          className="p-2 bg-white border border-gray-300 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition duration-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {Component && (
                        <Component
                          question={question}
                          onChange={(updated) => updateQuestion(question.id, updated)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {questions.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <List size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions yet</h3>
                  <p className="text-gray-500 mb-6">Start by adding a question from the sidebar</p>
                  <button
                    onClick={() => addQuestion("mcq")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                  >
                    <PlusCircle size={18} />
                    Add Your First Question
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              {questions.length > 0 && (
                <div className="flex justify-center gap-4 mt-8 pb-10">
                  <button
                    onClick={() => addQuestion("mcq")}
                    className="flex items-center gap-2 px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-200"
                  >
                    <PlusCircle size={18} /> Add Question
                  </button>
                  <button
                    onClick={saveForm}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                  >
                    <Save size={18} /> {loading ? "Saving..." : "Save Form"}
                  </button>
                  <button
                    onClick={() => setQuestions([])}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 transition duration-200"
                  >
                    <Trash2 size={18} /> Clear All
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}