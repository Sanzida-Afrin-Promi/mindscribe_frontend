// StoryView.tsx
import MarkdownIt from "markdown-it";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ReactMarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { Link } from "react-router-dom";
import SuccessPopup from "../components/SuccessPopUp";
import DeletePopup from "./ConfirmationPopUp";
import { useStoryViewLogic } from "../hooks/useStoryViewLogic";
import { Role } from "../constants/enum";


const StoryView = () => {
  const {
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
  } = useStoryViewLogic();

  const mdParser = new MarkdownIt();

  const renderMarkdown = (text: string) => mdParser.render(text);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!story) return <p className="text-gray-500">Loading story...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-8 overflow-hidden">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl h-[80vh] overflow-y-auto relative">
        {(user?.username === story.author_username ||
          Number(user?.role) === Role.Admin) && (
          <div className="absolute top-4 right-4 flex space-x-3">
            <button
              onClick={handleEdit}
              className="text-blue-500 hover:text-blue-700 text-xl"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => setShowDeletePopup(true)}
              className="text-red-500 hover:text-red-700 text-xl"
            >
              <FaTrashAlt />
            </button>
          </div>
        )}
        <div className="mb-6">
          <h1 className="text-3xl font-bold break-words max-w-full">
            {story.title}
          </h1>
        </div>
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
        {story.imageUrl && (
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full rounded-lg mb-6 shadow-md"
          />
        )}
        <div className="prose max-w-none flex-grow mb-6">
          <ReactMarkdownEditor
            value={story.description}
            renderHTML={renderMarkdown}
            view={{ menu: false, md: false, html: true }}
            style={{ height: "400px" }}
          />
        </div>
        {showDeletePopup && (
          <DeletePopup
            message="Are you sure you want to delete this story?"
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
          />
        )}
        {showSuccessPopup && (
          <SuccessPopup
            message="Your story has been deleted successfully!"
            onClose={() => setShowSuccessPopup(false)}
          />
        )}
      </div>
    </div>
  );
};

export default StoryView;
