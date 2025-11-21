import React from "react";
import "./Request.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import img from "../../assets/company.jpg";
import { MdOutlineDateRange } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { IoDocumentsOutline } from "react-icons/io5";
import AllRequest from "../../API/Request/AllRequest";

const Request = () => {
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  if (currentFilter === "all") {
    useEffect(() => {
      AllRequest(setAllRequests, setError, setLoading, currentFilter);
    }, [currentFilter]);
  } else if (currentFilter === "approved") {
    useEffect(() => {
      AllRequest(setAllRequests, setError, setLoading, currentFilter);
    }, [currentFilter]);
  } else if (currentFilter === "pending") {
    useEffect(() => {
      AllRequest(setAllRequests, setError, setLoading, currentFilter);
    }, [currentFilter]);
  } else {
    useEffect(() => {
      AllRequest(setAllRequests, setError, setLoading, currentFilter);
    }, [currentFilter]);
  }

  return (
    <div className="Request">
      <div className="Request_top">
        <input type="text" placeholder="search" />
        <button>
          New Merchant <FaPlus />
        </button>
      </div>

      <div className="resquest_container">
        <div className="request_filter">
          <p
            onClick={() => setCurrentFilter("all")}
            className={currentFilter === "all" ? "active" : ""}
          >
            All
          </p>

          <p
            onClick={() => setCurrentFilter("approved")}
            className={currentFilter === "approved" ? "active" : ""}
          >
            Approved
          </p>

          <p
            onClick={() => setCurrentFilter("pending")}
            className={currentFilter === "pending" ? "active" : ""}
          >
            Pending
          </p>

          <p
            onClick={() => setCurrentFilter("rejected")}
            className={currentFilter === "rejected" ? "active" : ""}
          >
            Rejected
          </p>
        </div>

        <div className="request_list">
          {loading ? (
            <div className="loading">
              <p>Loading Request in progress...</p>
              <span class="loader"></span>
            </div>
          ) : error ? (
            <p>{error}</p>
          ) : (
            allRequests.map((item) => (
              <div className="request_item" key={item._id}>
                <div className="request_item_top">
                  <img src={img} alt="merchant image" />
                  <div className="item_title">
                    <h2>{item.name}</h2>
                    <p>
                      <MdOutlineDateRange />
                      15-11-2026
                    </p>
                  </div>
                </div>
                <p>
                  <FiPhone />
                  {item.phone}
                </p>
                <p>
                  <HiOutlineMail />
                  {item.email}
                </p>
                <p>
                  <IoDocumentsOutline />
                  Tax-{item.taxcard}
                </p>
                <p>
                  <IoDocumentsOutline />
                  License-2024-00123
                </p>
                <div className="request_item_btns">
                  <button>Reject</button>
                  <button>Approve</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Request;
