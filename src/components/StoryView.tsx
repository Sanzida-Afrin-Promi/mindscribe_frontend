/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import MarkdownIt from "markdown-it"; // Import MarkdownIt for parsing markdown

interface Story {
  id: string;
  title: string;
  author_username: string;
  imageUrl: string;
  description: string;
}

const StoryView = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string>("");

  const { user } = useAuth(); // Access user from AuthContext
  const token = localStorage.getItem("token");

  // Fetch the story details
  useEffect(() => {
    const fetchStory = async () => {
      try {
        if (!token) {
          setError("Unauthorized access. Please log in.");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/api/stories/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch story.");
        const data = await response.json();
        setStory(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchStory();
  }, [id, token]);

  // Show loading or error messages
  if (error) return <p className="text-red-500">{error}</p>;
  if (!story) return <p className="text-gray-500">Loading story...</p>;

  // Initialize MarkdownIt to parse the markdown content
  const mdParser = new MarkdownIt();
  const parsedDescription = mdParser.render(story.description);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Title - Ensures it wraps correctly */}
      <h1 className="text-3xl font-bold mb-4 break-words whitespace-normal max-w-full">
        {story.title}
      </h1>

      {/* Author Section */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
        <p className="text-gray-700">@{story.author_username}</p>
      </div>

      {/* Render Image if available */}
      {story.imageUrl && (
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full rounded-lg mb-4"
        />
      )}

      {/* Description with Fixed Height and Scroll */}
      <div
        className="text-gray-800 max-h-64 overflow-auto whitespace-pre-line break-words"
        dangerouslySetInnerHTML={{ __html: parsedDescription }}
      />
    </div>
  );
};

export default StoryView;
