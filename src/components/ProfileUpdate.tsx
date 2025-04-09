/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

import SuccessPopup from "./SuccessPopUp";
import ConfirmationPopup from "./ConfirmationPopUp"; 

const ProfileUpdate: React.FC<{ profile: any; onClose: (updatedProfile: any) => void }> = ({ profile, onClose }) => {
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false); 

  const handleUpdate = () => {
    setShowConfirmationPopup(true); 
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
      setIsBlurred(true); 
      setShowConfirmationPopup(false); 
      setShowSuccessPopup(true); 

      setTimeout(() => {
        setShowSuccessPopup(false); 
        onClose(updatedProfile); 
      }, 2000);
    } catch (err) {
      alert(err);
    }
  };

  const cancelUpdate = () => {
    setShowConfirmationPopup(false); 
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg relative">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
      

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
