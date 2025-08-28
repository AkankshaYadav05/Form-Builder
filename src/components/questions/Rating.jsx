export default function Rating({ question, onChange }) {
  return (
    <div className="shadow-sm rounded-2xl p-4 bg-white mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Rating Scale</h3>
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">
          RATING
        </span>
      </div>

      <p className="text-sm mb-2">How would you rate this experience?</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className="border px-3 py-1 rounded hover:bg-blue-50"
            onClick={() => onChange({ ...question, value: n })}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
