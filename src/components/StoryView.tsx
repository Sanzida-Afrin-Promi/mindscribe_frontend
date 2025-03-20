import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import MarkdownRenderer from "../components/MarkDownRenderer";
import SuccessPopup from "../components/SuccessPopUp"; // Import the SuccessPopup component
import { useAuth } from "../context/authContext";
import DeletePopup from "./ConfirmationPopUp"; // Import the DeletePopup component

interface Story {
  id: string;
  title: string;
  author_username: string;
  imageUrl: string;
  description: string;
  date: string; // Assuming the API provides this
}

const StoryView = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string>("");
  const [showDeletePopup, setShowDeletePopup] = useState(false); // State to show delete popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State to show success popup
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

        const response = await fetch(
          `http://localhost:3000/api/story/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch story.");
        const data = await response.json();
        setStory(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      }
    };

    fetchStory();
  }, [id, token]);

  const handleEdit = () => story && navigate(`/story/edit/${story.id}`);

  const handleDeleteConfirm = async () => {
    if (!story || !token) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/story/${story.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete story.");

      setShowDeletePopup(false); // Close the delete popup
      setShowSuccessPopup(true); // Show success popup
      setTimeout(() => {
        navigate(`/profile/${user?.username}`); // Redirect to the user's profile after success
      }, 2500);
    } catch (err) {
      console.error("Error deleting story:", err);
      alert("Error deleting story. Please try again.");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeletePopup(false); // Close the delete confirmation popup
    navigate(`/story/${story?.id}`); // Go back to the story view
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!story) return <p className="text-gray-500">Loading story...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl relative">
        {/* Edit and Delete Buttons */}
        {(user?.username === story.author_username || Number(user?.role) === 1) && (
          <div className="absolute top-4 right-4 flex space-x-3">
            <button
              onClick={handleEdit}
              className="text-blue-500 hover:text-blue-700 text-xl"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => setShowDeletePopup(true)} // Show delete confirmation
              className="text-red-500 hover:text-red-700 text-xl"
            >
              <FaTrashAlt />
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold break-words max-w-full">
            {story.title}
          </h1>
        </div>

        {/* Story Author & Date Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
          <div>
            <Link
              to={`/profile/${story.author_username}`}
              className="text-blue-600 hover:underline font-medium"
            >
              @{story.author_username}
            </Link>
            <p className="text-sm text-gray-500">
              {new Date(story.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Story Image */}
        {story.imageUrl && (
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full rounded-lg mb-6 shadow-md"
          />
        )}

        {/* Story Content */}
        <div className="prose max-w-none">
          <MarkdownRenderer markdownContent={story.description} content={""} />
        </div>

        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <DeletePopup
            message="Are you sure you want to delete this story?"
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
          />
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <SuccessPopup
            message="Your story has been deleted successfully!"
            onClose={() => navigate(`/profile/${user?.username}`)} // Redirect to user's profile after success
          />
        )}
      </div>
    </div>
  );
};

export default StoryView;