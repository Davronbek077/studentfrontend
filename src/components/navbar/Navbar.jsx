import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = ({ openSidebar }) => {
  return (
    <div className="navbar">
      <div className="menu-icon" onClick={openSidebar}>☰</div>
      <Link to={"/"} className="navbar-title">Students</Link>
    </div>
  );
};

export default Navbar;
