import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import AuthForm from "../components/AuthForm";
import axios from "axios";

import {
  MousePointer, Smartphone, Users, Shield, Brain,
  Menu, X, ChevronLeft, ChevronRight
} from "lucide-react";

axios.defaults.withCredentials = true;

export function Home() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState("login");
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  

  const handleAuthSuccess = (username) => {
    setAuth(username);
    setShowAuth(false);
  };

 const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/logout");
      setAuth(null);
      setDropdownOpen(false); // close dropdown after logout
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleProtectedNavigate = (path) => {
    if (!auth) {
      setShowAuth(true);
      setAuthType("login");
      return;
    }
    navigate(path);
  };

  const scrollToTemplates = () => {
    const el = document.getElementById("templates");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const features = [
    { title: "Drag & Drop Builder", desc: "Easily create forms with drag-and-drop.", icon: <MousePointer className="text-blue-500" size={32} /> },
    { title: "Responsive Design", desc: "Forms look perfect on any device.", icon: <Smartphone className="text-green-500" size={32} /> },
    { title: "Collaboration Tools", desc: "Work together in real-time.", icon: <Users className="text-purple-500" size={32} /> },
    { title: "Security & Compliance", desc: "Keep your data safe.", icon: <Shield className="text-red-500" size={32} /> },
    { title: "AI Suggestions", desc: "Smart recommendations for questions and layouts.", icon: <Brain className="text-orange-500" size={32} /> },
  ];

  const templates = [
    { id: "event", title: "Event Registration", img: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "feedback", title: "Customer Feedback", img: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "job", title: "Job Application", img: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "contact", title: "Contact Form", img: "https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "registration", title: "Form Registration", img: "https://images.pexels.com/photos/7821682/pexels-photo-7821682.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "quiz", title: "Survey Form", img: "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ===== Navbar ===== */}
      <nav className="px-4 sm:px-6 md:px-10 py-4 border-b bg-white shadow-sm sticky top-0 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">FormBuilder</h1>

          <button
            className="md:hidden text-2xl p-2 hover:bg-gray-100 rounded-lg transition"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <button onClick={scrollToTemplates} className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm lg:text-base">Templates</button>
            <button onClick={() => handleProtectedNavigate("/forms")} className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm lg:text-base">My Forms</button>
            <button onClick={() => handleProtectedNavigate("/editor")} className="bg-blue-600 hover:bg-blue-700 text-white px-3 lg:px-4 py-2 rounded-xl font-medium shadow-sm transition duration-200 transform hover:scale-105 text-sm lg:text-base">Create Forms</button>

            {!auth ? (
              <button
                onClick={() => { setShowAuth(true); setAuthType("login"); }}
                className="text-gray-700 border border-gray-300 px-3 lg:px-4 py-2 rounded-xl hover:bg-gray-100 transition duration-200 text-sm lg:text-base"
              >
                Login / Sign Up
              </button>
            ) : (
              <>
                
                {/* Profile Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 lg:px-4 py-2 rounded-xl transition duration-200 text-sm lg:text-base max-w-[160px] overflow-hidden"
      >
        <img
          src="https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"
          alt="Profile"
          className="w-6 h-6 rounded-full flex-shrink-0"
        />
        <span className="truncate">{auth}</span>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-10 mt-35 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <button
            onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200 rounded-t-xl"
          >
            Profile
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200 rounded-b-xl text-red-500"
          >
            Logout
          </button>
        </div>
      )}
              </>
            )}
          </div>
        </div>

        {open && (
          <div className="mt-4 flex flex-col space-y-3 md:hidden bg-white border rounded-lg p-4 shadow-lg">
            <button onClick={scrollToTemplates} className="text-gray-700 hover:text-blue-600 text-left py-2 transition duration-200 border-b border-gray-100">Templates</button>
            <button onClick={() => { handleProtectedNavigate("/forms"); setOpen(false); }} className="text-gray-700 hover:text-blue-600 text-left py-2 transition duration-200 border-b border-gray-100">My Forms</button>
            <button onClick={() => { handleProtectedNavigate("/editor"); setOpen(false); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium text-center shadow-sm transition duration-200">Create Forms</button>

            {!auth ? (
              <button onClick={() => { setShowAuth(true); setAuthType("login"); setOpen(false); }} className="text-gray-700 border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 transition duration-200 text-center">Login / Sign Up</button>
            ) : (
              <div className="space-y-2 pt-2">
                <p className="text-gray-700 px-4 py-2 text-center bg-gray-50 rounded-xl flex items-center justify-center gap-2">
                  <img
                    src="https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  {auth}!
                </p>
                <button onClick={() => { handleLogout(); setOpen(false); }} className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition duration-200">Logout</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ===== Auth Modal ===== */}
      {showAuth && !auth && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setShowAuth(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-1 hover:bg-gray-100 rounded-full transition" aria-label="Close">
              <X size={20} />
            </button>
            <AuthForm type={authType} onSuccess={handleAuthSuccess} onTypeChange={setAuthType} />
          </div>
        </div>
      )}

      {/* ===== Hero Section ===== */}
      <section className="text-center px-4 sm:px-6 py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-100 via-white to-purple-50">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
          Build forms that <span className="text-blue-600">work for you</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
          Design professional forms tailored to your needs—simple, fast, and fully customizable.
        </p>
        <button onClick={() => navigate("/editor")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base">
          Create Your First Form
        </button>
      </section>

      {/* ===== Features Section ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 sm:mb-12 text-center px-2">
          Everything you need to build better forms
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 transform hover:-translate-y-2 p-6 text-center border border-gray-100">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h4 className="font-semibold text-base sm:text-lg mb-3 text-gray-800">{feature.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Templates Section ===== */}
      <section id="templates" className="relative max-w-6xl mx-auto px-6 sm:px-6 py-12 sm:py-16 md:py-20 bg-white rounded-3xl shadow-sm">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center px-2">
          Ready-to-use Form Templates
        </h3>

        <div className="hidden sm:block absolute top-1/2 left-2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full opacity-80 pointer-events-none">
          <ChevronLeft size={22} className="text-gray-600" />
        </div>
        <div className="hidden sm:block absolute top-1/2 right-2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full opacity-80 pointer-events-none">
          <ChevronRight size={22} className="text-gray-600" />
        </div>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                if (!auth) {
                  setShowAuth(true);
                  setAuthType("login");
                  return;
                }
                navigate(`/editor?template=${template.id}`);
              }}
              className="flex-shrink-0 w-56 sm:w-64 cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition duration-300 transform hover:-translate-y-2 overflow-hidden group snap-start"
            >
              <div className="relative overflow-hidden">
                <img
                  src={template.img}
                  alt={template.title}
                  className="w-full h-36 sm:h-40 object-cover group-hover:scale-110 transition duration-500"
                  onError={(e) => { e.target.src ="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 text-base sm:text-lg group-hover:text-blue-600 transition duration-200">
                  {template.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="text-center px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 px-2">Ready to get started?</h3>
        <p className="text-blue-100 mb-6 sm:mb-8 max-w-xl mx-auto px-4 text-sm sm:text-base">
          Join thousands of users who trust FormBuilder for their form creation needs.
        </p>
        <button
          onClick={() => {
            if (!auth) {
              setShowAuth(true);
              setAuthType("login");
              return;
            }
            navigate("/editor");
          }}
          className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          Start Building Forms
        </button>
      </section>

    </div>
  );
}

export default Home;
