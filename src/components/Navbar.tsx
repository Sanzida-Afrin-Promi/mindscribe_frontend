import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
      <div className="text-2xl font-bold">Mind Scribe</div>
      <div className="space-x-4 flex items-center">
        {/* Close the dropdown when clicking any navigation link */}
        <Link to="/home" className="hover:text-gray-300" onClick={closeDropdown}>Home</Link>
        <Link to="/writeStory" className="hover:text-gray-300" onClick={closeDropdown}>Write Stories</Link>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="hover:text-gray-300 focus:outline-none"
          >
            Profile
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded shadow-lg">
              <Link
                to="/profile"
                onClick={closeDropdown} // Close dropdown when clicking the profile link
                className="block px-4 py-2 text-white hover:bg-gray-600"
              >
                Your Profile
              </Link>
              <button
                onClick={() => {
                  alert("Logging out..."); // Handle logout here
                  closeDropdown(); // Close dropdown on logout
                }}
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
