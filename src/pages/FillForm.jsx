import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Star, 
  Calendar, 
  Upload, 
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const FillForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(Date.now());
  const [respondentInfo, setRespondentInfo] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/forms/${id}`);
      setForm(response.data);
      
      // Initialize answers object
      const initialAnswers = {};
      response.data.questions.forEach(question => {
        if (question.type === 'checkbox') {
          initialAnswers[question._id] = [];
        } else if (question.type === 'cloze' || question.type === 'comprehension') {
          initialAnswers[question._id] = [];
        } else {
          initialAnswers[question._id] = '';
        }
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Form not found or no longer available');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    form.questions.forEach((question, index) => {
      if (question.required) {
        const answer = answers[question._id];
        
        if (!answer || 
            (Array.isArray(answer) && answer.length === 0) ||
            (typeof answer === 'string' && answer.trim() === '')) {
          errors.push(`Question ${index + 1} is required`);
        }
      }
    });

    if (form.settings.collectEmail && !respondentInfo.email) {
      errors.push('Email is required');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    setSubmitting(true);
    
    try {
      const completionTime = Date.now() - startTime;
      const formattedAnswers = form.questions.map(question => ({
        questionId: question._id,
        answer: answers[question._id],
        timeSpent: Math.floor(completionTime / form.questions.length) // Rough estimate
      }));

      const response = await axios.post('http://localhost:5000/api/responses', {
        formId: id,
        answers: formattedAnswers,
        respondentEmail: respondentInfo.email,
        respondentName: respondentInfo.name || 'Anonymous',
        completionTime: Math.floor(completionTime / 1000) // Convert to seconds
      });

      setScore(response.data.score);
      setSubmitted(true);
      toast.success('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    const answer = answers[question._id] || '';

    switch (question.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={question.type}
            value={answer}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Your answer"
            required={question.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={answer}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter a number"
            required={question.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={answer}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            rows="4"
            placeholder="Your answer"
            required={question.required}
          />
        );

      case 'mcq':
        return (
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all">
                <input
                  type="radio"
                  name={question._id}
                  value={option.text}
                  checked={answer === option.text}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                  required={question.required}
                />
                <span className="text-gray-700 flex-1">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  value={option.text}
                  checked={Array.isArray(answer) && answer.includes(option.text)}
                  onChange={(e) => {
                    const currentAnswers = Array.isArray(answer) ? answer : [];
                    if (e.target.checked) {
                      handleAnswerChange(question._id, [...currentAnswers, option.text]);
                    } else {
                      handleAnswerChange(question._id, currentAnswers.filter(a => a !== option.text));
                    }
                  }}
                  className="text-blue-600 focus:ring-blue-500 rounded w-4 h-4"
                />
                <span className="text-gray-700 flex-1">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            value={answer}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options.map((option, optionIndex) => (
              <option key={optionIndex} value={option.text}>
                {option.text}
              </option>
            ))}
          </select>
        );

      case 'rating':
        return (
          <div className="flex items-center space-x-2">
            {[...Array(question.maxRating || 5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAnswerChange(question._id, i + 1)}
                className={`p-1 transition-colors ${
                  answer > i ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400`}
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
            <span className="ml-4 text-gray-600 font-medium">
              {answer ? `${answer}/${question.maxRating || 5}` : 'Click to rate'}
            </span>
          </div>
        );

      case 'date':
        return (
          <div className="relative">
            <input
              type="date"
              value={answer}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required={question.required}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        );

      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
            <input
              type="file"
              onChange={(e) => handleAnswerChange(question._id, e.target.files[0]?.name || '')}
              className="hidden"
              id={`file-${question._id}`}
              required={question.required}
            />
            <label
              htmlFor={`file-${question._id}`}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Choose File
            </label>
            {answer && (
              <p className="mt-2 text-sm text-gray-600">Selected: {answer}</p>
            )}
          </div>
        );

      case 'cloze':
        const blanks = question.clozeText.split('_____');
        return (
          <div className="space-y-4">
            <div className="text-gray-700 leading-relaxed text-lg">
              {blanks.map((part, index) => (
                <span key={index}>
                  {part}
                  {index < blanks.length - 1 && (
                    <input
                      type="text"
                      value={Array.isArray(answer) ? answer[index] || '' : ''}
                      onChange={(e) => {
                        const newAnswers = Array.isArray(answer) ? [...answer] : [];
                        newAnswers[index] = e.target.value;
                        handleAnswerChange(question._id, newAnswers);
                      }}
                      className="inline-block mx-2 px-3 py-1 border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 bg-transparent min-w-[120px] text-center"
                      placeholder="____"
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        );

      case 'categorize':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.categories.map((category, catIndex) => (
                <div key={catIndex} className="border-2 border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 text-center">{category}</h4>
                  <div className="min-h-[120px] border-2 border-dashed border-gray-200 rounded-lg p-3 bg-gray-50">
                    <p className="text-gray-500 text-sm text-center">Drop items here</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-gray-900 mb-3">Items to categorize:</h4>
              <div className="flex flex-wrap gap-3">
                {question.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="px-4 py-2 bg-white border border-blue-200 text-blue-800 rounded-lg cursor-move shadow-sm hover:shadow-md transition-shadow"
                  >
                    {item.text}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Drag and drop items into the correct categories above
              </p>
            </div>
          </div>
        );

      case 'comprehension':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">Read the passage below:</h4>
              <p className="text-gray-700 leading-relaxed text-lg">{question.passage}</p>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-semibold text-gray-900 text-lg">Answer the following questions:</h4>
              {question.subQuestions.map((subQ, subIndex) => (
                <div key={subIndex} className="border border-gray-200 rounded-lg p-6 bg-white">
                  <p className="font-medium text-gray-900 mb-4 text-lg">
                    {subIndex + 1}. {subQ.question}
                  </p>
                  {subQ.type === 'text' ? (
                    <input
                      type="text"
                      value={Array.isArray(answer) ? answer[subIndex] || '' : ''}
                      onChange={(e) => {
                        const newAnswers = Array.isArray(answer) ? [...answer] : [];
                        newAnswers[subIndex] = e.target.value;
                        handleAnswerChange(question._id, newAnswers);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your answer"
                    />
                  ) : (
                    <div className="space-y-3">
                      {subQ.options.map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-all">
                          <input
                            type="radio"
                            name={`${question._id}-${subIndex}`}
                            value={option}
                            checked={Array.isArray(answer) && answer[subIndex] === option}
                            onChange={(e) => {
                              const newAnswers = Array.isArray(answer) ? [...answer] : [];
                              newAnswers[subIndex] = e.target.value;
                              handleAnswerChange(question._id, newAnswers);
                            }}
                            className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">
            Question type "{question.type}" is not supported
          </div>
        );
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading form..." />;
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-600">The form you're looking for doesn't exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your response has been submitted successfully.
          </p>
          {score !== null && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-blue-800 font-semibold">Your Score: {score}%</p>
            </div>
          )}
          <p className="text-sm text-gray-500">
            You can now close this window.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Form Header */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {form.description}
              </p>
            )}
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>Estimated time: {Math.ceil(form.questions.length * 0.5)} minutes</span>
            </div>
          </div>

          {/* Respondent Info */}
          {form.settings.collectEmail && (
            <div className="p-8 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={respondentInfo.name}
                    onChange={(e) => setRespondentInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={respondentInfo.email}
                    onChange={(e) => setRespondentInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Body */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {form.questions.map((question, index) => (
                <div key={question._id} className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mt-1">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {question.title}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h3>
                      {question.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed">{question.description}</p>
                      )}
                      {question.image && (
                        <img
                          src={question.image}
                          alt="Question"
                          className="mb-6 max-w-md rounded-lg shadow-sm"
                        />
                      )}
                      <div className="mt-4">
                        {renderQuestion(question, index)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Submit Button */}
              <div className="pt-8 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-lg rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Submit Form</span>
                    </>
                  )}
                </button>
                <p className="mt-3 text-sm text-gray-500">
                  * Required fields must be completed before submission
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FillForm;