import { AlignLeft } from 'lucide-react';

export default function TextareaQuestion({ question, onChange }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-green-600">
        <AlignLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Long Text</span>
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
          Description (optional)
        </label>
        <input
          type="text"
          value={question.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a description..."
        />
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

      {/* Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            {question.title || 'Question title'}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {question.description && (
            <p className="text-sm text-gray-600">{question.description}</p>
          )}
          <textarea
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            rows="4"
            placeholder="Long answer text"
          />
        </div>
      </div>
    </div>
  );
}