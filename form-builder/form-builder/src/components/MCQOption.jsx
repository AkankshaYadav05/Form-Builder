export default function MCQOption({ index, option, onUpdate, onRemove }) {
  const handleTextChange = (e) => {
    onUpdate({ ...option, text: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onUpdate({ ...option, image: file })
    }
  }

  return (
    <div className="border rounded-md p-3 space-y-2">
      <div className="flex justify-between">
        <p className="font-medium">Option {index + 1}</p>
        <button onClick={onRemove} className="text-red-400 text-sm">Remove</button>
      </div>
      <input
        type="text"
        placeholder="Option text"
        value={option.text}
        onChange={handleTextChange}
        className="border rounded-md px-3 py-2 w-full"
      />
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block"
        />
        {option.image && (
          <img
            src={URL.createObjectURL(option.image)}
            alt="option"
            className="mt-2 max-h-32 rounded-md"
          />
        )}
      </div>
    </div>
  )
}
