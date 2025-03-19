/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WriteTextEditor from "../components/WriteTextEditor"; // Import the text editor
import SuccessPopup from "../components/SuccessPopUp"; // Import SuccessPopup component

const WriteStory = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(""); // For error messages
  const [loading, setLoading] = useState(false); // For loading state
  const [showSuccess, setShowSuccess] = useState(false); // For success popup
  const [storyId, setStoryId] = useState(""); // Store the created story's ID
  const navigate = useNavigate();

  const handleTitleChange = (event: { target: { value: string } }) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Title and description cannot be empty.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found. Please log in.");
      setLoading(false);
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

      if (!response.ok) {
        throw new Error("Failed to submit story. Please try again.");
      }

      const data = await response.json();
      setStoryId(data.id); // Store the story ID for redirection
      setShowSuccess(true); // Show success popup

      // Redirect to StoryView after 4.5 seconds
      setTimeout(() => {
        navigate(`/story/${data.id}`);
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 relative">
      {/* Background blur only when success popup is visible */}
      <div className={`absolute inset-0 bg-gray-100 ${showSuccess ? "blur-sm" : ""}`}></div>

      {/* Main Content (Form) */}
      <div className={`relative z-10 ${showSuccess ? "pointer-events-none" : ""}`}>
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

          {/* Error Message */}
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

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

      {/* Success Popup */}
      {showSuccess && (
        <SuccessPopup
          message="Your story has been created successfully!"
          onClose={() => setShowSuccess(false)} // Close success popup
        />
      )}
    </div>
  );
};

export default WriteStory;
