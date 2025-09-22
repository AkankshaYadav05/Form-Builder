import React from 'react';

function DeleteModal({ isOpen, onClose, onConfirm, formTitle, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Delete Form</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold">"{formTitle}"</span>? 
          This action cannot be undone and will remove all associated responses.
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Form'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;