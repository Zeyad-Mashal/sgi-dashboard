import React from "react";
import "./Trader.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import AllRequest from "../../API/Request/AllRequest";
const Trader = () => {
  useEffect(() => {
    getAllMerchants();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const getAllMerchants = () => {
    AllRequest(setAllRequests, setError, setLoading);
  };
  return (
    <div className="traders">
      <div className="traders_top">
        <input type="text" placeholder="search" />
        <button>
          New Trader <FaPlus />
        </button>
      </div>
      <div className="traders_table">
        <table>
          <thead>
            <tr>
              <th>Trader</th>
              <th>Phone Number</th>
              <th>E-mail</th>
              <th>Tax card</th>
              <th>License</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <div className="loading">
                <p>Loading Traders in progress...</p>
                <span class="loader"></span>
              </div>
            ) : (
              allRequests.map((req) => {
                return (
                  <tr key={req._id}>
                    <td>{req.name}</td>
                    <td>{req.phone}</td>
                    <td>{req.email}</td>
                    <td>222-333-555</td>
                    <td>111-333-444</td>
                    <td className="actions">
                      <RiDeleteBin6Line className="delete_icon" />
                      <RiEditLine className="edit_icon" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trader;
