import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Send,
  AlertCircle,
  Star,
  Upload,
  Calendar,
  ChevronDown
} from "lucide-react";

// Progress Bar Component
function ProgressBar({ current, total }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span>Question {current} of {total}</span>
        <span>{Math.round(percentage)}% Complete</span>
      </div>
    </div>
  );
}

// Question Components
function MCQQuestion({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <label 
            key={index} 
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={answer === option}
              onChange={(e) => onChange(e.target.value)}
              className="w-5 h-5 text-blue-600 mr-4"
            />
            <span className="text-gray-700 font-medium">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckboxQuestion({ question, answer, onChange }) {
  const selectedOptions = Array.isArray(answer) ? answer : [];
  
  const handleChange = (option) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    onChange(newSelection);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <label 
            key={index} 
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleChange(option)}
              className="w-5 h-5 text-blue-600 mr-4 rounded"
            />
            <span className="text-gray-700 font-medium">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ShortAnswerQuestion({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <input
        type="text"
        value={answer || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        placeholder="Type your answer here..."
      />
    </div>
  );
}

function LongAnswerQuestion({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <textarea
        value={answer || ''}
        onChange={(e) => onChange(e.target.value)}
        rows="6"
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
        placeholder="Type your detailed answer here..."
      />
    </div>
  );
}

function RatingQuestion({ question, answer, onChange }) {
  const scale = question.scale || 5;
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="flex gap-2 justify-center">
        {Array.from({ length: scale }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onChange(index + 1)}
            className="transition-all duration-200 hover:scale-110"
          >
            <Star
              size={32}
              className={`${
                answer && answer > index
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
      <div className="text-center text-sm text-gray-600">
        {answer ? `${answer} out of ${scale} stars` : 'Click to rate'}
      </div>
    </div>
  );
}

function DropdownQuestion({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="relative">
        <select
          value={answer || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white"
        >
          <option value="">Select an option...</option>
          {question.options?.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
      </div>
    </div>
  );
}

function FileUploadQuestion({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
        <Upload className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600 mb-2">Drag and drop your file here, or click to browse</p>
        <input
          type="file"
          onChange={(e) => onChange(e.target.files[0]?.name || '')}
          className="hidden"
          id={`file-${question.id}`}
        />
        <label
          htmlFor={`file-${question.id}`}
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors duration-200"
        >
          Choose File
        </label>
        {answer && (
          <p className="mt-2 text-sm text-green-600">Selected: {answer}</p>
        )}
      </div>
    </div>
  );
}

function DateQuestion({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="relative">
        <input
          type="date"
          value={answer || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
      </div>
    </div>
  );
}

function TimeQuestion({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="relative">
        <input
          type="time"
          value={answer || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
      </div>
    </div>
  );
}

// Main Component
export default function FillForm() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // For demo purposes, using localStorage instead of API
    const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
    const foundForm = savedForms.find(f => f.id === formId);
    
    if (foundForm) {
      setForm(foundForm);
    } else {
      // Fallback demo form
      setForm({
        id: formId,
        title: "Sample Form",
        description: "This is a sample form for demonstration",
        questions: [
          {
            id: '1',
            type: 'mcq',
            text: 'What is your favorite color?',
            options: ['Red', 'Blue', 'Green', 'Yellow']
          },
          {
            id: '2',
            type: 'rating',
            text: 'How would you rate this form?',
            scale: 5
          },
          {
            id: '3',
            type: 'short',
            text: 'What is your name?'
          }
        ]
      });
    }
  }, [formId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setErrors(prev => ({ ...prev, [questionId]: false }));
  };

  const validateCurrentQuestion = () => {
    const question = form.questions[currentQuestion];
    const answer = answers[question.id];
    
    if (!answer || (Array.isArray(answer) && answer.length === 0)) {
      setErrors(prev => ({ ...prev, [question.id]: true }));
      return false;
    }
    return true;
  };

  const nextQuestion = () => {
    if (validateCurrentQuestion()) {
      setCurrentQuestion(prev => Math.min(prev + 1, form.questions.length - 1));
    }
  };

  const prevQuestion = () => {
    setCurrentQuestion(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateCurrentQuestion()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Save response to localStorage for demo
      const responses = JSON.parse(localStorage.getItem('formResponses') || '[]');
      responses.push({
        id: crypto.randomUUID(),
        formId,
        answers,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('formResponses', JSON.stringify(responses));
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 1500);
  };

  const renderQuestion = (question) => {
    const answer = answers[question.id];
    const hasError = errors[question.id];
    
    const questionProps = {
      question,
      answer,
      onChange: (value) => handleAnswerChange(question.id, value)
    };

    let QuestionComponent;
    switch (question.type) {
      case 'mcq': QuestionComponent = MCQQuestion; break;
      case 'checkbox': QuestionComponent = CheckboxQuestion; break;
      case 'short': QuestionComponent = ShortAnswerQuestion; break;
      case 'long': QuestionComponent = LongAnswerQuestion; break;
      case 'rating': QuestionComponent = RatingQuestion; break;
      case 'dropdown': QuestionComponent = DropdownQuestion; break;
      case 'file': QuestionComponent = FileUploadQuestion; break;
      case 'date': QuestionComponent = DateQuestion; break;
      case 'time': QuestionComponent = TimeQuestion; break;
      default: return <div>Unsupported question type</div>;
    }

    return (
      <div className={`transition-all duration-300 ${hasError ? 'animate-shake' : ''}`}>
        <QuestionComponent {...questionProps} />
        {hasError && (
          <div className="flex items-center gap-2 mt-4 text-red-600">
            <AlertCircle size={16} />
            <span className="text-sm">This question is required</span>
          </div>
        )}
      </div>
    );
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-4">Your response has been submitted successfully.</p>
          <div className="animate-pulse text-sm text-gray-500">Redirecting to home...</div>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentQuestion === form.questions.length - 1;
  const isFirstQuestion = currentQuestion === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{form.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{form.description}</p>
            <ProgressBar current={currentQuestion + 1} total={form.questions.length} />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                Question {currentQuestion + 1} of {form.questions.length}
              </span>
            </div>
            
            {renderQuestion(form.questions[currentQuestion])}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={isFirstQuestion}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isFirstQuestion
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Form
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                Next
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}