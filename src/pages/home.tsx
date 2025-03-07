import React from "react";
import Navbar from "../components/Navbar";

const Home: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold">Welcome to MyApp</h1>
      </div>
    </div>
  );
};

export default Home;
