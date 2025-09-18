import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FormsList from './components/FormsList';
import EditForm from './components/EditForm';
import FillForm from './pages/FillForm';
import FormResponses from './pages/FormResponses';
import FormBuilder from './pages/FormBuilder';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forms" element={<FormsList />} />
      <Route path="/editor" element={<FormBuilder/>} />
      <Route path="/forms/:id" element={<EditForm />} />
      <Route path="/forms/:id/edit" element={<EditForm />} />
      <Route path="/form/:formId/fill" element={<FillForm />} />
      <Route path="/forms/:id/responses" element={<FormResponses />} />

    </Routes>
  );
}

export default App;
