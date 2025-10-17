import React, { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';

function ShareModal({ isOpen, onClose, formId, formTitle }) {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/form/${formId}/fill`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Share Form</h2>
        <p className="text-gray-600 mb-4">Share "{formTitle}" with others using this link:</p>
        
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-1"
          >
            <Copy size={16} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Close
          </button>
          <button
            onClick={() => window.open(shareUrl, '_blank')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center gap-1"
          >
            <ExternalLink size={16} />
            Open Form
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;