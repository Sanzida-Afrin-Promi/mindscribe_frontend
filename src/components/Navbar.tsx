import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-semibold">
        <Link to="/home">MyApp</Link>
      </div>
      <div className="flex items-center space-x-6">
        <Link to="/home" className="hover:text-gray-400">Home</Link>
        <Link to="/stories" className="hover:text-gray-400">Stories</Link>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img src="/profile-icon.png" alt="Profile" className="w-8 h-8 rounded-full" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700">View Profile</Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-700">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
