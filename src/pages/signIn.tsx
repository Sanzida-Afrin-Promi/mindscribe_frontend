import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const [identifier, setIdentifier] = useState(""); // ✅ Can be Email or Username
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ State for error message
  const navigate = useNavigate(); // ✅ Hook for redirection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // ✅ Store token for authentication
        navigate("/home"); // ✅ Redirect to Dashboard or Home
      } else {
        setError(data.message || "Invalid login credentials."); // ❌ Show error message
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-6 border border-gray-600 rounded-lg shadow-lg bg-gray-900">
        <h2 className="text-2xl font-semibold text-center">Sign In</h2>

        {error && <p className="text-red-400 text-center">{error}</p>} {/* ✅ Show error message */}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">
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
            <label className="block text-gray-400 text-sm mb-1">Password</label>
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
            className="w-full py-2 mt-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-gray-300 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
