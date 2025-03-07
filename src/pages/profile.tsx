import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Profile: React.FC = () => {
  const [user, setUser] = useState<{ fullName: string, username: string, joinDate: string, email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Error fetching profile:", err));
  }, []);

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg text-center">
        <img src="/profile-icon.png" alt="Profile" className="w-24 h-24 mx-auto rounded-full mb-4" />
        <h2 className="text-xl font-semibold">{user.fullName}</h2>
        <p className="text-gray-600">@{user.username}</p>
        <p className="text-gray-500">Joined: {user.joinDate}</p>
        <p className="text-gray-500">{user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
