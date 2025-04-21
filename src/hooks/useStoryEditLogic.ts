/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { fetchStoryById } from "./useStoryViewLogic";
import { Role } from "../constants/enum";



interface Story {
  id: string;
  title: string;
  description: string;
  author_username: string;
}

export const useStoryEditLogic = () => {
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

        const data = await fetchStoryById(id!, token);

        if (
          user?.username !== data.author_username &&
          Number(user?.role) !== Role.Admin
        ) {
          setError("You are not authorized to edit this story.");
          navigate("/unauthorized");
          return;
        }

        setStory(data);
        setTitle(data.title);
        setDescription(data.description);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
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
    if (user?.username !== story?.author_username && Number(user?.role) !== Role.Admin) {
      setError("You are not authorized to edit this story.");
      navigate("/unauthorized");
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

      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/stories/${id}`);
      }, 2500);
    } catch (err) {
      setError("Error updating story. Please try again.");
    }
  };

  return {
    story,
    title,
    setTitle,
    description,
    setDescription,
    error,
    showSuccess,
    setShowSuccess,
    handleUpdate,
  };
};
