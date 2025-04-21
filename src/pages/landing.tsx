import React from "react";
import Navbar from "../components/Navbar"; // Use the updated Navbar component

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
      <Navbar /> {/* Include the Navbar */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-extrabold mb-4">Welcome to MindScribe</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
          Empower your storytelling with MindScribe – the ultimate platform for
          creating, sharing, and inspiring through your words.
        </p>
      </main>
      <footer className="py-4 text-center border-t border-gray-300 dark:border-gray-700">
        <p className="text-sm">&copy; 2025 MindScribe. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
