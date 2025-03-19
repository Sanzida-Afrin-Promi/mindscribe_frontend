import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import ProfileCard from "../components/ProfileCard";
import StoryCard from "../components/StoryCard";
import ProfileUpdate from "../components/ProfileUpdate";

interface ProfileData {
  id: string;
  name: string;
  username: string;
  role: string;
  joinDate: string;
  email: string;
}

interface Story {
  id: number;
  title: string;
  author_username: string;
  date: string;
  description: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string>("");
  const [showUpdate, setShowUpdate] = useState<boolean>(false); // Added state for showing update modal

  const navigate = useNavigate();
  const { user } = useAuth();
  const { username } = useParams<{ username: string }>();

  const isOwnProfile = username === user?.username;

  useEffect(() => {
    const targetUsername = username || user?.username || "";
    
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        const profileResponse = await fetch(`http://localhost:3000/api/users/username/${targetUsername}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileResponse.ok) throw new Error("Failed to fetch profile.");
        const profileData = await profileResponse.json();
        setProfile(profileData);

        const storiesResponse = await fetch(`http://localhost:3000/api/stories/author/${targetUsername}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (storiesResponse.status === 404) return;
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
  }, [username, user, navigate]);

  const handleProfileUpdate = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile); // Update the profile state with the updated profile data
    setShowUpdate(false); // Close the update modal after updating the profile
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-8 relative">
      <div className="w-full max-w-6xl mt-12 mb-16 flex space-x-8">
        {/* Profile Card */}
        <ProfileCard profile={profile} isOwnProfile={isOwnProfile} onUpdate={() => setShowUpdate(true)} />

        {/* Stories Section */}
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Stories by {profile?.name || "User"}</h2>

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

      {/* Profile Update Modal */}
      {showUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <ProfileUpdate profile={profile} onClose={handleProfileUpdate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
