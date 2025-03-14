/* eslint-disable @typescript-eslint/no-unused-vars */
// WriteStory.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WriteTextEditor from "../components/WriteTextEditor"; // Import the new WriteTextEditor component

const WriteStory = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(""); // To display errors
  const [loading, setLoading] = useState(false); // To show loading status while submitting
  const [success, setSuccess] = useState(false); // To handle the success message
  const navigate = useNavigate();

  const handleTitleChange = (event: { target: { value: string } }) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting
    setError(""); // Reset any previous error messages
    setSuccess(false); // Reset success message before submitting

    // Validate title and description before making the API call
    if (!title.trim() || !description.trim()) {
      setError("Title and description cannot be empty.");
      setLoading(false); // Stop loading if there's an error
      return;
    }

    // Get the token from localStorage for authentication
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found. Please log in.");
      setLoading(false); // Stop loading if token is missing
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to submit story. Please try again.");
      }

      // If successful, show the success message and reset form
      setSuccess(true);
      setTitle("");
      setDescription("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage); // Set the error message
    } finally {
      setLoading(false); // Stop loading after the API call
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
      <h1 className="text-4xl font-semibold mb-8">Write Your Story</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-4xl">
        {/* Story Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-xl font-medium mb-2">
            Story Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter your story title"
            required
          />
        </div>

        {/* Text Editor */}
        <WriteTextEditor value={description} onChange={handleDescriptionChange} />

        {/* Error and Success Message */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {success && (
          <div className="text-green-500 text-center mb-4">Your story has been created successfully!</div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteStory;
