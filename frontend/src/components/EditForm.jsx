import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormBuilder from "../pages/FormBuilder";

export default function EditForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://form-builder-o2wt.onrender.com/api/forms/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch form");
        return res.json();
      })
      .then((data) => {
        setFormData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading form...</p>;
  if (!formData) return <p className="p-6 text-center text-red-600">Form not found.</p>;

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Edit Form — <span className="text-indigo-700">Customize</span>
      </h1>

      <FormBuilder
  initialData={formData}
  onSubmit={(updatedForm) => {
    console.log("Submitting updated form:", updatedForm);
    fetch(`https://form-builder-o2wt.onrender.com/api/forms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedForm),
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error("Failed to update form");
        navigate("/allForms");
      })
      .catch((err) => {
        console.error("Update error:", err);
        alert("Failed to update the form. Please try again.");
      });
  }}
/>

      
    </div>
  );
}
