/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  name: string;
  username: string;
  role: string;
  joinDate: string;
  id: string;
  email: string;
}

const ProfileCard: React.FC<{ profile: ProfileData | null; isOwnProfile: boolean; onUpdate: () => void }> = ({
  profile,
  isOwnProfile,
  onUpdate,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      {/* Profile Picture Placeholder */}
      <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-white text-3xl font-bold">
        <span>{profile?.name ? profile.name[0] : "P"}</span>
      </div>

      {/* Profile Details */}
      {profile ? (
        <div className="mt-6 w-full">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Name:</td>
                <td className="p-2">{profile.name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Username:</td>
                <td className="p-2">@{profile.username}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Email:</td>
                <td className="p-2">{profile.email}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Role:</td>
                <td className="p-2">{profile.role === "1" ? "Admin" : "User"}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Joined:</td>
                <td className="p-2">{profile.joinDate.split("T")[0]}</td>
              </tr>
            </tbody>
          </table>

          {/* Show options only if it's the logged-in user's profile */}
          {isOwnProfile && (
            <div className="mt-4 flex flex-col space-y-2">
              <button
                onClick={onUpdate} // Trigger the update modal here
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                Update Profile
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">Change Password</button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600 mt-4">Loading profile...</p>
      )}
    </div>
  );
};

export default ProfileCard;
