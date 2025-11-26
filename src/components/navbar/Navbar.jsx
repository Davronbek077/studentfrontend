import React from "react";
import "./Navbar.css";

const Navbar = ({ openSidebar }) => {
  return (
    <div className="navbar">
      <div className="menu-icon" onClick={openSidebar}>☰</div>
      <h1 className="navbar-title">Students</h1>
    </div>
  );
};

export default Navbar;
