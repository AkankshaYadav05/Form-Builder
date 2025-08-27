export default function Cloze({ question, onChange }) {
  return (
    <div className="border border-dashed rounded-2xl p-4 bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Fill in the Blanks</h3>
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">
          CLOZE
        </span>
      </div>

      <input
        type="text"
        placeholder="Enter sentence with ___ for blanks"
        value={question.text}
        onChange={(e) => onChange({ ...question, text: e.target.value })}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
