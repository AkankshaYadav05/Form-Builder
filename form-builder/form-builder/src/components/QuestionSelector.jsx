export default function QuestionSelector({ onSelect }) {
  return (
    <div className="flex gap-4 mb-4">
      {['Categorize', 'Cloze', 'Comprehension'].map((type) => (
        <button
          key={type}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          onClick={() => onSelect(type.toLowerCase())}
        >
          {type}
        </button>
      ))}
    </div>
  )
}
