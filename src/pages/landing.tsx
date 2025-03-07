import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
      {/* Navigation */}
      <nav className="w-full py-4 px-8 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl font-bold">MindScribe</h1>
        <div className="space-x-4">
          <Link to="/signIn" className="px-4 py-2 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
            Sign In
          </Link>
          <Link to="/Register" className="px-4 py-2 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-extrabold mb-4">Welcome to MindScribe</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
          Experience the best platform for managing your tasks efficiently and seamlessly.
        </p>
        <div className="mt-6 flex space-x-4">
          <Link to="/register" className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-80">
            Get Started
          </Link>
         
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-gray-300 dark:border-gray-700">
        <p className="text-sm">&copy; 2025 MyApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
