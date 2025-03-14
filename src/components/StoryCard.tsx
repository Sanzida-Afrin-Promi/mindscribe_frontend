import React from "react";
import { useNavigate } from "react-router-dom";

interface Story {
  id: number;
  title: string;
  author_username: string;
}

const StoryCard: React.FC<{ story: Story }> = ({ story }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/story/${story.id}`); // Navigate to the story page
  };

  return (
    <div
      onClick={handleClick}
      className="p-6 bg-gray-100 rounded-lg shadow-sm w-full max-w-lg cursor-pointer"
    >
      <h3 className="text-xl font-semibold break-words whitespace-normal">
        {story.title}
      </h3>
      <p className="text-gray-600">By {story.author_username}</p>
    </div>
  );
};

export default StoryCard;
