import React from "react";

export default function CategorizeQuestion({ question, onChange, onDelete }) {
  const { title, categories = [], items = [], image } = question;

  const handleTitleChange = (e) => {
    onChange({ ...question, title: e.target.value });
  };

  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    onChange({ ...question, categories: newCategories });
  };

  const handleAddCategory = () => {
    onChange({ ...question, categories: [...categories, ""] });
  };

  const handleRemoveCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    onChange({ ...question, categories: newCategories });
  };

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange({ ...question, items: newItems });
  };

  const handleAddItem = () => {
    onChange({ ...question, items: [...items, ""] });
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange({ ...question, items: newItems });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onChange({ ...question, image: url });
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 w-full bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Categorize</h2>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700 font-medium">
          Remove
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="New Question"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          {categories.map((cat, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-md p-2"
                value={cat}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
              />
              <button
                onClick={() => handleRemoveCategory(index)}
                className="ml-2 text-red-500 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          <button onClick={handleAddCategory} className="mt-2 text-blue-500 text-sm hover:underline">
            + Add Category
          </button>
        </div>

        {/* Items */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Items</label>
          {items.map((item, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-md p-2"
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
              />
              <button
                onClick={() => handleRemoveItem(index)}
                className="ml-2 text-red-500 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          <button onClick={handleAddItem} className="mt-2 text-blue-500 text-sm hover:underline">
            + Add Item
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Question image</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
        {image && <img src={image} alt="preview" className="mt-2 h-20 object-cover" />}
      </div>
    </div>
  );
}
