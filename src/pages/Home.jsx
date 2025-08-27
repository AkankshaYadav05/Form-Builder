import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const features = [
    {
      title: "Drag & Drop Builder",
      desc: "Easily create forms with our intuitive drag-and-drop interface. No coding required.",
      icon: "🖱️",
    },
    {
      title: "Responsive Design",
      desc: "Your forms look and function flawlessly across all devices.",
      icon: "📱",
    },
    {
      title: "Collaboration Tools",
      desc: "Work together with your team on form projects, with real-time editing.",
      icon: "🤝",
    },
    {
      title: "Security & Compliance",
      desc: "Protect sensitive data with robust security and compliance standards.",
      icon: "🔒",
    },
    {
      title: "AI Suggestions",
      desc: "Get smart recommendations for questions, layouts, and validations.",
      icon: "⚡",
    },
  ];

  const templates = [
  {
    id: "event",
    title: "Event Registration",
    img: "https://www.metronomenyc.com/wp-content/uploads/2024/02/pasted-image-0-2024-02-22T124853.559.png"
  },
  {
    id: "feedback",
    title: "Customer Feedback",
    img: "https://cdn.marketing123.123formbuilder.com/wp-content/uploads/2023/02/product-customer-feedback-form.jpg"
  },
  {
    id: "job",
    title: "Job Application",
    img: "https://images.docformats.net/wp-content/uploads/2025/04/Job-Application-Form-Template-Google-Docs-Word-Page-01.png"
  },
  {
    id: "contact",
    title: "Contact Form",
    img: "https://media.geeksforgeeks.org/wp-content/uploads/20231026123735/Web-capture_26-10-2023_123648_.jpg"
  },
  {
    id: "quiz",
    title: "Quiz / Survey",
    img: "https://marketplace.canva.com/EAFdZAmeAJA/1/0/1131w/canva-pastel-gradient-survey-form-document-HHbdmFgDCVU.jpg"
  }
];



  return (
    <div className="bg-white min-h-screen">
      {/* Navbar */}
      <nav className="px-6 md:px-10 py-4 border-b bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">FormBuilder</h1>

        {/* Hamburger Button (visible on small) */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => document.getElementById("templates").scrollIntoView({ behavior: "smooth" })}
            className="text-gray-700 hover:text-black"
          >
            Templates
          </button>
          <button
            onClick={() => navigate("/allForms")}
            className="text-gray-700 hover:text-black"
          >
            My Forms
          </button>
          <button
            onClick={() => navigate("/editor")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Create Forms
          </button>
          <button className="text-gray-700 border px-4 py-2 rounded-md hover:bg-gray-100">
            Login
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="mt-4 flex flex-col space-y-3 md:hidden">
          <button
            onClick={() => document.getElementById("templates").scrollIntoView({ behavior: "smooth" })}
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-left"
          >
            Create Forms
          </button>
          <button className="text-gray-700 border px-4 py-2 rounded-md hover:bg-gray-100 text-left">
            Login
          </button>
        </div>
      )}
    </nav>
  

      {/* Hero */}
      <section className="text-center px-6 py-20 bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
          Build forms that work for you
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Design professional forms tailored to your needs—simple, fast, and fully customizable
        </p>
        <button
          onClick={() => navigate("/editor")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition"
        >
          Create Forms
        </button>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Everything you need to build better forms
        </h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-lg transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h4 className="font-semibold text-lg mb-2">{f.title}</h4>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">Form Templates</h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.map((tpl) => (
  <div
    key={tpl.id}
    onClick={() => navigate(`/editor?template=${tpl.id}`)}
    className="cursor-pointer bg-white border rounded-lg shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
  >
    <img
      src={tpl.img}
      alt={tpl.title}
      className="w-full h-40 object-cover rounded-t-lg"
    />
    <div className="p-4">
      <h4 className="font-semibold text-gray-800 mb-1">{tpl.title}</h4>
    </div>
  </div>
))}

        </div>
      </section>
    </div>
  );
}

export default Home;
