import React from "react";
import "./TopNav.css";
import ava from "../../../assets/ava.jpg";
const TopNav = () => {
  return (
    <div className="topnav">
      <div className="topnav_container">
        <h1>Dashboard</h1>
        <div className="topnav_content">
          <input type="text" placeholder="search" />
          <div className="avatar">
            <img src={ava} alt="profile pic" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
