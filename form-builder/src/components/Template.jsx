import React from 'react';
import { CheckCircle } from 'lucide-react';

const Template = ({ template, onClick }) => {
  return (
    <div
      onClick={() => onClick(template)}
      className="cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition duration-300 transform hover:-translate-y-2 overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <img
          src={template.img}
          alt={template.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
          onError={(e) => {
            e.target.src = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
      </div>
      <div className="p-5">
        <h4 className="font-semibold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition duration-200">
          {template.title}
        </h4>
        <p className="text-sm text-gray-500 mb-3">{template.description}</p>
        <div className="flex items-center text-xs text-gray-400">
          <CheckCircle size={12} className="mr-1" />
          {template.questions.length} questions included
        </div>
      </div>
    </div>
  );
};

export default Template;