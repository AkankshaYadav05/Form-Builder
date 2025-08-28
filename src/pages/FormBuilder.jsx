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
  ChevronDown,
  Save,
  Eye,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import axios from "axios";

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

import SidebarBtn from "../components/SidebarBtn";

export default function FormBuilder() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form description");
  const [loading, setLoading] = useState(false);

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

  const COMPONENTS = {
    mcq: MCQ,
    comprehension: Comprehension,
    cloze: Cloze,
    rating: Rating,
    checkbox: Checkbox,
    file: FileUpload,
    categorize: Categorize,
    short: ShortAnswer,
    dropdown: Dropdown,
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

  const moveQuestion = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    )
      return;

    const newQuestions = [...questions];
    const [removed] = newQuestions.splice(index, 1);
    newQuestions.splice(direction === "up" ? index - 1 : index + 1, 0, removed);
    setQuestions(newQuestions);
  };

  const saveForm = async () => {
    if (!title.trim()) {
      alert("Please enter a form title");
      return;
    }
    if (questions.length === 0) {
      alert("Add at least one question before saving");
      return;
    }
    try {
      setLoading(true);
      const payload = { title, description, questions };
      await axios.post("/api/forms", payload);
      alert("Form saved successfully!");
      setQuestions([]);
      setTitle("Untitled Form");
      setDescription("Form description");
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r shadow-md sticky top-0 h-screen p-4 space-y-4 ">
        <h2 className="text-lg font-semibold mb-4">Add Question</h2>
        <div className="space-y-3">
          {Object.keys(QUESTION_TEMPLATES).map((type) => (
            <SidebarBtn
              key={type}
              icon={<List size={16} />}
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              onClick={() => addQuestion(type)}
            />
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 space-y-6 max-w-5xl mx-auto">
        {/* Title */}
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
          {questions.map((q, idx) => {
            const Component = COMPONENTS[q.type];
            return (
              <div
                key={q.id}
                className="rounded-lg relative"
              >
                <div className="absolute bottom-2 right-3 flex gap-2">
                  <button
                    onClick={() => moveQuestion(idx, "up")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveQuestion(idx, "down")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {Component && (
                  <Component question={q} onChange={(u) => updateQuestion(q.id, u)} />
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => addQuestion("mcq")}
            className="flex items-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
          >
            <PlusCircle size={18} /> Add Question
          </button>
          <button
            onClick={saveForm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save size={18} /> {loading ? "Saving..." : "Save Form"}
          </button>
          <button
            onClick={() => setQuestions([])}
            className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-600 rounded-md hover:bg-gray-100"
          >
            <Trash2 size={18} /> Clear
          </button>
        </div>
      </main>
    </div>
  );
}
