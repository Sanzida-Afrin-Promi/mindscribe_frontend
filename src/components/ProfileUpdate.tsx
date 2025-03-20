/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuccessPopup from "./SuccessPopUp"; // Import the SuccessPopup component
import ConfirmationPopup from "./ConfirmationPopUp"; // Import the ConfirmationPopup component

const ProfileUpdate: React.FC<{ profile: any; onClose: (updatedProfile: any) => void }> = ({ profile, onClose }) => {
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false); // For blurring the update form

  const handleUpdate = () => {
    setShowConfirmationPopup(true); // Show confirmation popup when update is triggered
  };

  const confirmUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await fetch(`http://localhost:3000/api/user/${profile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) throw new Error("Failed to update profile.");

      const updatedProfile = await response.json();
      setIsBlurred(true); // Blur the update form when the update starts
      setShowConfirmationPopup(false); // Hide the confirmation popup
      setShowSuccessPopup(true); // Show the success popup

      setTimeout(() => {
        setShowSuccessPopup(false); // Hide success popup after some time
        onClose(updatedProfile); // Send the updated profile back to the parent
      }, 2000);
    } catch (err) {
      alert(err);
    }
  };

  const cancelUpdate = () => {
    setShowConfirmationPopup(false); // Close the confirmation popup if canceled
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg relative">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
      
      {/* Profile Update Form */}
      <div className={`space-y-4 ${isBlurred ? 'blur-sm' : ''}`}>
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
          <button onClick={() => onClose(profile)} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
          <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmationPopup && (
        <ConfirmationPopup
          message="Are you sure you want to update your profile?"
          onConfirm={confirmUpdate}
          onClose={cancelUpdate}
        />
      )}

      {/* Success Popup */}
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
