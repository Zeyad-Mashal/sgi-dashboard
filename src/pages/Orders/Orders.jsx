import React from "react";
import "./Orders.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import p1d from "../../assets/p1d.jpg";
import { AiOutlineCloseCircle } from "react-icons/ai";

const Orders = () => {
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [showBox, setShowBox] = useState(false);

  return (
    <div className="orders">
      <div className="Orders_top">
        <input type="text" placeholder="search" />
        <button>
          New Order <FaPlus />
        </button>
      </div>
      <div className="order_container">
        <div className="order_filter">
          <p
            onClick={() => {
              setCurrentFilter("all");
            }}
            className={currentFilter === "all" ? "active" : ""}
          >
            All (250)
          </p>

          <p
            onClick={() => {
              setCurrentFilter("completed");
            }}
            className={currentFilter === "completed" ? "active" : ""}
          >
            Completed
          </p>

          <p
            onClick={() => {
              setCurrentFilter("pending");
            }}
            className={currentFilter === "pending" ? "active" : ""}
          >
            Pending
          </p>

          <p
            onClick={() => {
              setCurrentFilter("canceled");
            }}
            className={currentFilter === "canceled" ? "active" : ""}
          >
            Canceled
          </p>
        </div>
        <div className="orders_main">
          <div className="orders_table">
            <table>
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>Shipping Id</th>
                  <th>Phone</th>
                  <th>Order Qn</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr onClick={() => setShowBox(true)}>
                  <td>#CUST001</td>
                  <td>#99-384</td>
                  <td>051234567</td>
                  <td>25</td>
                  <td>1500 AED</td>
                  <td className="status">Complete</td>
                  <td className="actions">
                    <RiDeleteBin6Line className="delete_icon" />
                    <RiEditLine className="edit_icon" />
                  </td>
                </tr>
                <tr onClick={() => setShowBox(true)}>
                  <td>#CUST001</td>
                  <td>#99-384</td>
                  <td>051234567</td>
                  <td>25</td>
                  <td>1500 AED</td>
                  <td className="status">Complete</td>
                  <td className="actions">
                    <RiDeleteBin6Line className="delete_icon" />
                    <RiEditLine className="edit_icon" />
                  </td>
                </tr>
                <tr onClick={() => setShowBox(true)}>
                  <td>#CUST001</td>
                  <td>#99-384</td>
                  <td>051234567</td>
                  <td>25</td>
                  <td>1500 AED</td>
                  <td className="status">Complete</td>
                  <td className="actions">
                    <RiDeleteBin6Line className="delete_icon" />
                    <RiEditLine className="edit_icon" />
                  </td>
                </tr>
                <tr onClick={() => setShowBox(true)}>
                  <td>#CUST001</td>
                  <td>#99-384</td>
                  <td>051234567</td>
                  <td>25</td>
                  <td>1500 AED</td>
                  <td className="status">Complete</td>
                  <td className="actions">
                    <RiDeleteBin6Line className="delete_icon" />
                    <RiEditLine className="edit_icon" />
                  </td>
                </tr>
                <tr onClick={() => setShowBox(true)}>
                  <td>#CUST001</td>
                  <td>#99-384</td>
                  <td>051234567</td>
                  <td>25</td>
                  <td>1500 AED</td>
                  <td className="status">Complete</td>
                  <td className="actions">
                    <RiDeleteBin6Line className="delete_icon" />
                    <RiEditLine className="edit_icon" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`order_box ${showBox ? "show" : ""}`}>
            <AiOutlineCloseCircle onClick={() => setShowBox(false)} />
            <h2>Order Details</h2>
            <div className="order_cotent">
              <div className="order_title">
                <h3>User name</h3>
                <p>contact@techstyle.com</p>
              </div>
              <div className="delivery_info">
                <h3>Delivery Information</h3>
                <p>
                  <FiPhone /> +971 51234567
                </p>
                <p>
                  <IoLocationOutline />
                  1234, Techstyle Avenue, Dubai, UAE
                </p>
              </div>
              <div className="activity_info">
                <h3>Activity</h3>
                <p>Order date - 10:00 AM, 30/11/2025</p>
              </div>
              <div className="Order_quantity">
                <h3>Order Quantity</h3>
                <div className="order_list">
                  <div className="order_item">
                    <img src={p1d} alt="" />
                    <div className="item_details">
                      <h3>Product Name</h3>
                      <p>Quantity: 2</p>
                      <span>1500 AED</span>
                    </div>
                  </div>
                  <div className="order_item">
                    <img src={p1d} alt="" />
                    <div className="item_details">
                      <h3>Product Name</h3>
                      <p>Quantity: 2</p>
                      <span>1500 AED</span>
                    </div>
                  </div>
                  <div className="order_item">
                    <img src={p1d} alt="" />
                    <div className="item_details">
                      <h3>Product Name</h3>
                      <p>Quantity: 2</p>
                      <span>1500 AED</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Payment_Way">
                <h3>Payment Way</h3>
                <p>Cash On Delivey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
