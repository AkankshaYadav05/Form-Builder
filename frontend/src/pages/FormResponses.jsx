import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, FileText, Search, TrendingUp, CheckCircle } from "lucide-react";
import axios from "axios";
import ResponseCard from "../components/ResponseCard";
import ResponseDetailModal from "../components/ResponseDetailModal";
import StatsCard from "../components/StatsCard";

export default function FormResponses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        axios.defaults.baseURL = 'http://localhost:5000';
        const formResponse = await axios.get(`/api/forms/${id}`);
        setForm(formResponse.data);
        const responsesResponse = await axios.get(`/api/responses?formId=${id}`);
        setResponses(Array.isArray(responsesResponse.data) ? responsesResponse.data : []);
      } catch (error) {
        console.error("Failed to fetch data:", error.response || error.message);
        alert(error.response?.status === 404 ? "Form or responses not found" : "Error fetching data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleViewResponse = (response) => {
    setSelectedResponse(response);
    setShowDetailModal(true);
  };

  // Filter & search
  const filteredResponses = responses.filter((response) => {
    const matchesSearch =
      searchTerm === "" ||
      response.answers.some((ans) =>
        (Array.isArray(ans.answer) ? ans.answer.join(", ") : String(ans.answer))
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    return matchesSearch;
  });

  // Stats calculations
  const totalResponses = responses.length;
  const totalQuestions = form?.questions?.length || 0;
  const avgAnswersPerResponse =
    totalResponses > 0
      ? Math.round(responses.reduce((sum, r) => sum + r.answers.length, 0) / totalResponses)
      : 0;
  const completionRate =
    totalResponses > 0 && totalQuestions > 0
      ? Math.round(
          (responses.filter((r) => r.answers.length === totalQuestions).length / totalResponses) * 100
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading responses...</p>
        </div>
      </div>
    );
  }

  const handleDeleteResponse = async (responseId) => {
  if (!window.confirm("Are you sure you want to delete this response?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/responses/${responseId}`);
    setResponses((prev) => prev.filter((r) => r._id !== responseId));
    alert("Response deleted successfully");
  } catch (error) {
    console.error("Failed to delete response:", error);
    alert("Failed to delete response");
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
<div className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
    {/* Mobile Header */}
    <div className="flex items-center justify-between sm:hidden">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Title in center */}
      <div className="text-center flex-1 px-2">
        <h1 className="text-lg font-bold text-gray-800 truncate">
          {form?.title || "Form Responses"}
        </h1>
        {form?.description && (
          <p className="text-xs text-gray-500 truncate">
            {form.description}
          </p>
        )}
      </div>

      {/* Empty spacer to balance layout */}
      <div className="w-9"></div>
    </div>

    {/* Desktop Header */}
    <div className="hidden sm:flex items-center gap-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          {form?.title || "Form Responses"}
        </h1>
        <p className="text-gray-600 mt-1">
          {form?.description || "View and analyze form responses"}
        </p>
      </div>
    </div>
  </div>
</div>


      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          icon={Users} 
          title="Total Responses" 
          value={totalResponses} 
          subtitle="All time" 
          color="blue" 
        />
        <StatsCard 
          icon={CheckCircle} 
          title="Completion Rate" 
          value={`${completionRate}%`} 
          subtitle="Fully answered responses" 
          color="green" 
        />
        <StatsCard 
          icon={TrendingUp} 
          title="Total Questions" 
          value={totalQuestions} 
          subtitle="In the form" 
          color="green" 
        />
        <StatsCard 
          icon={FileText} 
          title="Avg Answers / Response" 
          value={avgAnswersPerResponse} 
          subtitle="Average answered questions" 
          color="purple" 
        />
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredResponses.length} of {totalResponses} responses
          </div>
        </div>
      </div>

      {/* Responses */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {filteredResponses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {totalResponses === 0 ? "No responses yet" : "No responses match your filters"}
            </h3>
            <p className="text-gray-500 mb-6">
              {totalResponses === 0
                ? "Share your form to start collecting responses."
                : "Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResponses.map((response, index) => (
              <ResponseCard
                key={response._id || response.id}
                response={response}
                index={index}
                onView={handleViewResponse}
                onDelete={handleDeleteResponse}
              />
            ))}
            
          </div>
        )}
      </div>

      {/* Modal */}
      <ResponseDetailModal
        response={selectedResponse}
        form={form}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        responseIndex={selectedResponse ? responses.findIndex((r) => r._id === selectedResponse._id) : -1}
      />
    </div>
  );
}
