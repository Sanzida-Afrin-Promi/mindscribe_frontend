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
      const response = await fetch("http://localhost:3000/api/story", {
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

      // Redirect to StoryView after 2.5 seconds
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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 relative">
      {/* Background blur when success popup is visible */}
      <div className={`absolute inset-0 bg-gray-100 ${showSuccess ? "blur-sm" : ""}`}></div>

      {/* Main Content (Form) */}
      <div className={`relative z-10 w-full max-w-5xl px-6 ${showSuccess ? "pointer-events-none" : ""}`}>
        <h1 className="text-5xl font-bold mb-10 text-center">Write Your Story</h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full">
          {/* Story Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-2xl font-medium mb-3">
              Story Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full p-4 border border-gray-300 rounded-lg text-lg"
              placeholder="Enter your story title"
              required
            />
          </div>

          {/* Text Editor - Enlarged */}
          <div className="mb-2">
            <WriteTextEditor value={description} onChange={handleDescriptionChange} />
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-center text-lg">{error}</div>}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`px-8 py-3 text-xl bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition ${
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
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default WriteStory;
