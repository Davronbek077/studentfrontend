import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { api } from "./api/api";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";

import Home from "./pages/Home";
import GroupPage from "./pages/groupPage/GroupPage";
import StudentPage from "./pages/studentPage/StudentPage";
import Add from "./components/addStudentForm/AddStudentForm";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [groups, setGroups] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [allowed, setAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const correctPassword = "1153";

  const checkPassword = (e) => {
    e.preventDefault();

    if (password === correctPassword) {
      setAllowed(true);
      toast.success("Xush kelibsiz!");
    } else {
      toast.error("Parol noto‘g‘ri!");
    }
  };

  useEffect(() => {
    api.get("/groups").then((res) => setGroups(res.data));
  }, []);

  if (!allowed) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="password-protect">
          <form onSubmit={checkPassword} className="password-box">
            <h2>Saytga kirish</h2>

            <input
              type="password"
              placeholder="Parolni kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Kirish</button>
          </form>
        </div>
      </>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

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
            <Route path="/" element={<Home groups={groups} />} />

            <Route
              path="/add"
              element={<Add groups={groups} setGroups={setGroups} />}
            />

            <Route path="/group/:id" element={<GroupPage setGroups={setGroups} />} />
            <Route path="/student/:id" element={<StudentPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
