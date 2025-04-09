/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WriteTextEditor from "../components/WriteTextEditor"; 
import SuccessPopup from "../components/SuccessPopUp"; 

const WriteStory = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [storyId, setStoryId] = useState(""); 
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
      setStoryId(data.id); 
      setShowSuccess(true); 

     
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
     
      <div className={`absolute inset-0 bg-gray-100 ${showSuccess ? "blur-sm" : ""}`}></div>

      
      <div className={`relative z-10 w-full max-w-5xl px-6 ${showSuccess ? "pointer-events-none" : ""}`}>
        <h1 className="text-5xl font-bold mb-10 text-center">Write Your Story</h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full">
        
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

         
          <div className="mb-6">
            <WriteTextEditor value={description} onChange={handleDescriptionChange} />
          </div>

         
          {error && <div className="text-red-500 text-center text-lg">{error}</div>}

         
          <div className="flex justify-center mt-6">
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
