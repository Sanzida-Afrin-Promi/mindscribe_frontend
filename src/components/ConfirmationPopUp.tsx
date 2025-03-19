import React from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

interface DeletePopupProps {
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationPopup: React.FC<DeletePopupProps> = ({ message, onClose, onConfirm }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <FaExclamationTriangle className="text-yellow-500 text-6xl mx-auto mb-4" />
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-700">{message}</h2>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-300"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmationPopup;
