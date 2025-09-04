import { BarChart3, Plus, X } from 'lucide-react';

export default function CategorizeQuestion({ question, onChange }) {
  const categories = question.categories || [''];
  const items = question.items || [{ text: '', correctCategory: '' }];

  const updateCategory = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    onChange({ categories: newCategories });
  };

  const addCategory = () => {
    onChange({ categories: [...categories, ''] });
  };

  const removeCategory = (index) => {
    if (categories.length > 1) {
      const newCategories = categories.filter((_, i) => i !== index);
      onChange({ categories: newCategories });
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ items: newItems });
  };

  const addItem = () => {
    onChange({ items: [...items, { text: '', correctCategory: '' }] });
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      onChange({ items: newItems });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-orange-600">
        <BarChart3 className="w-4 h-4" />
        <span className="text-sm font-medium">Categorize</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => updateCategory(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Category ${index + 1}`}
                />
                {categories.length > 1 && (
                  <button
                    onClick={() => removeCategory(index)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={addCategory}
            className="mt-2 flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add category</span>
          </button>
        </div>

        {/* Items */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Items to Categorize
          </label>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-lg">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(index, 'text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Item ${index + 1}`}
                />
                <select
                  value={item.correctCategory}
                  onChange={(e) => updateItem(index, 'correctCategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select correct category</option>
                  {categories.filter(cat => cat.trim()).map((category, catIndex) => (
                    <option key={catIndex} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Remove item
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={addItem}
            className="mt-2 flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add item</span>
          </button>
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

      {/* Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-900">
            {question.title || 'Question title'}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            {categories.filter(cat => cat.trim()).map((category, index) => (
              <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <p className="font-medium text-gray-700">{category}</p>
                <p className="text-xs text-gray-500 mt-1">Drop items here</p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {items.filter(item => item.text.trim()).map((item, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}