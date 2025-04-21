/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export interface Profile {
  id: string;
  name: string;
  email: string;
}

export const useProfileUpdate = (
  profile: Profile,
  onClose: (updatedProfile: Profile) => void
) => {
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

      const response = await fetch(
        `http://localhost:3000/api/users/${profile.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email }),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile.");

      const updatedProfile = await response.json();
      setIsBlurred(true);
      setShowConfirmationPopup(false);
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
        onClose(updatedProfile);
      }, 2000);
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    }
  };

  const cancelUpdate = () => {
    setShowConfirmationPopup(false);
  };

  return {
    name,
    setName,
    email,
    setEmail,
    showConfirmationPopup,
    setShowConfirmationPopup,
    showSuccessPopup,
    setShowSuccessPopup,
    isBlurred,
    handleUpdate,
    confirmUpdate,
    cancelUpdate,
  };
};
