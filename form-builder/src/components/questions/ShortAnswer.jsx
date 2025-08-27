export default function ShortAnswer({ question, onChange }) {
  return (
    <div className="border border-dashed rounded-2xl p-4 bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Short Answer</h3>
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">
          SHORT-ANSWER
        </span>
      </div>

      <p className="text-sm mb-2">Please provide your answer:</p>
      <textarea
        placeholder="Type your answer here..."
        value={question.answer || ""}
        onChange={(e) => onChange({ ...question, answer: e.target.value })}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
