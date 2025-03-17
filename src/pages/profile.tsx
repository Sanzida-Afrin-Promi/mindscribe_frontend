/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import ProfileCard from "../components/ProfileCard";
import StoryCard from "../components/StoryCard";

interface ProfileData {
  name: string;
  username: string;
  role: string;
  joinDate: string;
}

interface Story {
  id : number
  title: string;
  author_username: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError("User not found. Please log in.");
      navigate("/signIn");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        // Fetch profile
        const profileResponse = await fetch(`http://localhost:3000/api/users/${user.id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (!profileResponse.ok) throw new Error("Failed to fetch profile.");
        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Fetch stories
        const storiesResponse = await fetch(`http://localhost:3000/api/stories/author/${user.username}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (!storiesResponse.ok) throw new Error("Failed to fetch stories.");
        const storiesData = await storiesResponse.json();
        setStories(storiesData);

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Something went wrong.");
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchProfileData();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-8">
      <div className="w-full max-w-6xl mt-12 mb-16 flex space-x-8">
        {/* Profile Card */}
        <ProfileCard profile={profile} />
  
        {/* Stories Section */}
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Your Stories</h2>
  
          {/* Error Message */}
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
  
         
          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
            {stories.length > 0 ? (
              stories.map((story) => <StoryCard key={story.id} story={story} />) 
            ) : (
              <p className="text-gray-600">No stories found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Profile;
