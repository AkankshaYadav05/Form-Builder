import { useState, useEffect } from "react";
import ComprehensionQuestion from "./Comprehension";
import CategorizeQuestion from "./Categorize";
import ClozeQuestion from "./Cloze";
import { useNavigate } from "react-router-dom";


export default function FormBuilder({ initialData = null, onSubmit }) {
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();


  // Initialize state from initialData when editing
  useEffect(() => {
  if (initialData) {
    console.log("FormBuilder received initialData:", initialData);
    setTitle(initialData.title || "Untitled Form");
    setDescription(initialData.description || "");
    setQuestions(initialData.questions || []);
    setImage(initialData.image || null);
  }
}, [initialData]);

console.log("title:", title);
console.log("questions:", questions);


  const addQuestion = (type) => {
    let newQuestion;
    if (type === "comprehension") {
      newQuestion = {
        id: crypto.randomUUID(),
        type,
        title: "",
        passage: "",
        options: [],
      };
    } else if (type === "categorize") {
      newQuestion = {
        id: crypto.randomUUID(),
        type,
        title: "",
        categories: [],
        items: [],
      };
    } else if (type === "cloze") {
      newQuestion = {
        id: crypto.randomUUID(),
        type,
        text: "",
        blanks: [],
      };
    }
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id, updatedQuestion) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? updatedQuestion : q))
    );
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Call onSubmit with current form data
const handleSubmit = () => {
  console.log("Save & Preview clicked");
  navigate("/preview", { state: { formData: { title, description, image, questions } } });
};



  return (
    <div className="w-full min-h-screen p-6 space-y-8 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl shadow p-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold">
            Custom Form Builder — <span className="font-semibold">Editor</span>
          </h1>
          <p className="text-gray-500 mt-2 max-w-lg">
            Build beautiful forms with categorize, cloze, and comprehension
            questions. Add images, then share your form link.
          </p>

          <button
            onClick={handleSubmit}
            type="button"
            className="mt-6 px-5 py-2 bg-[#0f172a] text-white rounded-md shadow hover:bg-[#1e293b]"
          >
            Save &amp; Preview
          </button>
        </div>

        {/* Form Info */}
        <div className="space-y-4 w-full max-w-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Form title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Header image(optional)
            </label>
            <input
              type="file"
              id="headerImageUpload"
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <label
              htmlFor="headerImageUpload"
              className="inline-block cursor-pointer px-4 py-2 bg-gray-200 text-black rounded-md shadow"
            >
            Choose Image
            </label>

        {/* Preview */}
          {image && (
            <img
              src={image}
              alt="Header Preview"
              className="mt-2 max-h-40 object-contain"
            />
          )}
          </div>
        </div>
      </div>

      {/* Add Question Buttons */}
      <div className="mb-6">
  <div className="flex justify-between items-center">
    {/* Left side: Questions heading */}
    <h2 className="text-lg font-semibold">Questions</h2>

    {/* Right side: Buttons side by side */}
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => addQuestion("categorize")}
        className="px-4 py-2 rounded-md bg-[#0f172a] text-white hover:bg-[#1e293b]"
      >
        Add Categorize
      </button>
      <button
        type="button"
        onClick={() => addQuestion("cloze")}
        className="px-4 py-2 rounded-md bg-[#0f172a] text-white hover:bg-[#1e293b]"
      >
        Add Cloze
      </button>
      <button
        type="button"
        onClick={() => addQuestion("comprehension")}
        className="px-4 py-2 rounded-md bg-[#0f172a] text-white hover:bg-[#1e293b]"
      >
        Add Comprehension
      </button>
    </div>
  </div>

  {/* Full width box below */}
  {questions.length === 0 && (
    <div className="mt-10 w-full h-24  border border-gray-300 rounded-md flex items-center justify-center text-gray-500 text-md">
      No questions yet. Add one to get started.
    </div>
  )}
</div>


      {/* Render Questions */}
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="rounded-lg p-4 shadow-sm bg-white">
            {q.type === "comprehension" && (
              <ComprehensionQuestion
                question={q}
                onChange={(updated) => updateQuestion(q.id, updated)}
                onDelete={() => deleteQuestion(q.id)}
              />
            )}

            {q.type === "categorize" && (
              <CategorizeQuestion
                question={q}
                onChange={(updated) => updateQuestion(q.id, updated)}
                onDelete={() => deleteQuestion(q.id)}
              />
            )}

            {q.type === "cloze" && (
              <ClozeQuestion
                question={q}
                onChange={(updated) => updateQuestion(q.id, updated)}
                onDelete={() => deleteQuestion(q.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
