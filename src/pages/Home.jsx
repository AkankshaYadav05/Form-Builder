import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const features = [
    {
      title: "Drag & Drop Builder",
      desc: "Easily create forms with our intuitive drag-and-drop interface. No coding required.",
    },
    {
      title: "Responsive Design",
      desc: "Your forms look and function flawlessly across all devices.",
    },
    {
      title: "Collaboration Tools",
      desc: "Work together with your team on form projects, with real-time editing.",
    },
    {
      title: "Security & Compliance",
      desc: "Protect sensitive data with robust security and compliance standards.",
    },
    {
      title: "AI Suggestions",
      desc: "Get smart recommendations for questions, layouts, and validations.",
    },
  ];

  const templates = [
    {
      id: "event",
      title: "Event Registration",
      img: "https://www.metronomenyc.com/wp-content/uploads/2024/02/pasted-image-0-2024-02-22T124853.559.png",
    },
    {
      id: "feedback",
      title: "Customer Feedback",
      img: "https://cdn.marketing123.123formbuilder.com/wp-content/uploads/2023/02/product-customer-feedback-form.jpg",
    },
    {
      id: "job",
      title: "Job Application",
      img: "https://images.docformats.net/wp-content/uploads/2025/04/Job-Application-Form-Template-Google-Docs-Word-Page-01.png",
    },
    {
      id: "contact",
      title: "Contact Form",
      img: "https://media.geeksforgeeks.org/wp-content/uploads/20231026123735/Web-capture_26-10-2023_123648_.jpg",
    },
    {
      id: "quiz",
      title: "Quiz / Survey",
      img: "https://marketplace.canva.com/EAFdZAmeAJA/1/0/1131w/canva-pastel-gradient-survey-form-document-HHbdmFgDCVU.jpg",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="px-6 md:px-10 py-4 border-b bg-white shadow-sm sticky top-0 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">FormBuilder</h1>

          {/* Hamburger Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() =>
                document
                  .getElementById("templates")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-700 hover:text-black transition"
            >
              Templates
            </button>
            <button
              onClick={() => navigate("/allForms")}
              className="text-gray-700 hover:text-black transition"
            >
              My Forms
            </button>
            <button
              onClick={() => navigate("/editor")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition"
            >
              Create Forms
            </button>
            <button className="text-gray-700 border px-4 py-2 rounded-xl hover:bg-gray-100 transition">
              Login
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="mt-4 flex flex-col space-y-3 md:hidden">
            <button
              onClick={() =>
                document
                  .getElementById("templates")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-700 hover:text-black text-left"
            >
              Templates
            </button>
            <button
              onClick={() => navigate("/allForms")}
              className="text-gray-700 hover:text-black text-left"
            >
              My Forms
            </button>
            <button
              onClick={() => navigate("/editor")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium text-left shadow-sm transition"
            >
              Create Forms
            </button>
            <button className="text-gray-700 border px-4 py-2 rounded-xl hover:bg-gray-100 text-left transition">
              Login
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-24 bg-gradient-to-r from-blue-100 via-white to-blue-50">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Build forms that <span className="text-blue-600">work for you</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Design professional forms tailored to your needs—simple, fast, and
          fully customizable.
        </p>
        <button
          onClick={() => navigate("/editor")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition transform hover:scale-105 shadow-md"
        >
          Create Your First Form
        </button>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          Everything you need to build better forms
        </h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 p-6 text-center border"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h4 className="font-semibold text-lg mb-2 text-gray-800">
                {f.title}
              </h4>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          Ready-to-use Form Templates
        </h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => navigate(`/editor?template=${tpl.id}`)}
              className="cursor-pointer bg-white rounded-2xl shadow-sm border hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <img
                src={tpl.img}
                alt={tpl.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-5">
                <h4 className="font-semibold text-gray-800 text-lg">
                  {tpl.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
