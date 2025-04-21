/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import ChangePassword from "../components/ChangePassword";
import ProfileCard from "../components/ProfileCard";
import ProfileUpdate from "../components/ProfileUpdate";
import StoryCard from "../components/StoryCard";
import { useAuth } from "../context/authContext";
import NotFound from "./NotFound";
import { useProfileData } from "../hooks/useProfileData";
import { useState } from "react";
import { Role } from "../constants/enum";

const Profile = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const { user } = useAuth();
  const { username } = useParams<{ username: string }>();

  const isOwnProfile = username === user?.username;
  const isAdmin = Number(user?.role) === Role.Admin;

  const targetUsername = username || user?.username || "";
  const { profile, stories, error, setProfile } = useProfileData(targetUsername);

  const handleProfileUpdate = (updatedProfile: any) => {
      setProfile(updatedProfile);
      setShowUpdate(false);
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  if (!profile) return <NotFound />;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-8 relative">
      <div className="w-full max-w-6xl mt-12 mb-16 flex space-x-8">
        <ProfileCard
          profile={profile}
          isOwnProfile={isOwnProfile}
          isAdmin={isAdmin}
          onUpdate={() => setShowUpdate(true)}
          onChangePassword={handleChangePassword}
        />

        <div className="w-2/3 bg-white p-3 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">
            Stories by {profile.name || "User"}
          </h2>

          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          <div className="space-y-4 overflow-y-auto max-h-[600px] ml-2">
            {stories.length > 0 ? (
              stories.map((story) => <StoryCard key={story.id} story={story} />)
            ) : (
              <p className="text-gray-600">No stories found.</p>
            )}
          </div>
        </div>
      </div>

      {showUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <ProfileUpdate profile={profile} onClose={handleProfileUpdate} />
          </div>
        </div>
      )}

      {showChangePassword && profile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <ChangePassword
              onClose={() => setShowChangePassword(false)}
              userId={profile.id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
