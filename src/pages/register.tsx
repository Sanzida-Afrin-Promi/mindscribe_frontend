import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // ✅ State for success message
  const navigate = useNavigate(); // ✅ Hook for redirection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, email, password }),
      });

      if (response.ok) {
        setMessage("User created successfully!"); // ✅ Show success message
        setTimeout(() => {
          navigate("/signIn"); // ✅ Redirect to sign-in page after 2 sec
        }, 200);

        // ✅ Clear input fields after successful registration
        setUsername("");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage("Registration failed. Try again."); // ❌ Handle failure
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("An error occurred. Please try again."); // ❌ Show error message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-6 border border-gray-600 rounded-lg shadow-lg bg-gray-900">
        <h2 className="text-2xl font-semibold text-center">Register</h2>

        {message && <p className="text-center text-green-400">{message}</p>} {/* ✅ Show success or error message */}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-black border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-black border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/signIn" className="text-gray-300 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
