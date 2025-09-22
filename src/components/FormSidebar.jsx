import React from 'react';
import { 
  CheckSquare, Type, List, Star, ChevronDown, Upload, 
  Calendar, Clock 
} from 'lucide-react';
import SidebarBtn from './SidebarBtn';

function FormSidebar({ activeTab, onAddQuestion, themes, formTheme, setFormTheme }) {
  const questionTypes = [
    { key: 'mcq', label: 'Multiple Choice', icon: <CheckSquare size={16} /> },
    { key: 'short', label: 'Short Answer', icon: <Type size={16} /> },
    { key: 'long', label: 'Long Answer', icon: <List size={16} /> },
    { key: 'rating', label: 'Rating', icon: <Star size={16} /> },
    { key: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={16} /> },
    { key: 'dropdown', label: 'Dropdown', icon: <ChevronDown size={16} /> },
    { key: 'file', label: 'File Upload', icon: <Upload size={16} /> },
    { key: 'date', label: 'Date', icon: <Calendar size={16} /> },
    { key: 'time', label: 'Time', icon: <Clock size={16} /> },
    { key: 'categorize', label: 'Categorize', icon: <List size={16} /> },
  ];

  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
      {activeTab === 'build' && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Question</h2>
          <div className="space-y-2">
            {questionTypes.map((type) => (
              <SidebarBtn
                key={type.key}
                icon={type.icon}
                label={type.label}
                onClick={() => onAddQuestion(type.key)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'design' && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Form Theme</h2>
          <div className="space-y-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setFormTheme(theme.id)}
                className={`w-full p-3 rounded-lg border-2 transition duration-200 ${
                  formTheme === theme.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <span className="font-medium text-gray-800">{theme.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

export default FormSidebar;