import { AlignLeft, Plus, X } from 'lucide-react';

export default function ComprehensionQuestion({ question, onChange }) {
  const subQuestions = question.subQuestions || [];

  const updateSubQuestion = (index, field, value) => {
    const newSubQuestions = [...subQuestions];
    newSubQuestions[index] = { ...newSubQuestions[index], [field]: value };
    onChange({ subQuestions: newSubQuestions });
  };

  const addSubQuestion = () => {
    const newSubQuestion = {
      id: crypto.randomUUID(),
      question: '',
      type: 'text',
      options: [],
      correctAnswer: ''
    };
    onChange({ subQuestions: [...subQuestions, newSubQuestion] });
  };

  const removeSubQuestion = (index) => {
    const newSubQuestions = subQuestions.filter((_, i) => i !== index);
    onChange({ subQuestions: newSubQuestions });
  };

  const updateSubQuestionOption = (subIndex, optIndex, value) => {
    const newSubQuestions = [...subQuestions];
    const newOptions = [...(newSubQuestions[subIndex].options || [])];
    newOptions[optIndex] = value;
    newSubQuestions[subIndex] = { ...newSubQuestions[subIndex], options: newOptions };
    onChange({ subQuestions: newSubQuestions });
  };

  const addSubQuestionOption = (subIndex) => {
    const newSubQuestions = [...subQuestions];
    const newOptions = [...(newSubQuestions[subIndex].options || []), ''];
    newSubQuestions[subIndex] = { ...newSubQuestions[subIndex], options: newOptions };
    onChange({ subQuestions: newSubQuestions });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-teal-600">
        <AlignLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Comprehension</span>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Title *
        </label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your question..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Passage
        </label>
        <textarea
          value={question.passage || ''}
          onChange={(e) => onChange({ passage: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="6"
          placeholder="Enter the passage for comprehension..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Sub-questions
          </label>
          <button
            onClick={addSubQuestion}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add sub-question</span>
          </button>
        </div>

        <div className="space-y-4">
          {subQuestions.map((subQ, index) => (
            <div key={subQ.id || index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  Sub-question {index + 1}
                </span>
                <button
                  onClick={() => removeSubQuestion(index)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={subQ.question || ''}
                  onChange={(e) => updateSubQuestion(index, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter sub-question..."
                />

                <select
                  value={subQ.type || 'text'}
                  onChange={(e) => updateSubQuestion(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Text Answer</option>
                  <option value="mcq">Multiple Choice</option>
                </select>

                {subQ.type === 'mcq' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    <div className="space-y-2">
                      {(subQ.options || []).map((option, optIndex) => (
                        <input
                          key={optIndex}
                          type="text"
                          value={option}
                          onChange={(e) => updateSubQuestionOption(index, optIndex, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Option ${optIndex + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => addSubQuestionOption(index)}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      + Add option
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    value={subQ.correctAnswer || ''}
                    onChange={(e) => updateSubQuestion(index, 'correctAnswer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter correct answer..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required || false}
          onChange={(e) => onChange({ required: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
          Required field
        </label>
      </div>
    </div>
  );
}