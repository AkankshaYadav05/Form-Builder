import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { FormProvider } from './contexts/FormContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormPreview from './pages/FormPreview';
import FillForm from './pages/FillForm';
import FormResponses from './pages/FormResponses';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <FormProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/builder" element={
                  <ProtectedRoute>
                    <FormBuilder />
                  </ProtectedRoute>
                } />
                <Route path="/builder/:id" element={
                  <ProtectedRoute>
                    <FormBuilder />
                  </ProtectedRoute>
                } />
                <Route path="/preview/:id" element={
                  <ProtectedRoute>
                    <FormPreview />
                  </ProtectedRoute>
                } />
                <Route path="/responses/:id" element={
                  <ProtectedRoute>
                    <FormResponses />
                  </ProtectedRoute>
                } />
                <Route path="/analytics/:id" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                {/* Public form filling */}
                <Route path="/form/:id" element={<FillForm />} />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </FormProvider>
    </AuthProvider>
  );
}

export default App;