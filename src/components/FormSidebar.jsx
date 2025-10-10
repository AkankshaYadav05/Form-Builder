import { useState } from 'react';
import {
  CheckSquare,
  FileText,
  Star,
  CheckCircle,
  Upload,
  Grid3x3,
  Type,
  ChevronDown,
  Calendar,
  Clock,
  Palette,
  PlusCircle,
  X
} from 'lucide-react';

export default function FormSidebar({ activeTab, onAddQuestion, themes, formTheme, setFormTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const questionTypes = [
    { type: 'mcq', icon: CheckSquare, label: 'Multiple Choice' },
    { type: 'short', icon: Type, label: 'Short Answer' },
    { type: 'long', icon: FileText, label: 'Long Answer' },
    { type: 'rating', icon: Star, label: 'Rating' },
    { type: 'checkbox', icon: CheckCircle, label: 'Checkbox' },
    { type: 'dropdown', icon: ChevronDown, label: 'Dropdown' },
    { type: 'file', icon: Upload, label: 'File Upload' },
    { type: 'categorize', icon: Grid3x3, label: 'Categorize' },
    { type: 'date', icon: Calendar, label: 'Date' },
    { type: 'time', icon: Clock, label: 'Time' },
  ];

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        aria-label="Open sidebar"
      >
        <PlusCircle size={24} />
      </button>

      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-20 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        <div className="p-4 space-y-6">
          {activeTab === 'build' && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <PlusCircle size={16} />
                  Add Questions
                </h3>
                <div className="space-y-2">
                  {questionTypes.map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => {
                        onAddQuestion(type);
                        setMobileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200 border border-transparent hover:border-blue-200"
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Palette size={16} />
                  Form Theme
                </h3>
                <div className="space-y-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setFormTheme(theme.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition duration-200 border ${
                        formTheme === theme.id
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'preview' && (
            <div className="text-center text-gray-500 text-sm py-8">
              Preview mode active
            </div>
          )}
        </div>
      </aside>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/30 z-10"
        />
      )}
    </>
  );
}
