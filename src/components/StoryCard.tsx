/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import MarkdownIt from "markdown-it";

interface Story {
  id: number;
  title: string;
  author_username: string;
  date: string;
  description: string;
}

const StoryCard: React.FC<{ story: Story }> = ({ story }) => {
  const navigate = useNavigate();

  const mdParser = new MarkdownIt();
  const parsedDescription = mdParser.render(story.description);

  const handleClick = () => {
    navigate(`/story/${story.id}`);
  };

  const handleUsernameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const descriptionStyle: React.CSSProperties = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as any,
    overflow: "hidden",
    minHeight: "3rem", 
  };

  const formattedDate = new Date(story.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div
      onClick={handleClick}
      className="p-6 bg-gray-100 rounded-lg shadow-sm w-full max-w-2xl cursor-pointer" 
    >
     
      <h3 className="text-xl font-semibold break-words mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
        {story.title}
      </h3>

      <div
        className="text-gray-700 mb-3"
        style={descriptionStyle}
        dangerouslySetInnerHTML={{ __html: parsedDescription }}
      />

    
      <div className="flex justify-between items-center text-gray-600 mt-2">
       
        <div className="flex items-center space-x-2">
          <FaUserCircle className="text-lg" />
          <Link
            to={`/profile/${story.author_username}`}
            className="font-medium text-blue-600 hover:text-blue-800"
            onClick={handleUsernameClick} 
          >
            {story.author_username}
          </Link>
        </div>


        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>
    </div>
  );
};

export default StoryCard;
