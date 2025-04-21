/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useDebounce } from "./useDebounce";

interface User {
  username: string;
}

interface Story {
  id: string;
  title: string;
  description: string;
}

interface SearchResults {
  users: User[];
  storyTitles: Story[];
  storyDescriptions: Story[];
}

export const useSearchPopup = (
  searchQuery: string,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
  closePopup: () => void
) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [searchResults, setSearchResults] = useState<SearchResults>({
    users: [],
    storyTitles: [],
    storyDescriptions: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (inputRef.current) {
      inputRef.current.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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

        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery, token]);

  return {
    user,
    navigate,
    inputRef,
    searchResults,
  };
};
