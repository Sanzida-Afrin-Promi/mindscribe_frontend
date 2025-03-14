import React from "react";

interface ProfileData {
  name: string;
  username: string;
  role: string;
  joinDate: string;
}

const ProfileCard: React.FC<{ profile: ProfileData | null }> = ({ profile }) => {
  return (
    <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      {/* Profile Picture Placeholder */}
      <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-white text-3xl font-bold">
        <span>{profile?.name ? profile.name[0] : "P"}</span>
      </div>

      {/* Profile Details in Table Format */}
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
                <td className="p-2 font-semibold">Role:</td>
                <td className="p-2">
                  {profile.role === "1" ? "Admin" : "User"}
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Joined:</td>
                <td className="p-2">{profile.joinDate.split("T")[0]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 mt-4">Loading profile...</p>
      )}
    </div>
  );
};

export default ProfileCard;
