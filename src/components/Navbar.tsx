import React, { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaHome,
  FaRegEdit,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import SearchPopup from "./SearchPopUp";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchPopupVisible, setIsSearchPopupVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeDropdown();
    navigate("/signIn");
  };

  const closeSearchPopup = () => {
    setSearchQuery(""); 
    setIsSearchPopupVisible(false); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target &&
        !(event.target as HTMLElement).closest(".dropdown-container")
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
      <Link to="/home" className="text-2xl font-bold hover:text-gray-300">
        Mind Scribe
      </Link>

      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-10 py-2 rounded-md text-black focus:outline-none"
          onClick={() => setIsSearchPopupVisible(true)}
        />
        <FaSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={() => setIsSearchPopupVisible(true)}
        />
      </div>

      <div className="space-x-6 flex items-center">
        <Link
          to="/home"
          className="flex items-center hover:text-gray-300"
          onClick={closeDropdown}
        >
          <FaHome className="text-2xl" />
        </Link>

        <Link
          to="/story/create"
          className="flex items-center hover:text-gray-300"
          onClick={closeDropdown}
        >
          <FaRegEdit className="text-2xl mr-2" /> Write
        </Link>

        {user && (
          <Link
            to={`/profile/${user.username}`}
            className="flex items-center hover:text-gray-300"
          >
            <FaUserCircle className="text-3xl" />
          </Link>
        )}

        <div className="relative dropdown-container">
          <button
            onClick={(event) => toggleDropdown(event)}
            className="flex items-center text-lg hover:text-gray-300 focus:outline-none"
          >
            <FaChevronDown className="text-xl" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg z-50">
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

      {isSearchPopupVisible && (
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
