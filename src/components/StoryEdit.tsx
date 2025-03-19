/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import WriteTextEditor from "../components/WriteTextEditor";
import SuccessPopup from "../components/SuccessPopUp"; 

interface Story {
  id: string;
  title: string;
  description: string;
}

const StoryEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false); // ✅ State for success popup
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStory = async () => {
      try {
        if (!token) {
          setError("Unauthorized access. Please log in.");
          return;
        }

        const response = await fetch(`http://localhost:3000/api/stories/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch story.");
        const data = await response.json();

        setStory(data);
        setTitle(data.title); // Pre-fill title
        setDescription(data.description); // Pre-fill description
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      }
    };

    fetchStory();
  }, [id, token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/stories/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) throw new Error("Failed to update story.");

      setShowSuccess(true); // ✅ Show success popup

      setTimeout(() => {
        navigate(`/story/${id}`);
      }, 2500); // ✅ Redirect after 2.5s
    } catch (err) {
      setError("Error updating story. Please try again.");
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!story) return <p className="text-gray-500">Loading story...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 relative">
      {/* ✅ Background blur when popup is visible */}
      <div className={`absolute inset-0 bg-gray-100 ${showSuccess ? "blur-sm" : ""}`}></div>

      {/* ✅ Success Popup Component */}
      {showSuccess && (
        <SuccessPopup message="Story updated successfully!" onClose={() => setShowSuccess(false)} />
      )}

      {/* Main Content (Form) */}
      <div className={`relative z-10 ${showSuccess ? "pointer-events-none" : ""}`}>
        <h1 className="text-3xl font-bold mb-6">Edit Story</h1>

        <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow-md w-full max-w-4xl">
          {/* Title Input */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-xl font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Markdown Editor for Description */}
          <WriteTextEditor value={description} onChange={setDescription} />

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            >
              Update Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoryEdit;
