export default function Comprehension({ question, onChange }) {
  return (
    <div className="shadow-sm rounded-2xl p-4 bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Reading Comprehension</h3>
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">
          COMPREHENSION
        </span>
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-1">Passage:</label>
      <textarea
        placeholder="Insert your passage here..."
        value={question.passage}
        onChange={(e) => onChange({ ...question, passage: e.target.value })}
        className="w-170 h-30 border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-500"
      />

      <p className="text-sm text-gray-600">Read the passage and answer the questions.</p>
    </div>
  );
}
