import React, { JSX } from "react";
import { Route, BrowserRouter as Router, Routes,Navigate } from "react-router-dom";
import Register from "./pages/register";
import SignIn from "./pages/signIn";
import Landing from "./pages/landing"
import Home from "./pages/home";
import Profile from "./pages/profile";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/signIn" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
