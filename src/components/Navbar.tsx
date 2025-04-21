import React, { useState } from "react";
import { FaChevronDown, FaRegEdit, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import SearchPopup from "./SearchPopUp";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchPopupVisible, setIsSearchPopupVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const handleWriteClick = () => {
    if (!user) {
      navigate("/signIn");
    } else {
      navigate("/story/create");
    }
  };

  const closeSearchPopup = () => {
    setIsSearchPopupVisible(false);
    setSearchQuery("");
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
      <Link to="/" className="text-2xl font-bold hover:text-gray-300">
        MindScribe
      </Link>

      {user && (
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-md text-black focus:outline-none"
            onClick={() => setIsSearchPopupVisible(true)}
          />
        </div>
      )}

      <div className="flex items-center space-x-6">
        <Link to="/stories" className="hover:text-gray-300">
          Recent Stories
        </Link>
        <button
          onClick={handleWriteClick}
          className="hover:text-gray-300 flex items-center"
        >
          <FaRegEdit className="text-2xl" />
        </button>
        {user ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-lg hover:text-gray-300 focus:outline-none"
            >
              <FaUserCircle className="text-3xl" />
              <FaChevronDown className="ml-1 text-xl" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg z-50">
                <Link
                  to={`/profile/${user.username}`}
                  className="block px-4 py-2 text-white hover:bg-gray-600"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signIn" className="hover:text-gray-300">
            Sign In
          </Link>
        )}
      </div>

      {isSearchPopupVisible && user && (
        <SearchPopup
          closePopup={closeSearchPopup}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
    </nav>
  );
};

export default Navbar;
