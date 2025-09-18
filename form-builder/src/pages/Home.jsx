import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MousePointer, 
  Smartphone, 
  Users, 
  Shield, 
  Brain,
  Menu,
  X
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const features = [
    {
      title: "Drag & Drop Builder",
      desc: "Easily create forms with our intuitive drag-and-drop interface. No coding required.",
      icon: <MousePointer className="text-blue-500" size={32} />
    },
    {
      title: "Responsive Design",
      desc: "Your forms look and function flawlessly across all devices.",
      icon: <Smartphone className="text-green-500" size={32} />
    },
    {
      title: "Collaboration Tools",
      desc: "Work together with your team on form projects, with real-time editing.",
      icon: <Users className="text-purple-500" size={32} />
    },
    {
      title: "Security & Compliance",
      desc: "Protect sensitive data with robust security and compliance standards.",
      icon: <Shield className="text-red-500" size={32} />
    },
    {
      title: "AI Suggestions",
      desc: "Get smart recommendations for questions, layouts, and validations.",
      icon: <Brain className="text-orange-500" size={32} />
    },
  ];

  const templates = [
    {
      id: "event",
      title: "Event Registration",
      img: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "feedback",
      title: "Customer Feedback",
      img: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "job",
      title: "Job Application",
      img: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "contact",
      title: "Contact Form",
      img: "https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "quiz",
      title: "Quiz / Survey",
      img: "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  const scrollToTemplates = () => {
    const element = document.getElementById("templates");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="px-6 md:px-10 py-4 border-b bg-white shadow-sm sticky top-0 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">✨FormBuilder</h1>

          {/* Hamburger Button */}
          <button
            className="md:hidden text-2xl p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={scrollToTemplates}
              className="text-gray-700 hover:text-blue-600 transition duration-200"
            >
              Templates
            </button>
            <button
              onClick={() => navigate("/forms")}
              className="text-gray-700 hover:text-blue-600 transition duration-200"
            >
              My Forms
            </button>
            <button
              onClick={() => navigate("/editor")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition duration-200 transform hover:scale-105"
            >
              Create Forms
            </button>
            <button className="text-gray-700 border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 transition duration-200">
              Login
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="mt-4 flex flex-col space-y-3 md:hidden bg-white border rounded-lg p-4 shadow-lg">
            <button
              onClick={scrollToTemplates}
              className="text-gray-700 hover:text-blue-600 text-left py-2 transition duration-200"
            >
              Templates
            </button>
            <button
              onClick={() => {
                navigate("/forms");
                setOpen(false);
              }}
              className="text-gray-700 hover:text-blue-600 text-left py-2 transition duration-200"
            >
              My Forms
            </button>
            <button
              onClick={() => {
                navigate("/editor");
                setOpen(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium text-left shadow-sm transition duration-200"
            >
              Create Forms
            </button>
            <button className="text-gray-700 border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 text-left transition duration-200">
              Login
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-24 bg-gradient-to-br from-blue-100 via-white to-purple-50">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Build forms that <span className="text-blue-600">work for you</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Design professional forms tailored to your needs—simple, fast, and
          fully customizable.
        </p>
        <button
          onClick={() => navigate("/editor")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition duration-200 transform hover:scale-105 shadow-lg"
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
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 transform hover:-translate-y-2 p-6 text-center border border-gray-100"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h4 className="font-semibold text-lg mb-3 text-gray-800">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="max-w-6xl mx-auto px-6 py-20 bg-white rounded-3xl mx-6 shadow-sm">
        <h3 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          Ready-to-use Form Templates
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => navigate(`/editor?template=${template.id}`)}
              className="cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={template.img}
                  alt={template.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                  onError={(e) => {
                    e.target.src = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition duration-200">
                  {template.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center px-6 py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to get started?
        </h3>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Join thousands of users who trust FormBuilder for their form creation needs.
        </p>
        <button
          onClick={() => navigate("/editor")}
          className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold transition duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Start Building Forms
        </button>
      </section>
    </div>
  );
}

export default Home;