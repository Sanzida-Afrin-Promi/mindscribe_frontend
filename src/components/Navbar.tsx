import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaHome, FaRegEdit } from "react-icons/fa"; // New write icon (FaRegEdit)

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    // Clear session
    localStorage.removeItem("token");
    // Redirect to SignIn page
    navigate("/signIn");
    closeDropdown();
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
      <Link to="/home" className="text-2xl font-bold hover:text-gray-300">
        Mind Scribe
      </Link>

      <div className="space-x-6 flex items-center">
        {/* Home Icon with Link */}
        <Link to="/home" className="flex items-center hover:text-gray-300" onClick={closeDropdown}>
          <FaHome className="text-2xl" />
        </Link>

        {/* Write Stories Icon with Link */}
        <Link to="/story/create" className="flex items-center hover:text-gray-300" onClick={closeDropdown}>
          <FaRegEdit className="text-2xl mr-2" /> Write
        </Link>

        {/* Profile Icon */}
        <Link to="/profile" className="flex items-center hover:text-gray-300">
          <FaUserCircle className="text-3xl" />
        </Link>

        {/* Dropdown for Logout */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-lg hover:text-gray-300 focus:outline-none"
          >
            <FaChevronDown className="text-xl" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-white hover:bg-gray-600"
              >
                <FaSignOutAlt /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
