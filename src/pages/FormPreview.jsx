import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from '../contexts/FormContext';
import { 
  ArrowLeft, 
  Eye, 
  Share2, 
  Copy, 
  ExternalLink,
  Star,
  Calendar,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const FormPreview = () => {
  const { id } = useParams();
  const { currentForm, fetchForm } = useForm();
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (id) {
      fetchForm(id);
    }
  }, [id]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const copyFormLink = () => {
    const formUrl = `${window.location.origin}/form/${id}`;
    navigator.clipboard.writeText(formUrl);
    toast.success('Form link copied to clipboard!');
  };

  const shareForm = () => {
    const formUrl = `${window.location.origin}/form/${id}`;
    if (navigator.share) {
      navigator.share({
        title: currentForm.title,
        text: currentForm.description,
        url: formUrl,
      });
    } else {
      copyFormLink();
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter a number"
            required={question.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={answer}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Your answer"
            required={question.required}
          />
        );

      case 'mcq':
        return (
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={question._id}
                  value={option.text}
                  checked={answer === option.text}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                  required={question.required}
                />
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
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
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            value={answer}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className={`p-1 ${
                  answer > i ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
            <span className="ml-2 text-gray-600">
              {answer ? `${answer}/${question.maxRating || 5}` : 'Rate this'}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={question.required}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        );

      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
            <input
              type="file"
              onChange={(e) => handleAnswerChange(question._id, e.target.files[0])}
              className="hidden"
              id={`file-${question._id}`}
              required={question.required}
            />
            <label
              htmlFor={`file-${question._id}`}
              className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
            >
              Choose File
            </label>
          </div>
        );

      case 'cloze':
        const blanks = question.clozeText.split('_____');
        return (
          <div className="space-y-4">
            <div className="text-gray-700 leading-relaxed">
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
                      className="inline-block mx-1 px-2 py-1 border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 bg-transparent min-w-[100px]"
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.categories.map((category, catIndex) => (
                <div key={catIndex} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                  <div className="min-h-[100px] border-2 border-dashed border-gray-200 rounded-lg p-2">
                    {/* Items would be draggable in a real implementation */}
                    <p className="text-gray-500 text-sm">Drop items here</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Items to categorize:</h4>
              <div className="flex flex-wrap gap-2">
                {question.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg cursor-move"
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'comprehension':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Passage:</h4>
              <p className="text-gray-700 leading-relaxed">{question.passage}</p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Questions:</h4>
              {question.subQuestions.map((subQ, subIndex) => (
                <div key={subIndex} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-3">{subIndex + 1}. {subQ.question}</p>
                  {subQ.type === 'text' ? (
                    <input
                      type="text"
                      value={Array.isArray(answer) ? answer[subIndex] || '' : ''}
                      onChange={(e) => {
                        const newAnswers = Array.isArray(answer) ? [...answer] : [];
                        newAnswers[subIndex] = e.target.value;
                        handleAnswerChange(question._id, newAnswers);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your answer"
                    />
                  ) : (
                    <div className="space-y-2">
                      {subQ.options.map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center space-x-2">
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
                            className="text-blue-600 focus:ring-blue-500"
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
          <div className="text-gray-500 italic">
            Question type "{question.type}" preview not implemented
          </div>
        );
    }
  };

  if (!currentForm) {
    return <LoadingSpinner text="Loading form preview..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to={`/builder/${id}`}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Editor</span>
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Eye className="w-4 h-4" />
                <span>Preview Mode</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={copyFormLink}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </button>
              
              <button
                onClick={shareForm}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              <Link
                to={`/form/${id}`}
                target="_blank"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Form</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Form Preview */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Form Header */}
          <div className="p-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentForm.title}
            </h1>
            {currentForm.description && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {currentForm.description}
              </p>
            )}
          </div>

          {/* Form Body */}
          <div className="p-8">
            <form className="space-y-8">
              {currentForm.questions.map((question, index) => (
                <div key={question._id} className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <span className="text-sm font-medium text-gray-500 mt-1">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {question.title}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h3>
                      {question.description && (
                        <p className="text-gray-600 mb-4">{question.description}</p>
                      )}
                      {question.image && (
                        <img
                          src={question.image}
                          alt="Question"
                          className="mb-4 max-w-md rounded-lg"
                        />
                      )}
                      {renderQuestion(question, index)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  onClick={() => toast.info('This is a preview. Responses are not saved.')}
                >
                  Submit Form (Preview)
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  This is a preview. Responses will not be saved.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;