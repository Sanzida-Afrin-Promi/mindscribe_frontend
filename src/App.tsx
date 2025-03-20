import React, { JSX } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom"; 
import Register from "./pages/register";
import SignIn from "./pages/signIn";
import Landing from "./pages/landing";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Navbar from "./components/Navbar";
import WriteStory from "./pages/writeStory";
import StoryView from "./components/StoryView";
import StoryEdit from "./components/StoryEdit";
import NotFound from "./pages/notFound"; // Import NotFound Page
import "./index.css"; 
import Unauthorized from "./pages/unauthorized";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/signIn" />;
};

const MainLayout = () => {
  const location = useLocation();
  const hideNavbar = ["/", "/signIn", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/profile/:username" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/story/create" element={<PrivateRoute><WriteStory /></PrivateRoute>} />
        <Route path="/story/:id" element={<PrivateRoute><StoryView /></PrivateRoute>} />
        <Route path="/story/edit/:id" element={<PrivateRoute><StoryEdit /></PrivateRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        
        {/* Catch-all route for 404 pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return <MainLayout />;
};

export default App;
