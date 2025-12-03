import React, { useEffect, useState } from "react";
import "./Users.css";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import GetUsers from "../../API/Users/GetUsers";
import AddUser from "../../API/Users/AddUser";
import UpdateUser from "../../API/Users/UpdateUser";
import DeleteUser from "../../API/Users/DeleteUser";
const Users = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // ------ ADD USER MODAL ------
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // ------ EDIT MODAL ------
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState({
    account_id: "",
    name: "",
    email: "",
    phone: "",
    _id: "",
  });

  // ------ DELETE MODAL ------
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState({
    account_id: "",
    name: "",
    _id: "",
  });

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    GetUsers(setAllUsers, setError, setLoading);
  };

  // ------------ ADD USER -------------
  const handleAddUser = () => {
    const data = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      password: newUser.password,
    };
    AddUser(data, setError, setLoading, setShowModal, getAllUsers);
    setNewUser({ name: "", email: "", phone: "", password: "" });
  };

  // ------------ OPEN EDIT MODAL -------------
  const openEditModal = (user) => {
    setEditUser({
      account_id: user.account_id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      _id: user._id,
    });
    setShowEditModal(true);
  };

  // ------------ HANDLE UPDATE -------------
  const handleUpdateUser = () => {
    const data = {
      account_id: editUser.account_id,
      name: editUser.name,
      email: editUser.email,
      phone: editUser.phone,
    };

    // لو دخل باسورد → ابعته
    if (editUser.password && editUser.password.trim() !== "") {
      data.password = editUser.password;
    }

    UpdateUser(
      data,
      setError,
      setLoading,
      setShowEditModal,
      getAllUsers,
      editUser._id
    );

    // بعد التعديل نظّف خانة الباسورد
    setEditUser({ ...editUser, password: "" });
  };

  // ------------ OPEN DELETE MODAL -------------
  const openDeleteModal = (user) => {
    setDeleteUser({
      account_id: user.account_id,
      name: user.name,
      _id: user._id,
    });
    setShowDeleteModal(true);
  };

  // ------------ HANDLE DELETE -------------
  const handleDeleteUser = () => {
    DeleteUser(
      setError,
      setLoading,
      setShowDeleteModal,
      getAllUsers,
      deleteUser._id
    );
  };

  return (
    <div className="Users">
      <div className="Users_top">
        <input type="text" placeholder="search" />
        <button onClick={() => setShowModal(true)}>
          New User <FaPlus />
        </button>
      </div>

      <div className="Users_table">
        <table>
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Transactions</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <div className="loading">
                <p>Loading Employees in progress...</p>
                <span className="loader"></span>
              </div>
            ) : (
              allUsers.map((item) => {
                return (
                  <tr key={item.account_id}>
                    <td>{item.account_id}</td>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>View</td>

                    <td className="actions">
                      <RiDeleteBin6Line
                        className="delete_icon"
                        onClick={() => openDeleteModal(item)}
                      />
                      <RiEditLine
                        className="edit_icon"
                        onClick={() => openEditModal(item)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ------------ ADD USER MODAL ------------ */}
      {showModal && (
        <div className="modal_overlay">
          <div className="modal_box">
            <h3>Add New User</h3>

            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />

            <div className="modal_actions">
              <button className="close_btn" onClick={() => setShowModal(false)}>
                Close
              </button>
              <button className="add_btn" onClick={handleAddUser}>
                {loading ? "Adding ..." : "Add User"}
              </button>
            </div>

            {error}
          </div>
        </div>
      )}

      {/* ------------ EDIT USER MODAL ------------ */}
      {showEditModal && (
        <div className="modal_overlay">
          <div className="modal_box">
            <h3>Edit User</h3>

            <input
              type="text"
              placeholder="Name"
              value={editUser.name}
              onChange={(e) =>
                setEditUser({ ...editUser, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={editUser.phone}
              onChange={(e) =>
                setEditUser({ ...editUser, phone: e.target.value })
              }
            />

            {/* ====== PASSWORD FIELD (Always Empty) ====== */}
            <input
              type="password"
              placeholder="New Password (optional)"
              value={editUser.password || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, password: e.target.value })
              }
            />

            <div className="modal_actions">
              <button
                className="close_btn"
                onClick={() => setShowEditModal(false)}
              >
                Close
              </button>

              <button className="add_btn" onClick={handleUpdateUser}>
                {loading ? "Updating ..." : "Save Changes"}
              </button>
            </div>

            {error}
          </div>
        </div>
      )}

      {/* ------------ DELETE USER MODAL ------------ */}
      {showDeleteModal && (
        <div className="modal_overlay">
          <div className="modal_box">
            <h3>Delete User</h3>
            <p>
              Are you sure you want to delete: <b>{deleteUser.name}</b>?
            </p>

            <div className="modal_actions">
              <button
                className="close_btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="delete_btn" onClick={handleDeleteUser}>
                {loading ? "Deleting ..." : "Delete"}
              </button>
            </div>

            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
