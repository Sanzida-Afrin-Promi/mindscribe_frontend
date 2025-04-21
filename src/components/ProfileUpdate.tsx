import React from "react";
import { Profile, useProfileUpdate } from "../hooks/useProfileUpdate";
import ConfirmationPopup from "./ConfirmationPopUp";
import SuccessPopup from "./SuccessPopUp";

const ProfileUpdate: React.FC<{
  profile: Profile;
  onClose: (updatedProfile: Profile) => void;
}> = ({ profile, onClose }) => {
  const {
    name,
    setName,
    email,
    setEmail,
    showConfirmationPopup,
    showSuccessPopup,
    isBlurred,
    handleUpdate,
    confirmUpdate,
    cancelUpdate,
    setShowSuccessPopup,
  } = useProfileUpdate(profile, onClose);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg relative">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

      <div className={`space-y-4 ${isBlurred ? "blur-sm" : ""}`}>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => onClose(profile)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>

      {showConfirmationPopup && (
        <ConfirmationPopup
          message="Are you sure you want to update your profile?"
          onConfirm={confirmUpdate}
          onClose={cancelUpdate}
        />
      )}

      {showSuccessPopup && (
        <SuccessPopup
          message="Your profile has been updated successfully!"
          onClose={() => setShowSuccessPopup(false)} 
        />
      )}
    </div>
  );
};

export default ProfileUpdate;
