import React, { JSX } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import StoryEdit from "./components/StoryEdit";
import StoryView from "./components/StoryView";
import "./index.css";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import Unauthorized from "./pages/Unauthorized";
import WriteStory from "./pages/WriteStory";

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
        <Route path="/stories" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/stories/:id" element={<StoryView />} />
        <Route
          path="/story/create"
          element={
            <PrivateRoute>
              <WriteStory />
            </PrivateRoute>
          }
        />
        <Route
          path="/stories/:id/edit"
          element={
            <PrivateRoute>
              <StoryEdit />
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return <MainLayout />;
};

export default App;
