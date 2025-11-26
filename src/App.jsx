import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { api } from "./api/api";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";

import Home from "./pages/Home";
import GroupPage from "./pages/GroupPage/GroupPage";
import StudentPage from "./pages/studentPage/StudentPage";

const App = () => {
  const [groups, setGroups] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api.get("/groups").then(res => setGroups(res.data));
  }, []);

  return (
    <BrowserRouter>
      <Navbar openSidebar={() => setSidebarOpen(true)} />

      <div className="app-container">
        
        <Sidebar
          groups={groups}
          setGroups={setGroups}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/group/:id" element={<GroupPage />} />
            <Route path="/student/:id" element={<StudentPage />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
};

export default App;
