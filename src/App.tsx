import React, { JSX } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom"; // ❌ Remove BrowserRouter
import Register from "./pages/register";
import SignIn from "./pages/signIn";
import Landing from "./pages/landing";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Navbar from "./components/Navbar";
import WriteStory from "./pages/writeStory";
import StoryView from "./components/StoryView";
import "./index.css"; 


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/signIn" />;
};

const MainLayout = () => {
  const location = useLocation();
  const hideNavbar = ["/", "/signIn", "/register"].includes(location.pathname); // Hide Navbar on these pages

  return (
    <>
      {!hideNavbar && <Navbar />} {/* Show Navbar only on authenticated pages */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path ="/story/create" element ={<PrivateRoute><WriteStory /></PrivateRoute>} />
        <Route path = "/story/:id" element = {<PrivateRoute><StoryView /></PrivateRoute>}/>
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return <MainLayout />; // ✅ No BrowserRouter here
};

export default App;
