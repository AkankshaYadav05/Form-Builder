import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FormContext = createContext();

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

export const FormProvider = ({ children }) => {
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);
  const [loading, setLoading] = useState(false);

  const createForm = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/forms', formData);
      
      setForms(prev => [response.data.form, ...prev]);
      toast.success('Form created successfully!');
      
      return { success: true, form: response.data.form };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create form';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateForm = async (id, formData) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/forms/${id}`, formData);
      
      setForms(prev => prev.map(form => 
        form._id === id ? response.data.form : form
      ));
      
      if (currentForm?._id === id) {
        setCurrentForm(response.data.form);
      }
      
      toast.success('Form updated successfully!');
      return { success: true, form: response.data.form };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update form';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/forms/${id}`);
      
      setForms(prev => prev.filter(form => form._id !== id));
      
      if (currentForm?._id === id) {
        setCurrentForm(null);
      }
      
      toast.success('Form deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete form';
      toast.error(message);
      return { success: false, message };
    }
  };

  const duplicateForm = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/forms/${id}/duplicate`);
      
      setForms(prev => [response.data.form, ...prev]);
      toast.success('Form duplicated successfully!');
      
      return { success: true, form: response.data.form };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to duplicate form';
      toast.error(message);
      return { success: false, message };
    }
  };

  const fetchForms = async (params = {}) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/forms', { params });
      setForms(response.data.forms);
      return response.data;
    } catch (error) {
      console.error('Fetch forms error:', error);
      toast.error('Failed to fetch forms');
      return { forms: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const fetchForm = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/forms/${id}`);
      setCurrentForm(response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch form error:', error);
      toast.error('Failed to fetch form');
      return null;
    }
  };

  const value = {
    forms,
    currentForm,
    loading,
    createForm,
    updateForm,
    deleteForm,
    duplicateForm,
    fetchForms,
    fetchForm,
    setCurrentForm
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};