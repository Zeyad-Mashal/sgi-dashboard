import React from "react";
import "./Users.css";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import p1d from "../../assets/p1d.jpg";
const Users = () => {
  return (
    <div className="Users">
      <div className="Users_top">
        <input type="text" placeholder="search" />
        <button>
          New User <FaPlus />
        </button>
      </div>
      <div className="Users_table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Password</th>
              <th>Transactions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Zeyad Mashaal</td>
              <td>051112222</td>
              <td>example1@gmail.com</td>
              <td>user#admin</td>
              <td>View</td>
              <td className="actions">
                <RiDeleteBin6Line className="delete_icon" />
                <RiEditLine className="edit_icon" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
