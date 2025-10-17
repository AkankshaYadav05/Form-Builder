import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { PlusCircle, List, Trash2, ArrowUp, ArrowDown } from "lucide-react";

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

import FormHeader from "../components/FormHeader";
import FormSidebar from "../components/FormSidebar";
import FormPreview from "../components/FormPreview";

export default function FormBuilder() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form description");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('build');
  const [formTheme, setFormTheme] = useState('default');
  const [isEditing, setIsEditing] = useState(false);
  const [currentFormId, setCurrentFormId] = useState(null);

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
    
    registration: {
      title: "Registration Form",
      description: "Register for an event or program",
      questions: [
        { id: crypto.randomUUID(), type: "short", text: "Full Name" },
        { id: crypto.randomUUID(), type: "short", text: "Email" },
        { id: crypto.randomUUID(), type: "short", text: "Phone Number" },
        { id: crypto.randomUUID(), type: "dropdown", text: "Select Event", options: ["Workshop", "Seminar", "Webinar"] },
        { id: crypto.randomUUID(), type: "date", text: "Preferred Date" },
        { id: crypto.randomUUID(), type: "long", text: "Additional Comments" }
      ]
    },

    survey: {
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

  const themes = [
    { id: 'default', name: 'Default', colors: { primary: '#3B82F6', secondary: '#EFF6FF' } },
    { id: 'purple', name: 'Purple', colors: { primary: '#8B5CF6', secondary: '#F3E8FF' } },
    { id: 'green', name: 'Green', colors: { primary: '#10B981', secondary: '#ECFDF5' } },
    { id: 'orange', name: 'Orange', colors: { primary: '#F59E0B', secondary: '#FFFBEB' } },
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const templateId = searchParams.get('template');
    const editId = searchParams.get('edit');

    if (templateId && TEMPLATE_DATA[templateId]) {
      const template = TEMPLATE_DATA[templateId];
      setTitle(template.title);
      setDescription(template.description);
      setQuestions(template.questions);
    } else if (editId) {
      loadFormForEditing(editId);
    }
  }, [location]);

  const loadFormForEditing = async (formId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/forms/${formId}`);
      const form = response.data;
      setTitle(form.title);
      setDescription(form.description);
      setQuestions(form.questions || []);
      setFormTheme(form.theme || 'default');
      setIsEditing(true);
      setCurrentFormId(formId);
    } catch (error) {
      console.error('Error loading form:', error);
      alert('Error loading form for editing');
    }
  };

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

      const formData = {
        title,
        description,
        questions,
        theme: formTheme
      };

      if (isEditing && currentFormId) {
        await axios.put(`http://localhost:5000/api/forms/${currentFormId}`, formData);
        alert("Form updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/forms", formData);
        alert("Form saved successfully!");
      }

      navigate("/forms");
    } catch (err) {
      console.error(err);
      alert(isEditing ? "Error updating form" : "Error saving form");
    } finally {
      setLoading(false);
    }
  };

  const currentTheme = themes.find(t => t.id === formTheme) || themes[0];
  const showSidebar = activeTab !== 'preview';

  return (
    <div className="bg-gray-50 min-h-screen">
      <FormHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSave={saveForm}
        loading={loading}
        isEditing={isEditing}
      />

      <div className="flex pt-16">
        {showSidebar && (
          <FormSidebar
            activeTab={activeTab}
            onAddQuestion={addQuestion}
            themes={themes}
            formTheme={formTheme}
            setFormTheme={setFormTheme}
          />
        )}

        <main className={`${showSidebar ? 'md:ml-64' : ''} flex-1 p-4 sm:p-6 w-full`}>
          <div className="max-w-4xl mx-auto">
            {activeTab === 'preview' ? (
              <FormPreview
                title={title}
                description={description}
                questions={questions}
                currentTheme={currentTheme}
              />
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl sm:text-3xl font-bold w-full focus:outline-none border-b border-gray-200 pb-2 mb-3"
                    placeholder="Form Title"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full focus:outline-none text-gray-600 resize-none text-sm sm:text-base"
                    placeholder="Form description"
                    rows="2"
                  />
                </div>

                <div className="space-y-4">
                  {questions.map((question, index) => {
                    const Component = COMPONENTS[question.type];
                    return (
                      <div key={question.id} className="relative group">
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-10">
                          <button
                            onClick={() => moveQuestion(index, "up")}
                            className="p-1.5 sm:p-2 bg-white border border-gray-300 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition duration-200"
                            disabled={index === 0}
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => moveQuestion(index, "down")}
                            className="p-1.5 sm:p-2 bg-white border border-gray-300 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition duration-200"
                            disabled={index === questions.length - 1}
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            className="p-1.5 sm:p-2 bg-white border border-gray-300 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition duration-200"
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

                {questions.length === 0 && (
                  <div className="text-center py-12 sm:py-16">
                    <div className="text-gray-400 mb-4">
                      <List size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                      No questions yet
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-6">
                      Start by adding a question from the sidebar
                    </p>
                    <button
                      onClick={() => addQuestion("mcq")}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200 text-sm sm:text-base"
                    >
                      <PlusCircle size={18} />
                      Add Your First Question
                    </button>
                  </div>
                )}

                {questions.length > 0 && (
                  <div className="flex justify-center gap-4 mt-6 sm:mt-8 pb-10">
                    <button
                      onClick={() => addQuestion("mcq")}
                      className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-200 text-sm sm:text-base"
                    >
                      <PlusCircle size={18} /> Add Question
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
