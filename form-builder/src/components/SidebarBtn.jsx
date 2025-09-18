import React from 'react';

function SidebarBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200 border border-transparent hover:border-blue-200"
    >
      <span className="text-gray-500">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default SidebarBtn;