import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash , FaShareAlt} from "react-icons/fa";

function DeleteConfirmModal({ isOpen, onClose, onConfirm, formTitle, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Confirm Delete</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold">{formTitle}</span>? This will also remove all submitted responses.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FormList() {
  const [forms, setForms] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/forms")
      .then((res) => res.json())
      .then((data) => setForms(data))
      .catch((err) => console.error("Error fetching forms:", err));
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDeleteClick = (form) => {
    setSelectedForm(form);
    setDeleteModalOpen(true);
    setMessage(null);
    console.log("Deleting form with ID:", form._id);
  };

  const confirmDelete = async () => {
    if (!selectedForm) return;

    setIsDeleting(true);
    setMessage(null);

    const previousForms = [...forms];
    setForms(forms.filter((f) => f._id !== selectedForm._id));

    try {
      const res = await fetch(`http://localhost:5000/api/forms/${selectedForm._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setMessage({ type: "success", text: "Form deleted successfully!" });
    } catch (error) {
      setForms(previousForms);
      setMessage({ type: "error", text: "Failed to delete form. Please try again." });
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedForm(null);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📋 My Forms</h1>
        <Link
          to="/editor"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          + Create Form
        </Link>
      </div>

      {/* Message popup */}
      {message && (
  <div
    className={`mb-4 px-4 py-2 rounded flex justify-between items-center ${
      message.type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
    }`}
  >
    <span>{message.text}</span>
    <button
      onClick={() => setMessage(null)}
      className="ml-4 text-xl font-bold leading-none hover:text-gray-700"
      aria-label="Close notification"
    >
      &times;
    </button>
  </div>
)}


      {/* No forms */}
      {forms.length === 0 ? (
        <p className="text-gray-500">No forms found. Create your first one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms && forms.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition p-5 flex flex-col justify-between border border-gray-200"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {form.title || "Untitled Form"}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {form.description?.trim() || "No description provided"}
                </p>

                {/* Preview first 2 questions */}
                {form.questions?.length > 0 && (
                  <ul className="text-sm text-gray-600 mb-4 list-disc pl-5">
                    {form.questions.slice(0, 2).map((q, i) => (
                      <li key={i}>{q.title || "Untitled Question"}</li>
                    ))}
                    {form.questions.length > 2 && (
                      <li className="text-blue-500">+ {form.questions.length - 2} more</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-sm text-gray-400 border-t pt-3 mt-3">
                <span>📄 {form.questions?.length || 0} Qs</span>
                <span>📅 {formatDate(form.createdAt)}</span>
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center mt-4">
  {/* Left side buttons */}
  <div className="flex gap-2">
    <Link
      to={`/forms/${form._id}/edit`}
      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
    >
      Edit
    </Link>
    <Link
      to={`/forms/${form._id}/responses`}
      className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
    >
      View Responses
    </Link>
  </div>

  {/* Right side buttons */}
  <div className="flex gap-3 items-center">
    <Link
      to={`/form/${form._id}/fill`}
      className="flex items-center gap-1 text-green-500 hover:text-green-600"
      title="Share Link"
    >
      <FaShareAlt size={14} />
      Share
    </Link>

    <button
      onClick={() => handleDeleteClick(form)}
      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
      title="Delete Form"
      disabled={isDeleting}
    >
      <FaTrash size={14} />
    </button>
  </div>
</div>

            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        formTitle={selectedForm?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
}
