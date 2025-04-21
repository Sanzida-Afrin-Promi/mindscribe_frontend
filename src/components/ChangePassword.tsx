
import React, { useState } from "react";
import SuccessPopup from "./SuccessPopUp";
import ConfirmationPopup from "./ConfirmationPopUp";

const ChangePassword = ({
  onClose,
  userId,
}: {
  onClose: () => void;
  userId: string;
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    setShowConfirmationPopup(true);
  };

  const confirmChangePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await fetch(
        `http://localhost:3000/api/auth/user/password/change/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword, userId }),
        }
      );

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message || "Failed to change password.");
      }

      setShowConfirmationPopup(false);
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        onClose();
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong.");
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg relative">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleChangePassword}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Change Password
          </button>
        </div>
      </div>

      {showConfirmationPopup && (
        <ConfirmationPopup
          message="Are you sure you want to change your password?"
          onConfirm={confirmChangePassword}
          onClose={() => setShowConfirmationPopup(false)}
        />
      )}

      {showSuccessPopup && (
        <SuccessPopup
          message="Your password has been changed successfully!"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
};

export default ChangePassword;
