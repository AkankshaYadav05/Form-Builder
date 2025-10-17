import React from 'react';
import { CheckCircle, Send } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-sm sm:text-base text-gray-600">Loading form...</p>
      </div>
    </div>
  );
}

export function SuccessScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center max-w-md w-full mx-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={28} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Your response has been submitted successfully.
        </p>
        {/* <div className="animate-pulse text-xs sm:text-sm text-gray-500">Redirecting to forms...</div> */}
      </div>
    </div>
  );
}

export function FormHeader({ title, description }) {
  return (
    <div className="text-center mb-6 sm:mb-8 px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 break-words">
        {title}
      </h1>
      <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 break-words">{description}</p>
    </div>
  );
}

export function SubmitButton({ isSubmitting, onClick }) {
  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={onClick}
        disabled={isSubmitting}
        className="flex items-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <Send size={16} />
            <span>Submit Form</span>
          </>
        )}
      </button>
    </div>
  );
}
