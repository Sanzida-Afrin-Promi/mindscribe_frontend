import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-500">Unauthorized Access</h1>
      <p className="text-gray-600 mt-4">You don't have permission to access this page.</p>
      <Link to="/" className="mt-6 text-blue-500 hover:underline">
        Go Back Home
      </Link>
    </div>
  );
};

export default Unauthorized;
