import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, FileText, BarChart2, Edit2, Upload, Calendar, Edit3, Eye, Trash2, Share2, Plus} from "lucide-react";

import ShareModal from "../components/ShareModal";
import DeleteModal from "../components/DeleteModal";

function Profile() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ forms: 0, responses: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [forms, setForms] = useState([]);

  const [shareModal, setShareModal] = useState({ isOpen: false, formId: null, formTitle: "" });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, form: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!auth) {
      navigate("/");
      return;
    }

    async function fetchProfile() {
      try {
        axios.defaults.baseURL = "https://form-builder-production-cee9.up.railway.app";
        axios.defaults.withCredentials = true;

        const [userRes, formsRes, respRes] = await Promise.all([
          axios.get("/api/users/profile"),
          axios.get("/api/forms/user", { withCredentials: true }),
          axios.get("/api/responses/user", { withCredentials: true }),
        ]);

        setProfile(userRes.data);
        setStats({ forms: formsRes.data.length, responses: respRes.data.length });
        setForms(formsRes.data);
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
      await axios.put("/api/users/profile", { name: updatedName });
      setProfile((prev) => ({ ...prev, name: updatedName }));
      setAuth(updatedName);
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
    formData.append("file", file);

    try {
      setImageUploading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imagePath = res.data.filePath;
      await axios.put("/api/users/profile", { profileImage: imagePath });

      setProfile((prev) => ({ ...prev, profileImage: imagePath }));
      alert("Profile image updated!");
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const deleteForm = async (formId) => {
    if (!formId) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/forms/${formId}`, { withCredentials: true });
      setForms((prev) => prev.filter((f) => f._id !== formId));
      alert("Form deleted successfully!");
      setDeleteModal({ isOpen: false, form: null });
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete form");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  const getQuestionTypeIcon = (type) => {
    const icons = {
      mcq: '🔘',
      short: '📝',
      long: '📄',
      rating: '⭐',
      checkbox: '☑️',
      dropdown: '📋',
      file: '📎',
      date: '📅',
      time: '🕐',
      categorize: '🗂️',
    };
    return icons[type] || '❓';
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Profile</h1>
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-6xl mx-auto mt-10 px-6">
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8">
          <div className="relative">
            <img
              src={
                profile?.profileImage
                ? profile.profileImage.startsWith("http")
                ? profile.profileImage
                : `https://form-builder-production-cee9.up.railway.app${profile.profileImage}`
                : "https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"
              }
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
      <div className="max-w-6xl mx-auto mt-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">
          <FileText className="mx-auto text-blue-500 mb-3" size={32} />
          <h3 className="text-lg font-semibold text-gray-800">{stats.forms}</h3>
          <p className="text-gray-500 text-sm">Forms Created</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">
          <BarChart2 className="mx-auto text-green-500 mb-3" size={32} />
          <h3 className="text-lg font-semibold text-gray-800"> {profile?.totalResponses || 0}</h3>
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

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading forms...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={64} className="mx-auto text-gray-400 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">No forms yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You have not yet created any form
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/editor')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
              >
                <Plus size={18} /> Create Your First Form
              </button>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
              >
                Browse Templates
              </button>
            </div>
          </div>
        ) : (
          <>
            
            {/* Forms Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <div
                  key={form._id || form.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate flex-1 mr-2">
                        {form.title || 'Untitled Form'}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate(`/editor?edit=${form._id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                          title="Edit form"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setShareModal({ isOpen: true, formId: form._id, formTitle: form.title })
                          }
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200"
                          title="Share form"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({ isOpen: true, form })
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                          title="Delete form"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {form.description || 'No description provided'}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Calendar size={14} />
                      <span>Created {formatDate(form.createdAt)}</span>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-2">
                        {form.questions?.length || 0} question{(form.questions?.length || 0) !== 1 ? 's' : ''}
                      </div>
                      {form.questions && form.questions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {form.questions.slice(0, 5).map((question, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              title={question.text}
                            >
                              <span>{getQuestionTypeIcon(question.type)}</span>
                              <span className="capitalize">{question.type}</span>
                            </span>
                          ))}
                          {form.questions.length > 5 && (
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                              +{form.questions.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/editor?edit=${form._id}`)}
                        className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm font-medium"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => navigate(`/forms/${form._id}/responses`)}
                        className="flex items-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm font-medium"
                        title="View responses"
                      >
                        <Eye size={14} />
                        Responses
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>  
       
        <ShareModal 
          isOpen={shareModal.isOpen} 
          onClose={() => setShareModal({ 
            isOpen: false, 
            formId: null, 
            formTitle: "" 
          })} 
          formId={shareModal.formId} 
          formTitle={shareModal.formTitle} 
        /> 
        
        <DeleteModal 
          isOpen={deleteModal.isOpen} 
          onClose={() => setDeleteModal({ 
            isOpen: false, 
            form: null 
          })} 
          onConfirm={() => deleteForm(deleteModal.form?._id)} 
          formTitle={deleteModal.form?.title} 
          isDeleting={isDeleting} />
    </div>
  );
}

export default Profile;