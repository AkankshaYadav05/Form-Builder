import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, FileText, Calendar, Search, Eye, Star, CheckCircle, XCircle
} from "lucide-react";

// Stats Card Component
function StatsCard({ icon: Icon, title, value, subtitle, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

// Response Card Component
function ResponseCard({ response, index, onView }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Response #{index + 1}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(response.submittedAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {response.score !== undefined && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(response.score)}`}>
              {response.score}% Score
            </span>
          )}
          <button
            onClick={() => onView(response)}
            className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <Eye size={14} />
            View
          </button>
        </div>
      </div>

      {/* Quick Preview of Answers */}
      <div className="space-y-2">
        {Object.entries(response.answers).slice(0, 3).map(([questionId, answer], i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-gray-400 min-w-[20px]">Q{i + 1}:</span>
            <span className="text-gray-700 truncate">
              {Array.isArray(answer) ? answer.join(', ') : String(answer)}
            </span>
          </div>
        ))}
        {Object.keys(response.answers).length > 3 && (
          <p className="text-sm text-blue-600">
            +{Object.keys(response.answers).length - 3} more answers
          </p>
        )}
      </div>
    </div>
  );
}

// Response Detail Modal
function ResponseDetailModal({ response, form, isOpen, onClose, responseIndex }) {
  if (!isOpen || !response) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Response #{responseIndex + 1}</h2>
              <p className="text-blue-100 mt-1">{formatDate(response.submittedAt)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {form?.questions?.map((question, index) => {
              const answer = response.answers[question.id];
              
              return (
                <div key={question.id} className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 rounded-r-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      Q{index + 1}: {question.text}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {question.type}
                    </span>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    {question.type === 'rating' ? (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: question.scale || 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={i < (answer || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-gray-600 ml-2">({answer || 0}/{question.scale || 5})</span>
                      </div>
                    ) : Array.isArray(answer) ? (
                      <div className="flex flex-wrap gap-2">
                        {answer.map((item, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700 font-medium">
                        {answer || <span className="text-gray-400 italic">No answer provided</span>}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FormResponses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    // Load form data from localStorage (demo)
    const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
    const foundForm = savedForms.find(f => f.id === id);
    
    if (foundForm) {
      setForm(foundForm);
    }

    // Load responses from localStorage (demo)
    const savedResponses = JSON.parse(localStorage.getItem('formResponses') || '[]');
    const formResponses = savedResponses.filter(r => r.formId === id);
    
    {
      setResponses(formResponses);
    }
    
    setLoading(false);
  }, [id]);

  const handleViewResponse = (response) => {
    setSelectedResponse(response);
    setShowDetailModal(true);
  };

  const filteredResponses = responses.filter(response => {
    const matchesSearch = searchTerm === "" || 
      Object.values(response.answers).some(answer => 
        String(answer).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesFilter = filterBy === "all" || 
      (filterBy === "high" && response.score >= 80) ||
      (filterBy === "medium" && response.score >= 60 && response.score < 80) ||
      (filterBy === "low" && response.score < 60);
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalResponses = responses.length;
  const avgScore = totalResponses > 0 
    ? Math.round(responses.reduce((acc, r) => acc + (r.score || 0), 0) / totalResponses)
    : 0;
  const highScores = responses.filter(r => (r.score || 0) >= 80).length;
  const completionRate = form?.questions?.length > 0 
    ? Math.round((responses.filter(r => Object.keys(r.answers).length === form.questions.length).length / totalResponses) * 100)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/forms')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft size={16} />
                Back to Forms
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
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            subtitle="Fully completed"
            color="orange"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
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
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredResponses.length} of {totalResponses} responses
            </div>
          </div>
        </div>

        {/* Responses */}
        {filteredResponses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {totalResponses === 0 ? "No responses yet" : "No responses match your filters"}
            </h3>
            <p className="text-gray-500 mb-6">
              {totalResponses === 0 
                ? "Share your form to start collecting responses."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {totalResponses === 0 && (
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Share Form
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResponses.map((response, index) => (
              <ResponseCard
                key={response.id}
                response={response}
                index={index}
                onView={handleViewResponse}
              />
            ))}
          </div>
        )}
      </div>

      {/* Response Detail Modal */}
      <ResponseDetailModal
        response={selectedResponse}
        form={form}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        responseIndex={responses.findIndex(r => r.id === selectedResponse?.id)}
      />
    </div>
  );
}