import { CheckSquare, Plus, X } from 'lucide-react';

export default function CheckboxQuestion({ question, onChange }) {
  const options = question.options || [''];

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange({ options: newOptions });
  };

  const addOption = () => {
    onChange({ options: [...options, ''] });
  };

  const removeOption = (index) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      onChange({ options: newOptions });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-purple-600">
        <CheckSquare className="w-4 h-4" />
        <span className="text-sm font-medium">Checkbox</span>
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
          Options
        </label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="text-blue-600 rounded"
                disabled
              />
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Option ${index + 1}`}
              />
              {options.length > 1 && (
                <button
                  onClick={() => removeOption(index)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={addOption}
          className="mt-2 flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add option</span>
        </button>
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