/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import ReactMarkdown from "react-markdown"; // Import react-markdown

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface SearchPopupProps {
  closePopup: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const truncateText = (text: string, limit: number) => {
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

const SearchPopup = ({ closePopup, searchQuery, setSearchQuery }: SearchPopupProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!user) {
    return <Navigate to="/signIn" />;
  }

  const [searchResults, setSearchResults] = useState<any>({
    users: [],
    storyTitles: [],
    storyDescriptions: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Handle input focus and overflow
  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (inputRef.current) {
      inputRef.current.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchQuery) {
        setSearchResults({ users: [], storyTitles: [], storyDescriptions: [] });
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:3000/api/search?pattern=${debouncedSearchQuery}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        console.log("API Response Data:", data); // ✅ Debug log

        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery, token]);

  const users = searchResults?.users || [];
  const storyTitles = searchResults?.storyTitles || [];
  const storyDescriptions = searchResults?.storyDescriptions || [];

  console.log("Extracted Story Descriptions:", storyDescriptions); // ✅ Debug log

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50"
      onClick={closePopup}
    >
      <div
        className="dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800 rounded-lg p-6 w-[50%] max-h-[60%] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Users, Titles, Descriptions"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 mb-5 text-black border border-gray-300 rounded-md focus:outline-none dark:border-gray-600 "
        />
        <div className="space-y-4">
          <div>
            <h3 className="mb-1 font-bold text-gray-500">Users</h3>
            {users.length > 0 ? (
              users.map((user: any, index: number) => (
                <div
                  key={index}
                  className="p-3 mb-2 font-medium text-blue-600 transition duration-200 bg-white rounded-lg shadow-md cursor-pointer dark:bg-gray-700 hover:shadow-lg"
                  onClick={() => {
                    closePopup();
                    navigate(`/profile/${user.username}`, { replace: true });
                  }}
                >
                  <p className="text-md">{user.username}</p>
                </div>
              ))
            ) : (
              <p className="mt-2 text-sm text-gray-500 ">No users found</p>
            )}
          </div>
          <hr className="my-4 border-slate-400" />
          <div>
            <h3 className="mb-1 font-bold text-gray-500">Story by Titles</h3>
            {storyTitles.length > 0 ? (
              storyTitles.map((story: any, index: number) => (
                <div
                  key={index}
                  className="p-3 mb-2 font-medium text-blue-600 transition duration-200 bg-white rounded-lg shadow-md cursor-pointer dark:bg-gray-700 hover:shadow-lg"
                  onClick={() => {
                    closePopup();
                    navigate(`/story/${story.id}`, { state: story });
                  }}
                >
                  <p className="text-md font-semibold">{truncateText(story.title, 30)}</p>
                  <div className="mt-1 overflow-hidden text-xs text-gray-500 line-clamp-1 dark:text-gray-300">
                    <ReactMarkdown>{truncateText(story.description, 70)}</ReactMarkdown>
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-2 text-sm text-gray-500 ">No titles found</p>
            )}
          </div>
          <hr className="my-4 border-slate-400" />
          <div>
            <h3 className="mb-1 font-bold text-gray-500">Story by Descriptions</h3>
            {storyDescriptions.length > 0 ? (
              storyDescriptions.map((story: any, index: number) => {
                console.log("Story Object:", story); // ✅ Debug log inside map

                return (
                  <div
                    key={index}
                    className="p-3 mb-2 font-medium text-blue-600 transition duration-200 bg-white rounded-lg shadow-md cursor-pointer dark:bg-gray-700 hover:shadow-lg"
                    onClick={() => {
                      closePopup();
                      navigate(`/story/${story.id}`, { state: story });
                    }}
                  >
                    <p className="text-md font-semibold">{truncateText(story.title, 30)}</p>
                    <div className="mt-1 overflow-hidden text-xs text-gray-500 line-clamp-1 dark:text-gray-300">
                      <ReactMarkdown>{story.description || "No description available."}</ReactMarkdown>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="mt-2 text-sm text-gray-500 ">No descriptions found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;