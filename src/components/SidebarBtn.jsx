// src/components/SidebarBtn.jsx
export default function SidebarBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full px-3 py-2 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-400 transition text-sm font-medium text-gray-700"
    >
      <span className="text-indigo-600">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
