import React from 'react';
import { FaCrown, FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, premium }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full relative p-6 modal-content">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
          onClick={onClose}
          aria-label="Fechar"
        >
          <FaTimes />
        </button>
        <div className="flex items-center mb-4">
          {premium && <FaCrown className="text-yellow-500 mr-2 text-2xl" />}
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        <div className="text-gray-800 dark:text-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 