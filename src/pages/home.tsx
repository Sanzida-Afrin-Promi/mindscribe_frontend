import React, { useEffect, useState } from "react";
import StoryCard from "../components/StoryCard"; // Import the StoryCard component

const Home: React.FC = () => {
  const [stories, setStories] = useState<{ id: number; title: string; author_username: string; date: string; description: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStories, setTotalStories] = useState(0); // Track total stories
  const storiesPerPage = 9;
  const [loading, setLoading] = useState(false);

  // Fetch paginated stories
  const fetchStories = async (page: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
     
      const response = await fetch(`http://localhost:3000/api/story?page=${page}&limit=${storiesPerPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stories: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setStories(data.stories); // Correct API response handling
      setTotalStories(data.totalStories); // Set total count

    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stories on page change
  useEffect(() => {
    fetchStories(currentPage);
  }, [currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(totalStories / storiesPerPage);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Stories</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.length > 0 ? (
              stories.map((story) => (
                <StoryCard key={story.id} story={story} /> // Using StoryCard component
              ))
            ) : (
              <p className="text-gray-500">No stories available</p>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              ⬅ Prev
            </button>
            <span className="text-lg font-semibold">{currentPage} / {totalPages}</span>
            <button
              className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next ➡
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
