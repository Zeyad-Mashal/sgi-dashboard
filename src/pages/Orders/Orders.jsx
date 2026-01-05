import React from "react";
import "./Orders.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineCloseCircle } from "react-icons/ai";
import AllOrders from "../../API/Orders/AllOrders";
import GetOrderDetails from "../../API/Orders/GetOrderDetails";
import updateOrderStatus from "../../API/Orders/updateOrderStatus";
import { BsPatchQuestion } from "react-icons/bs";

const Orders = () => {
  const [currentFilter, setCurrentFilter] = useState("New");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  useEffect(() => {
    getAllOrders();
  }, [currentFilter]);
  useEffect(() => {
    if (selectedOrderId) {
      getOrderDetailsApi();
    }
  }, [selectedOrderId]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [showBox, setShowBox] = useState(false);

  const getAllOrders = () => {
    AllOrders(
      setAllOrders,
      setError,
      setLoading,
      currentFilter,
      setCurrentFilter
    );
  };
  const getOrderDetailsApi = () => {
    GetOrderDetails(setOrderDetails, setError, setLoading, selectedOrderId);
  };
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [modalOptions, setModalOptions] = useState([]);
  const openStatusModal = (order) => {
    setOrderToUpdate(order);

    if (order.orderStatus === "New") {
      setModalOptions(["Processing", "Canceled"]);
    } else if (order.orderStatus === "Processing") {
      setModalOptions(["Success", "Canceled"]);
    }

    setShowStatusModal(true);
  };
  const handleUpdateStatus = (newStatus) => {
    updateOrderStatus(
      setError,
      setLoading,
      setShowStatusModal,
      getAllOrders,
      orderToUpdate._id, // ← هنا الـ orderId
      newStatus // ← هنا الـ orderStatus
    );
  };

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
              setCurrentFilter("New");
            }}
            className={currentFilter === "New" ? "active" : ""}
          >
            New
          </p>

          <p
            onClick={() => {
              setCurrentFilter("Success");
            }}
            className={currentFilter === "Success" ? "active" : ""}
          >
            Completed
          </p>

          <p
            onClick={() => {
              setCurrentFilter("Processing");
            }}
            className={currentFilter === "Processing" ? "active" : ""}
          >
            Pending
          </p>

          <p
            onClick={() => {
              setCurrentFilter("Canceled");
            }}
            className={currentFilter === "Canceled" ? "active" : ""}
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
                {loading ? (
                  <div className="loading">
                    <p>Loading Orders in progress...</p>
                    <span className="loader"></span>
                  </div>
                ) : allOrders.length <= 0 ? (
                  <p className="emptyOrder">
                    <BsPatchQuestion />
                    Sorry..No Orders Yet.
                  </p>
                ) : (
                  allOrders.map((item) => {
                    return (
                      <tr
                        onClick={() => {
                          setSelectedOrderId(item._id);
                          setShowBox(true);
                        }}
                        key={item._id}
                      >
                        <td>{item._id}</td>
                        <td>
                          {item.cartItems.map((ci) => (
                            <p key={ci._id}>{ci.sku}</p>
                          ))}
                        </td>
                        <td>{item.userPhone}</td>
                        <td>
                          {item.cartItems.map((ci) => (
                            <p key={ci._id}>{ci.quantity}</p>
                          ))}
                        </td>
                        <td>{item.totalAmount} AED</td>
                        <td
                          className={`status ${item.orderStatus.toLowerCase()}`}
                        >
                          {item.orderStatus}
                        </td>
                        <td className="actions">
                          <RiEditLine
                            className="edit_icon"
                            onClick={(e) => {
                              e.stopPropagation(); // عشان ما يفتحش الـ details box
                              openStatusModal(item);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className={`order_box ${showBox ? "show" : ""}`}>
            <AiOutlineCloseCircle onClick={() => setShowBox(false)} />
            <h2>Order Details</h2>
            <div className="order_cotent">
              <div className="order_title">
                <h3>{orderDetails?.userName}</h3>
                <p>{orderDetails?.userPhone}</p>
              </div>
              <div className="delivery_info">
                <h3>Delivery Information</h3>
                <p>
                  <FiPhone /> {orderDetails?.userPhone}
                </p>
                <p>
                  <IoLocationOutline />
                  {orderDetails?.street}, {orderDetails?.neighborhood},{" "}
                  {orderDetails?.city}
                </p>
              </div>
              <div className="activity_info">
                <h3>Activity</h3>
                <p>
                  Order date -{" "}
                  {new Date(orderDetails?.orderDate).toLocaleString()}
                </p>
              </div>
              <div className="Order_quantity">
                <h3>Order Quantity</h3>
                <div className="order_list">
                  {orderDetails?.cartItems?.map((prod) => (
                    <div className="order_item" key={prod._id}>
                      <img src={prod?.productId?.picUrls[0]} alt="" />
                      <div className="item_details">
                        <h3>{prod.name}</h3>
                        <p>Quantity: {prod.quantity}</p>
                        <span>{prod.price} AED</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="Payment_Way">
                <h3>Payment Way</h3>
                <p>{orderDetails?.paymentWay}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showStatusModal && (
        <div className="status_modal">
          <div className="status_modal_box">
            <h3>Update Order Status</h3>
            <p>Choose the next status for this order:</p>

            {modalOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleUpdateStatus(opt)}
                className="status_btn"
              >
                {loading ? "loading..." : opt}
              </button>
            ))}

            <button
              className="close_btn"
              onClick={() => setShowStatusModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
