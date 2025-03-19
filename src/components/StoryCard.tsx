/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Importing user icon
import MarkdownIt from "markdown-it"; // Import MarkdownIt for parsing markdown

interface Story {
  id: number;
  title: string;
  author_username: string;
  date: string; // Assuming `date` is a string in `YYYY-MM-DD` format
  description: string; // The raw markdown description content
}

const StoryCard: React.FC<{ story: Story }> = ({ story }) => {
  const navigate = useNavigate();

  // Initialize MarkdownIt to parse the markdown content
  const mdParser = new MarkdownIt();
  const parsedDescription = mdParser.render(story.description); // Parse the markdown to HTML

  const handleClick = () => {
    navigate(`/story/${story.id}`); // Navigate to the story page
  };

  // Function to handle the click on the username and prevent the story view navigation
  const handleUsernameClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the story card's onClick
  };

  // CSS Style for truncating to two lines with ellipsis
  const descriptionStyle: React.CSSProperties = {
    display: "-webkit-box",
    WebkitLineClamp: 2, // Limit to two lines
    WebkitBoxOrient: "vertical" as any,
    overflow: "hidden",
  };

  // Extract only the date part (YYYY-MM-DD)
  const formattedDate = story.date.split("T")[0]; // Removing time if in ISO format

  return (
    <div
      onClick={handleClick}
      className="p-6 bg-gray-100 rounded-lg shadow-sm w-full max-w-lg cursor-pointer"
    >
      {/* Title of the Story */}
      <h3 className="text-xl font-semibold break-words whitespace-normal mb-2">
        {story.title}
      </h3>

      {/* Description: Rendered from Markdown with Truncation */}
      <div
        className="text-gray-700 mb-3"
        style={descriptionStyle} // Apply truncation CSS
        dangerouslySetInnerHTML={{ __html: parsedDescription }} // Render the parsed HTML content
      />

      {/* Author username and date layout (Now placed at the bottom) */}
      <div className="flex justify-between items-center text-gray-600 mt-2">
        {/* User Icon and Author Name on the left */}
        <div className="flex items-center space-x-2">
          <FaUserCircle className="text-lg" />
          <Link
            to={`/profile/${story.author_username}`}
            className="font-medium text-blue-600 hover:text-blue-800"
            onClick={handleUsernameClick} // Stop propagation for username click
          >
            {story.author_username}
          </Link>
        </div>

        {/* Date on the right */}
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>
    </div>
  );
};

export default StoryCard;
