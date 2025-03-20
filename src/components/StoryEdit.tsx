/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SuccessPopup from "../components/SuccessPopUp";
import WriteTextEditor from "../components/WriteTextEditor";
import { useAuth } from "../context/authContext";

interface Story {
  id: string;
  title: string;
  description: string;
  author_username: string;
}

const StoryEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
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

        const response = await fetch(`http://localhost:3000/api/story/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch story.");
        const data = await response.json();

        if (user?.username !== data.author_username && Number(user?.role) !== 1) {
          setError("You are not authorized to edit this story.");
          navigate("/unauthorized");
          return;
        }

        setStory(data);
        setTitle(data.title);
        setDescription(data.description);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      }
    };

    fetchStory();
  }, [id, token, user?.username]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description cannot be empty.");
      return;
    }
    if (user?.username !== story?.author_username && Number(user?.role) !== 1) {
      setError("You are not authorized to edit this story.");
      navigate("/unauthorized");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/story/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) throw new Error("Failed to update story.");

      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/story/${id}`);
      }, 2500);
    } catch (err) {
      setError("Error updating story. Please try again.");
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!story) return <p className="text-gray-500">Loading story...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center py-8 bg-gray-100">
      {showSuccess && <SuccessPopup message="Story updated successfully!" onClose={() => setShowSuccess(false)} />}

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-4">Edit Story</h1>

        <form onSubmit={handleUpdate} className="w-full flex flex-col gap-6">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
            placeholder="Story Title"
            required
          />

          <div className="h-[450px] w-full">
            <WriteTextEditor value={description} onChange={setDescription} />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
              Update Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoryEdit;