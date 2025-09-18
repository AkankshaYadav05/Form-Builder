import React from 'react';
import { Plus, X } from 'lucide-react';

function Categorize({ question, onChange }) {
  const updateText = (text) => {
    onChange({ ...question, text });
  };

  const updateCategory = (index, value) => {
    const newCategories = [...question.categories];
    newCategories[index] = value;
    onChange({ ...question, categories: newCategories });
  };

  const updateItem = (index, value) => {
    const newItems = [...question.items];
    newItems[index] = value;
    onChange({ ...question, items: newItems });
  };

  const addCategory = () => {
    onChange({ 
      ...question, 
      categories: [...question.categories, `Category ${question.categories.length + 1}`] 
    });
  };

  const removeCategory = (index) => {
    if (question.categories.length > 1) {
      const newCategories = question.categories.filter((_, i) => i !== index);
      onChange({ ...question, categories: newCategories });
    }
  };

  const addItem = () => {
    onChange({ 
      ...question, 
      items: [...question.items, `Item ${question.items.length + 1}`] 
    });
  };

  const removeItem = (index) => {
    if (question.items.length > 1) {
      const newItems = question.items.filter((_, i) => i !== index);
      onChange({ ...question, items: newItems });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <input
          type="text"
          value={question.text}
          onChange={(e) => updateText(e.target.value)}
          className="text-lg font-medium w-full focus:outline-none border-b border-gray-200 pb-2"
          placeholder="Enter your categorize question"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Categories */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
          <div className="space-y-3 mb-4">
            {question.categories.map((category, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => updateCategory(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Category ${index + 1}`}
                />
                {question.categories.length > 1 && (
                  <button
                    onClick={() => removeCategory(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addCategory}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <Plus size={14} />
            Add Category
          </button>
        </div>

        {/* Items */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Items to Categorize</h4>
          <div className="space-y-3 mb-4">
            {question.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Item ${index + 1}`}
                />
                {question.items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <Plus size={14} />
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
}

export default Categorize;