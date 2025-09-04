import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  BarChart3,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useForm } from '../contexts/FormContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(null);
  
  const { forms, loading, fetchForms, deleteForm, duplicateForm } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalForms: forms.length,
    publishedForms: forms.filter(f => f.status === 'published').length,
    totalViews: forms.reduce((acc, f) => acc + (f.analytics?.views || 0), 0),
    totalSubmissions: forms.reduce((acc, f) => acc + (f.analytics?.submissions || 0), 0)
  };

  const handleAction = async (action, form) => {
    setShowDropdown(null);
    
    switch (action) {
      case 'edit':
        navigate(`/builder/${form._id}`);
        break;
      case 'preview':
        navigate(`/preview/${form._id}`);
        break;
      case 'responses':
        navigate(`/responses/${form._id}`);
        break;
      case 'analytics':
        navigate(`/analytics/${form._id}`);
        break;
      case 'duplicate':
        await duplicateForm(form._id);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
          await deleteForm(form._id);
        }
        break;
    }
  };

  if (loading && forms.length === 0) {
    return <LoadingSpinner size="lg" text="Loading your forms..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Manage your forms and track their performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Forms', value: stats.totalForms, icon: FileText, color: 'blue' },
          { label: 'Published', value: stats.publishedForms, icon: Eye, color: 'green' },
          { label: 'Total Views', value: stats.totalViews, icon: TrendingUp, color: 'purple' },
          { label: 'Submissions', value: stats.totalSubmissions, icon: Users, color: 'orange' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
          
          <Link
            to="/builder"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Form</span>
          </Link>
        </div>
      </div>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No forms found' : 'No forms yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first form to get started'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              to="/builder"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Form</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form, index) => (
            <motion.div
              key={form._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              {/* Form Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {form.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {form.description || 'No description'}
                    </p>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === form._id ? null : form._id)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {showDropdown === form._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                        <button
                          onClick={() => handleAction('edit', form)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleAction('preview', form)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleAction('responses', form)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Responses
                        </button>
                        <button
                          onClick={() => handleAction('analytics', form)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => handleAction('duplicate', form)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleAction('delete', form)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    form.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : form.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {form.questions?.length || 0} questions
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {form.analytics?.views || 0}
                    </p>
                    <p className="text-xs text-gray-600">Views</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {form.analytics?.submissions || 0}
                    </p>
                    <p className="text-xs text-gray-600">Responses</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Created {new Date(form.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Updated {new Date(form.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}