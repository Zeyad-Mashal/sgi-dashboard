import React from "react";
import "./Users.css";
import { FaPlus } from "react-icons/fa";
const Users = () => {
  return (
    <div className="Users">
      <div className="Users_top">
        <input type="text" placeholder="search" />
        <button>
          New User <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default Users;
