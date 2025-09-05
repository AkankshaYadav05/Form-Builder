import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  Search, 
  Eye, 
  Calendar,
  User,
  Clock,
  Award,
  FileText,
  BarChart3
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const FormResponses = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFormAndResponses();
  }, [id]);

  const fetchFormAndResponses = async () => {
    try {
      const [formResponse, responsesResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/forms/${id}`),
        axios.get(`http://localhost:5000/api/responses/form/${id}`)
      ]);
      
      setForm(formResponse.data);
      setResponses(responsesResponse.data.responses);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load form responses');
    } finally {
      setLoading(false);
    }
  };

  const filteredResponses = responses.filter(response => 
    response.respondentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (response.respondentEmail && response.respondentEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportToCSV = () => {
    if (responses.length === 0) {
      toast.error('No responses to export');
      return;
    }

    const headers = [
      'Submission Date',
      'Respondent Name',
      'Respondent Email',
      'Score (%)',
      'Completion Time (seconds)',
      ...form.questions.map((q, index) => `Q${index + 1}: ${q.title}`)
    ];

    const csvData = responses.map(response => {
      const row = [
        new Date(response.createdAt).toLocaleString(),
        response.respondentName,
        response.respondentEmail || 'N/A',
        response.score,
        response.completionTime,
        ...form.questions.map(question => {
          const answer = response.answers.find(a => a.questionId === question._id);
          if (!answer) return 'No answer';
          
          if (Array.isArray(answer.answer)) {
            return answer.answer.join('; ');
          }
          return answer.answer;
        })
      ];
      return row;
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${form.title}_responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Responses exported successfully!');
  };

  const viewResponse = (response) => {
    setSelectedResponse(response);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const renderAnswer = (question, answer) => {
    if (!answer) return 'No answer';

    switch (question.type) {
      case 'mcq':
      case 'text':
      case 'textarea':
      case 'email':
      case 'number':
      case 'date':
      case 'select':
        return answer.answer;

      case 'checkbox':
        return Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer;

      case 'rating':
        return `${answer.answer}/${question.maxRating || 5} stars`;

      case 'cloze':
        return Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer;

      case 'categorize':
        return 'Categorization response';

      case 'comprehension':
        return Array.isArray(answer.answer) ? answer.answer.join(' | ') : answer.answer;

      case 'file':
        return answer.answer || 'File uploaded';

      default:
        return JSON.stringify(answer.answer);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading responses..." />;
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-600">The form you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">{form.title} - Responses</h1>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to={`/analytics/${id}`}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
              
              <button
                onClick={exportToCSV}
                disabled={responses.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {responses.length > 0 
                    ? Math.round(responses.reduce((acc, r) => acc + r.score, 0) / responses.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Completion Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {responses.length > 0 
                    ? formatTime(Math.round(responses.reduce((acc, r) => acc + r.completionTime, 0) / responses.length))
                    : '0s'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {form.analytics?.views > 0 
                    ? Math.round((responses.length / form.analytics.views) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredResponses.length} of {responses.length} responses
            </div>
          </div>
        </div>

        {/* Responses Table */}
        {filteredResponses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {responses.length === 0 ? 'No responses yet' : 'No responses match your search'}
            </h3>
            <p className="text-gray-600">
              {responses.length === 0 
                ? 'Responses will appear here once people start filling out your form'
                : 'Try adjusting your search criteria'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Respondent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResponses.map((response) => (
                    <tr key={response._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {response.respondentName}
                          </div>
                          {response.respondentEmail && (
                            <div className="text-sm text-gray-500">
                              {response.respondentEmail}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(response.score)}`}>
                          {response.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(response.completionTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(response.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewResponse(response)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Response Detail Modal */}
      {showModal && selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Response Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Respondent</p>
                  <p className="text-sm text-gray-900">{selectedResponse.respondentName}</p>
                  {selectedResponse.respondentEmail && (
                    <p className="text-sm text-gray-500">{selectedResponse.respondentEmail}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Score</p>
                  <p className="text-sm text-gray-900">{selectedResponse.score}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Submitted</p>
                  <p className="text-sm text-gray-900">{formatDate(selectedResponse.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {form.questions.map((question, index) => {
                const answer = selectedResponse.answers.find(a => a.questionId === question._id);
                return (
                  <div key={question._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-sm font-semibold text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mt-1">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{question.title}</h3>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-gray-700">{renderAnswer(question, answer)}</p>
                        </div>
                        {answer?.isCorrect !== null && (
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              answer.isCorrect 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {answer.isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormResponses;