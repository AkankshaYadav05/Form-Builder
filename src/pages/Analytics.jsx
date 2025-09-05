import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock,
  Award,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Analytics = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      const [formResponse, analyticsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/forms/${id}`),
        axios.get(`http://localhost:5000/api/forms/${id}/analytics`)
      ]);
      
      setForm(formResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return <LoadingSpinner text="Loading analytics..." />;
  }

  if (!form || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Not Available</h1>
          <p className="text-gray-600">Unable to load analytics for this form.</p>
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
              <h1 className="text-xl font-semibold text-gray-900">{form.title} - Analytics</h1>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to={`/responses/${id}`}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>View Responses</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.completionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(analytics.averageScore)}`}>
                  {analytics.averageScore}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submissions Over Time */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Submissions Over Time
            </h3>
            
            {Object.keys(analytics.submissionsOverTime).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(analytics.submissionsOverTime)
                  .sort(([a], [b]) => new Date(a) - new Date(b))
                  .slice(-7) // Show last 7 days
                  .map(([date, count]) => (
                    <div key={date} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{formatDate(date)}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.max((count / Math.max(...Object.values(analytics.submissionsOverTime))) * 100, 5)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No submission data available</p>
              </div>
            )}
          </div>

          {/* Question Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Question Performance
            </h3>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {analytics.questionAnalytics.map((question, index) => (
                <div key={question.questionId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                      Q{index + 1}: {question.title}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      {question.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Answers</p>
                      <p className="font-semibold text-gray-900">{question.totalAnswers}</p>
                    </div>
                    
                    {question.correctAnswers > 0 && (
                      <div>
                        <p className="text-gray-600">Correct Rate</p>
                        <p className="font-semibold text-green-600">
                          {question.totalAnswers > 0 
                            ? Math.round((question.correctAnswers / question.totalAnswers) * 100)
                            : 0}%
                        </p>
                      </div>
                    )}
                    
                    {question.averageTime > 0 && (
                      <div className="col-span-2">
                        <p className="text-gray-600">Average Time</p>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <p className="font-semibold text-gray-900">{question.averageTime}s</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {question.correctAnswers > 0 && question.totalAnswers > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: `${(question.correctAnswers / question.totalAnswers) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Status and Settings */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                form.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : form.status === 'draft'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
              </span>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Created</p>
              <p className="text-sm text-gray-900">
                {new Date(form.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Questions</p>
              <p className="text-sm text-gray-900">{form.questions.length}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Form Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${form.settings.allowAnonymous ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700">Anonymous responses</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${form.settings.multipleSubmissions ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700">Multiple submissions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${form.settings.showProgressBar ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700">Progress bar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${form.settings.collectEmail ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700">Collect email</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;