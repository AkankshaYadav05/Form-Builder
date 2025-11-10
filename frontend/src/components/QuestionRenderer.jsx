import React, { useRef, useState } from 'react';
import { Star, Upload, Calendar, Clock, ChevronDown, AlertCircle } from 'lucide-react';
import axios from 'axios';

export function QuestionRenderer({ question, answer, hasError, onChange }) {
  const questionProps = { question, answer, onChange };

  let QuestionComponent;
  switch (question.type) {
    case 'mcq':
      QuestionComponent = MCQ;
      break;
    case 'checkbox':
      QuestionComponent = Checkbox;
      break;
    case 'short':
      QuestionComponent = ShortAnswer;
      break;
    case 'long':
      QuestionComponent = LongAnswer;
      break;
    case 'rating':
      QuestionComponent = Rating;
      break;
    case 'dropdown':
      QuestionComponent = Dropdown;
      break;
    case 'categorize':
      QuestionComponent = Categorize;
      break;
    case 'file':
      QuestionComponent = FileUpload;
      break;
    case 'date':
      QuestionComponent = Date;
      break;
    case 'time':
      QuestionComponent = Time;
      break;
    default:
      return <div className="text-sm sm:text-base">Unsupported question type</div>;
  }

  return (
    <div className={`mb-6 sm:mb-8 transition-all duration-300 ${hasError ? 'animate-shake' : ''}`}>
      <QuestionComponent {...questionProps} />
      {hasError && (
        <div className="flex items-center gap-2 mt-2 text-red-600">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span className="text-xs sm:text-sm">This question is required</span>
        </div>
      )}
    </div>
  );
}

function MCQ({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <label
            key={index}
            className="flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={answer === option}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-3 sm:mr-4 flex-shrink-0"
            />
            <span className="text-sm sm:text-base text-gray-700 font-medium break-words">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Checkbox({ question, answer, onChange }) {
  const selectedOptions = Array.isArray(answer) ? answer : [];

  const handleChange = (option) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    onChange(newSelection);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <label
            key={index}
            className="flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleChange(option)}
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-3 sm:mr-4 rounded flex-shrink-0"
            />
            <span className="text-sm sm:text-base text-gray-700 font-medium break-words">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ShortAnswer({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <input
        type="text"
        value={answer || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        placeholder="Type your answer here..."
      />
    </div>
  );
}

function LongAnswer({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <textarea
        value={answer || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
        placeholder="Type your detailed answer here..."
      />
    </div>
  );
}

function Rating({ question, answer, onChange }) {
  const scale = question.scale || 5;

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
        {Array.from({ length: scale }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onChange(index + 1)}
            className="transition-all duration-200 hover:scale-110"
          >
            <Star
              size={28}
              className={`sm:w-8 sm:h-8 ${
                answer && answer > index
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
      <div className="text-center text-xs sm:text-sm text-gray-600">
        {answer ? `${answer} out of ${scale} stars` : 'Click to rate'}
      </div>
    </div>
  );
}

function Dropdown({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="relative">
        <select
          value={answer || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white"
        >
          <option value="">Select an option...</option>
          {question.options?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
      </div>
    </div>
  );
}

function Categorize({ question, answer, onChange }) {
  const categories = question.categories || [];
  const items = question.items || [];

  const handleSelect = (item, category) => {
    const newAnswer = { ...answer };

    for (const cat of categories) {
      newAnswer[cat] = newAnswer[cat]?.filter((i) => i !== item) || [];
    }

    if (category) {
      newAnswer[category] = [...(newAnswer[category] || []), item];
    }
    onChange(newAnswer);
  };

  const getSelectedCategory = (item) => {
    for (const cat of categories) {
      if (answer?.[cat]?.includes(item)) return cat;
    }
    return '';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200"
          >
            <span className="text-sm sm:text-base font-medium text-gray-700">{item}</span>

            <select
              value={getSelectedCategory(item)}
              onChange={(e) => handleSelect(item, e.target.value)}
              className="px-3 py-2 sm:px-4 sm:py-2 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            >
              <option value="">Select category...</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function FileUpload({ question, answer, onChange }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('https://form-builder-production-cee9.up.railway.app/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // res.data.filePath contains something like "/uploads/filename.ext"
      onChange(res.data.filePath);
    } catch (err) {
      console.error(err);
      alert('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div
        onClick={openFileDialog}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer ${
          uploading ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <Upload className="mx-auto text-gray-400 mb-3 sm:mb-4" size={40} />
        <p className="text-sm sm:text-base text-gray-600 mb-2 px-2">
          Drag and drop your file here, or click to browse
        </p>
        {uploading && <p className="text-xs text-gray-500">Uploading...</p>}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        {answer && (
          <p className="mt-2 text-xs sm:text-sm text-green-600 break-all px-2">
            <a href={`https://form-builder-production-cee9.up.railway.app/${answer}`} target="_blank" rel="noopener noreferrer">
              {answer.split('/').pop()}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}


function Date({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="relative">
        <input
          type="date"
          value={answer || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <Calendar
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
      </div>
    </div>
  );
}

function Time({ question, answer, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{question.text}</h3>
      <div className="relative">
        <input
          type="time"
          value={answer || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <Clock
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
      </div>
    </div>
  );
}
