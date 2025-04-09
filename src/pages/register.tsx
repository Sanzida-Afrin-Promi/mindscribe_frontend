import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, email, password }),
      });

      if (response.ok) {
        setMessage("User created successfully!"); 
        setTimeout(() => {
          navigate("/signIn"); 
        }, 200);

        setUsername("");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage("Registration failed. Try again."); 
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("An error occurred. Please try again."); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      <div className="w-full max-w-md p-6 border border-gray-600 rounded-lg shadow-lg bg-gray-100">
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>

        {message && <p className="text-center text-green-600">{message}</p>} 

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-black border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-black border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {password && password.length < 6 && (
              <p className="text-sm text-red-600 mt-1">
                Password must be at least 6 characters long.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 text-white bg-black rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/signIn" className="text-gray-800 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;