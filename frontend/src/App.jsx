import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FormsList from './pages/FormsList';
import EditForm from './components/EditForm';
import FillForm from './pages/FillForm';
import FormResponses from './pages/FormResponses';
import FormBuilder from './pages/FormBuilder';
import { AuthProvider } from "./components/AuthContext";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forms" element={<FormsList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editor" element={<FormBuilder />} />
        <Route path="/forms/:id" element={<EditForm />} />
        <Route path="/forms/:id/edit" element={<EditForm />} />
        <Route path="/form/:formId/fill" element={<FillForm />} />
        <Route path="/forms/:id/responses" element={<FormResponses />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
