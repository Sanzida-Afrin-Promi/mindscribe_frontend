/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Role } from "../constants/enum";



interface Story {
  id: string;
  title: string;
  author_username: string;
  imageUrl: string;
  description: string;
  date: string;
}

export const fetchStoryById = async (id: string,token: string) => {
  const response = await fetch(`http://localhost:3000/api/stories/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error("Story not found.");
   
  }

  return response.json();
};

export const useStoryViewLogic = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string>("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token")||"";

  useEffect(() => {
    const fetchStory = async () => {
      try {
        

        const data = await fetchStoryById(id!, token);
        setStory(data);
      } catch (err) {
        if (err instanceof Error && err.message === "Story not found.") {
          navigate("/not-found");
        } else {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred."
          );
        }
      }
    };

    fetchStory();
  }, [id, token]);

  const handleEdit = () => story && navigate(`/stories/${story.id}/edit`);

  const handleDeleteConfirm = async () => {
    if (!story || !token) return;

    if (user?.username !== story.author_username && Number(user?.role) !== Role.Admin) {
      setError("You are not authorized to edit this story.");
      navigate("/unauthorized");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/stories/${story.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete story.");

      setShowDeletePopup(false);
      setShowSuccessPopup(true);

      setTimeout(() => {
        navigate(`/profile/${user?.username}`);
      }, 2500);
    } catch (err) {
      alert("Error deleting story. Please try again.");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeletePopup(false);
    navigate(`/stories/${story?.id}`);
  };

  return {
    story,
    error,
    showDeletePopup,
    showSuccessPopup,
    setShowDeletePopup,
    setShowSuccessPopup,
    handleEdit,
    handleDeleteConfirm,
    handleDeleteCancel,
    user,
  };
};
