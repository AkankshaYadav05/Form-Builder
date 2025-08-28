export default function Categorize({ question }) {
  return (
    <div className="shadow-sm rounded-2xl p-4 bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Categorize Items</h3>
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">
          CATEGORIZE
        </span>
      </div>

      <p className="text-sm mb-2">Drag items to the correct categories</p>
      <div className="grid grid-cols-2 gap-4 mb-3">
        {question.categories.map((cat, idx) => (
          <div key={idx} className="border border-dashed rounded-lg p-3 text-center text-gray-600">
            {cat}
          </div>
        ))}
      </div>

      <p className="text-sm mb-2">Items to categorize:</p>
      <div className="flex gap-2 flex-wrap">
        {question.items.map((item, idx) => (
          <span key={idx} className="px-3 py-1 bg-gray-100 rounded-md text-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
