import { useState } from "react";
import {
  PlusCircle,
  FileText,
  List,
  CheckSquare,
  Star,
  Type,
  Upload,
  Tags,
  AlignLeft,
  ChevronDown
} from "lucide-react";

// Question Components
import MCQ from "../components/questions/MCQ";
import Comprehension from "../components/questions/Comprehension";
import Cloze from "../components/questions/Cloze";
import Rating from "../components/questions/Rating";
import Checkbox from "../components/questions/Checkbox";
import FileUpload from "../components/questions/FileUpload";
import Categorize from "../components/questions/Categorize";
import ShortAnswer from "../components/questions/ShortAnswer";
import Dropdown from "../components/questions/Dropdown";

// Sidebar button component
import SidebarBtn from "../components/SidebarBtn";

export default function FormBuilder() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form description");

  const QUESTION_TEMPLATES = {
    mcq: { type: "mcq", text: "", options: [""] },
    comprehension: { type: "comprehension", title: "", passage: "", subQuestions: [] },
    cloze: { type: "cloze", text: "", blanks: [] },
    rating: { type: "rating", text: "", scale: 5 },
    checkbox: { type: "checkbox", text: "", options: [""] },
    file: { type: "file", text: "" },
    categorize: { type: "categorize", text: "", categories: ["Category 1"], items: ["Item 1"] },
    short: { type: "short", text: "" },
    dropdown: { type: "dropdown", text: "", options: ["Option 1"] },
  };

  const addQuestion = (type) => {
    setQuestions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...QUESTION_TEMPLATES[type] },
    ]);
  };

  const updateQuestion = (id, updated) =>
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));

  const deleteQuestion = (id) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r shadow-md sticky top-0 h-screen p-4 space-y-4">
        <h2 className="text-lg font-semibold mb-4">Add Question</h2>
        <div className="space-y-3">
          <SidebarBtn icon={<List size={16} />} label="MCQ" onClick={() => addQuestion("mcq")} />
          <SidebarBtn icon={<FileText size={16} />} label="Comprehension" onClick={() => addQuestion("comprehension")} />
          <SidebarBtn icon={<Type size={16} />} label="Cloze" onClick={() => addQuestion("cloze")} />
          <SidebarBtn icon={<Star size={16} />} label="Rating" onClick={() => addQuestion("rating")} />
          <SidebarBtn icon={<CheckSquare size={16} />} label="Checkbox" onClick={() => addQuestion("checkbox")} />
          <SidebarBtn icon={<Upload size={16} />} label="File Upload" onClick={() => addQuestion("file")} />
          <SidebarBtn icon={<Tags size={16} />} label="Categorize" onClick={() => addQuestion("categorize")} />
          <SidebarBtn icon={<AlignLeft size={16} />} label="Short Answer" onClick={() => addQuestion("short")} />
          <SidebarBtn icon={<ChevronDown size={16} />} label="Dropdown" onClick={() => addQuestion("dropdown")} />
        </div>
      </aside>

      {/* Main Form Canvas */}
      <main className="flex-1 p-10 space-y-6">
        {/* Form Title & Description */}
        <div className="bg-white rounded-xl shadow p-6 border">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold w-full focus:outline-none border-b pb-2"
            placeholder="Form Title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-gray-500 w-full mt-2 focus:outline-none border-b pb-2"
            placeholder="Form description"
          />
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white border rounded-lg shadow p-4 relative"
            >
              <button
                onClick={() => deleteQuestion(q.id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
              >
                ✕
              </button>

              {q.type === "mcq" && (
                <MCQ question={q} onChange={(u) => updateQuestion(q.id, u)} />
              )}
              {q.type === "comprehension" && (
                <Comprehension question={q} onChange={(u) => updateQuestion(q.id, u)} />
              )}
              {q.type === "cloze" && (
                <Cloze question={q} onChange={(u) => updateQuestion(q.id, u)} />
              )}
              {q.type === "rating" && (
                <Rating question={q} onChange={(u) => updateQuestion(q.id, u)} />
              )}
              {q.type === "checkbox" && (
                <Checkbox question={q} onChange={(u) => updateQuestion(q.id, u)} />
              )}
              {q.type === "file" && (
                <FileUpload question={q} onChange={(u) => updateQuestion(q.id, u)} />
              )}
              {q.type === "categorize" && (
                <Categorize question={q} onChange={(u) => updateQuestion(q.id, u)} />
              )}
              {q.type === "short" && (
                <ShortAnswer question={q} onChange={(u) => updateQuestion(q.id, u)} />
              )}
              {q.type === "dropdown" && (
                <Dropdown question={q} onChange={(u) => updateQuestion(q.id, u)} />
              )}
            </div>
          ))}
        </div>

        {/* Add Section / Question */}
        <div className="flex justify-center">
          <button
            onClick={() => addQuestion("mcq")}
            className="flex items-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
          >
            <PlusCircle size={18} /> Add Question
          </button>
        </div>
      </main>
    </div>
  );
}
