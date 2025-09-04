import { Type } from 'lucide-react';

export default function ClozeQuestion({ question, onChange }) {
  const handleClozeTextChange = (e) => {
    const text = e.target.value;
    
    // Extract blanks from text (words in double braces)
    const blankMatches = text.match(/\{\{([^}]+)\}\}/g) || [];
    const blanks = blankMatches.map((match, index) => ({
      position: index,
      correctAnswer: match.replace(/[{}]/g, ''),
      options: []
    }));
    
    onChange({ 
      clozeText: text,
      blanks: blanks
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-indigo-600">
        <Type className="w-4 h-4" />
        <span className="text-sm font-medium">Cloze (Fill in the Blanks)</span>
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
          Cloze Text
        </label>
        <textarea
          value={question.clozeText || ''}
          onChange={handleClozeTextChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Enter text with blanks using {{word}} format. Example: The capital of {{France}} is {{Paris}}."
        />
        <p className="text-xs text-gray-500 mt-1">
          Use double braces {{}} to create blanks. Example: {{answer}}
        </p>
      </div>

      {question.blanks && question.blanks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detected Blanks ({question.blanks.length})
          </label>
          <div className="space-y-2">
            {question.blanks.map((blank, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Blank {index + 1}:</span>
                <span className="font-medium text-gray-900">{blank.correctAnswer}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
          <div className="text-gray-700">
            {question.clozeText ? (
              question.clozeText.split(/(\{\{[^}]+\}\})/g).map((part, index) => {
                if (part.match(/\{\{[^}]+\}\}/)) {
                  return (
                    <input
                      key={index}
                      type="text"
                      className="inline-block w-20 mx-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="___"
                      disabled
                    />
                  );
                }
                return <span key={index}>{part}</span>;
              })
            ) : (
              <span className="text-gray-400 italic">Enter cloze text above to see preview</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}