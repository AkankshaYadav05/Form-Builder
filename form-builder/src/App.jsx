import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Preview from './pages/Preview';
import FormsList from './components/FormsList';
import EditForm from './components/EditForm';
import FillForm from './pages/FillForm';
import FormResponses from './pages/FormResponses';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/forms" element={<FormsList />} />
      <Route path="/allForms" element={<FormsList />} />
      <Route path="/forms/:id" element={<EditForm />} />
      <Route path="/forms/:id/edit" element={<EditForm />} />
      <Route path="/form/:formId/fill" element={<FillForm />} />
      <Route path="/forms/:id/responses" element={<FormResponses />} />

    </Routes>
  );
}

export default App;
