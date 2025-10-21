
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, FileText, BarChart2, Edit2, Upload, Calendar, Edit3, Eye, Trash2, Share2 } from "lucide-react";

export default function Profile() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ forms: 0, responses: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [forms, setForms] = useState([]);

useEffect(() => {
  if (!auth) {
    navigate("/");
    return;
  }

  async function fetchProfile() {
    try {
      axios.defaults.baseURL = "http://localhost:5000";
      axios.defaults.withCredentials = true; // include cookies if using jwt cookies

      const [userRes, formsRes, respRes] = await Promise.all([
        axios.get("/api/users/profile"),
        axios.get("/api/forms/user", { withCredentials: true }),
        axios.get("/api/responses/user", { withCredentials: true }),
      ]);

      setProfile(userRes.data);
      setStats({
        forms: formsRes.data.length,
        responses: respRes.data.length,
      });
      setForms(formsRes.data); // new line
      setUpdatedName(userRes.data.name);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  }

  fetchProfile();
}, [auth, navigate]);


  const handleUpdateName = async () => {
    if (!updatedName.trim()) return alert("Name cannot be empty");
    try {
      const res = await axios.put("/api/users/profile", { name: updatedName });
      setProfile((prev) => ({ ...prev, name: updatedName }));
      setAuth(updatedName); // update context username
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      setImageUploading(true);
      const res = await axios.put("/api/users/profile/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile((prev) => ({ ...prev, profileImage: res.data.profileImage }));
      alert("Profile image updated!");
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            My Profile
          </h1>
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-5xl mx-auto mt-10 px-6">
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8">
          <div className="relative">
            <img
              src={profile?.profileImage || "https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"}
              alt="Profile"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-blue-100 shadow-md"
            />
            <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md cursor-pointer">
              <Upload size={16} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={imageUploading}
              />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left">
            {editing ? (
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
                <button
                  onClick={handleUpdateName}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {profile?.name || auth}
                </h2>
                <p className="text-gray-600 mt-1">{profile?.email}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="mt-3 text-blue-600 hover:text-blue-700 flex items-center justify-center sm:justify-start gap-1"
                >
                  <Edit2 size={14} /> Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-5xl mx-auto mt-10 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">
          <FileText className="mx-auto text-blue-500 mb-3" size={32} />
          <h3 className="text-lg font-semibold text-gray-800">{stats.forms}</h3>
          <p className="text-gray-500 text-sm">Forms Created</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">
          <BarChart2 className="mx-auto text-green-500 mb-3" size={32} />
          <h3 className="text-lg font-semibold text-gray-800">{stats.responses}</h3>
          <p className="text-gray-500 text-sm">Total Responses</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">
          <User className="mx-auto text-purple-500 mb-3" size={32} />
          <h3 className="text-lg font-semibold text-gray-800">
            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "--"}
          </h3>
          <p className="text-gray-500 text-sm">Joined On</p>
        </div>
      </div>

      {/* User Forms Section */}
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">My Forms</h1>

      {forms.length === 0 ? (
        <p className="text-gray-500 text-center">No forms created yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-200"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-900">
                  {form.title || "Untitled Form"}
                </h2>

                <div className="flex gap-3">
                  <FileText size={18} className="text-gray-600 cursor-pointer" />
                  <Share2 size={18} className="text-green-600 cursor-pointer" />
                  <Trash2 size={18} className="text-red-500 cursor-pointer" />
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm mt-1 mb-3">
                {form.description || "Form description"}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Calendar size={15} />
                <span>
                  Created{" "}
                  {new Date(form.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Questions count */}
              <p className="text-gray-700 text-sm mb-3">
                {form.questions?.length || 0} question
                {form.questions?.length > 1 ? "s" : ""}
              </p>

              {/* Example question type preview */}
              {form.questions && form.questions.length > 0 && (
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  ✅ {form.questions[0].type || "Question"}
                </div>
              )}

              <hr className="my-4 border-gray-200" />

              {/* Footer */}
              <div className="flex justify-between items-center">
                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                  <Edit3 size={16} /> Edit
                </button>
                <button className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium">
                  <Eye size={16} /> Responses
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    </div>
  );
}
