/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
const SignIn: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        login(data.token);
      } else {
        setError(data.message || "Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      <div className="w-full max-w-md p-6 border border-gray-600 rounded-lg shadow-lg bg-gray-100">
        <h2 className="text-2xl font-semibold text-center">Sign In</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">
              Email or Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3 py-2 text-black border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-black border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 text-white bg-black rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-gray-800 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
