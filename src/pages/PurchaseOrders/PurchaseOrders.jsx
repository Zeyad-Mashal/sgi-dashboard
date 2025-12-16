import React from "react";
import "./PurchaseOrders.css";
import { useState, useRef, useEffect } from "react";
import { FiPhone } from "react-icons/fi";
import { MdOutlineMailOutline, MdOutlineLocationOn } from "react-icons/md";
import { IoImageOutline } from "react-icons/io5";
import { AiOutlineCloseCircle } from "react-icons/ai";
import po1 from "../../assets/po.webp";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import GetPO from "../../API/PO/GetPO";

const PurchaseOrders = () => {
  const [currentFilter, setCurrentFilter] = useState("New");
  const [allPO, setAllPO] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ====== NEW: State for Preview Modal ======
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const pdfRef = useRef(null);

  // ====== State for Status Update Modal ======
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [statusAction, setStatusAction] = useState(null); // "reject", "approve", "complete"

  // Fetch purchase orders when component mounts or filter changes
  useEffect(() => {
    GetPO(setAllPO, setError, setLoading, currentFilter);
  }, [currentFilter]);

  // Function to refresh purchase orders
  const refreshPurchaseOrders = () => {
    GetPO(setAllPO, setError, setLoading, currentFilter);
  };

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    const URL = `https://sgi-dy1p.onrender.com/api/v1/order/status?orderId=${orderId}&status=${newStatus}`;
    setLoading(true);
    const token = localStorage.getItem("SGI_TOKEN");

    try {
      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-is-dashboard": true,
          authorization: `sgiQ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setShowStatusModal(false);
        setLoading(false);
        setOrderToUpdate(null);
        setStatusAction(null);
        refreshPurchaseOrders();
      } else {
        if (response.status == 400) {
          setError(result.message);
          setLoading(false);
        } else if (response.status == 403) {
          setError(result.message);
          setLoading(false);
        } else {
          setError(result.message);
          setLoading(false);
        }
      }
    } catch (error) {
      setError("An error occurred");
      setLoading(false);
    }
  };

  // Handle status actions
  const handleReject = (order) => {
    setOrderToUpdate(order);
    setStatusAction("reject");
    setShowStatusModal(true);
  };

  const handleApprove = (order) => {
    setOrderToUpdate(order);
    setStatusAction("approve");
    setShowStatusModal(true);
  };

  const handleComplete = (order) => {
    setOrderToUpdate(order);
    setStatusAction("complete");
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = () => {
    if (!orderToUpdate) return;

    let newStatus;
    if (statusAction === "reject") {
      newStatus = "Canceled";
    } else if (statusAction === "approve") {
      newStatus = "Processing";
    } else if (statusAction === "complete") {
      newStatus = "Success";
    }

    if (newStatus) {
      updateOrderStatus(orderToUpdate._id, newStatus);
    }
  };

  const openPreview = (order) => {
    // Map API data to preview format
    const previewOrder = {
      name: order.user?.name || order.userName || "N/A",
      phone: order.userPhone || "N/A",
      email: "N/A", // Email not available in API response
      address:
        order.city && order.address
          ? `${order.address}, ${order.city}`
          : order.address || order.city || "N/A",
      file: {
        url: order.orderImg || po1,
        type:
          order.orderImg && order.orderImg.includes("http") ? "image" : "image",
        size: "N/A",
      },
      orderId: order.order_id || "N/A",
      totalAmount: order.totalAmount || 0,
      paymentWay: order.paymentWay || "N/A",
      orderDate: order.orderDate || "N/A",
    };
    setPreviewData(previewOrder);
    setShowPreview(true);
  };

  const generatePDF = async () => {
    const element = pdfRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    pdf.save("purchase-order.pdf");
  };

  return (
    <div className="po">
      <div className="po_container">
        <div className="po_filter">
          <p
            onClick={() => setCurrentFilter("New")}
            className={currentFilter === "New" ? "active" : ""}
          >
            New
          </p>

          <p
            onClick={() => setCurrentFilter("Success")}
            className={currentFilter === "Success" ? "active" : ""}
          >
            Completed
          </p>

          <p
            onClick={() => setCurrentFilter("Processing")}
            className={currentFilter === "Processing" ? "active" : ""}
          >
            Pending
          </p>

          <p
            onClick={() => setCurrentFilter("Canceled")}
            className={currentFilter === "Canceled" ? "active" : ""}
          >
            Canceled
          </p>
        </div>
        <div className="po_list">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>Error: {error}</p>
          ) : allPO && allPO.length > 0 ? (
            allPO.map((order, index) => (
              <div key={order._id || order.id || index} className="po_item">
                <h1>{order.user?.name || order.userName || "N/A"}</h1>

                <div className="po_item_info">
                  <p>
                    <FiPhone /> {order.userPhone || "N/A"}
                  </p>
                  <p>
                    <strong>Order ID:</strong> {order.order_id || "N/A"}
                  </p>
                </div>

                <p>
                  <MdOutlineLocationOn />{" "}
                  {order.city && order.address
                    ? `${order.address}, ${order.city}`
                    : order.address || order.city || "N/A"}
                </p>

                <div className="po_file">
                  <p
                    onClick={() => openPreview(order)}
                    style={{ cursor: "pointer" }}
                  >
                    <IoImageOutline />
                    {order.orderImg
                      ? order.orderImg.split("/").pop() || "upload po.png"
                      : "upload po.png"}
                    <span>Preview</span>
                  </p>
                  <span>${order.totalAmount?.toFixed(2) || "0.00"}</span>
                </div>

                <div className="po_btns">
                  {order.orderStatus === "New" && (
                    <>
                      <button onClick={() => handleReject(order)}>
                        Reject
                      </button>
                      <button onClick={() => handleApprove(order)}>
                        Approve
                      </button>
                    </>
                  )}
                  {order.orderStatus === "Processing" && (
                    <button onClick={() => handleComplete(order)}>
                      Complete
                    </button>
                  )}
                  {order.orderStatus === "Success" && (
                    <p style={{ color: "green", fontWeight: "bold" }}>
                      Completed
                    </p>
                  )}
                  {order.orderStatus === "Canceled" && (
                    <p style={{ color: "red", fontWeight: "bold" }}>Canceled</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No purchase orders found</p>
          )}
        </div>

        {/* ===================== PREVIEW MODAL ===================== */}
        {showPreview && previewData && (
          <div className="preview_modal">
            <div className="preview_box" ref={pdfRef}>
              <h2>Purchase Order Preview</h2>

              <div className="preview_info">
                <p>
                  <strong>Merchant:</strong> {previewData.name}
                </p>
                <p>
                  <strong>Phone:</strong> {previewData.phone}
                </p>
                <p>
                  <strong>Address:</strong> {previewData.address}
                </p>
                <p>
                  <strong>Order ID:</strong> {previewData.orderId}
                </p>
                <p>
                  <strong>Total Amount:</strong> $
                  {previewData.totalAmount?.toFixed(2) || "0.00"}
                </p>
                <p>
                  <strong>Payment Method:</strong> {previewData.paymentWay}
                </p>
                {previewData.orderDate && (
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(previewData.orderDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="preview_file">
                {previewData.file.type === "image" ? (
                  <img
                    src={previewData.file.url}
                    alt="po"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "10px",
                      marginTop: "15px",
                    }}
                  />
                ) : (
                  <a
                    href={previewData.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file_link"
                  >
                    Open File
                  </a>
                )}
              </div>

              <div className="preview_actions">
                <button
                  className="close_btn"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </button>
                {/* 
                <button className="download_btn" onClick={generatePDF}>
                  Download PDF
                </button> */}
              </div>
            </div>
          </div>
        )}
        {/* ========================================================= */}

        {/* ===================== STATUS UPDATE MODAL ===================== */}
        {showStatusModal && orderToUpdate && (
          <div className="status_modal">
            <div className="status_modal_box">
              <AiOutlineCloseCircle
                className="close_status_icon"
                onClick={() => {
                  setShowStatusModal(false);
                  setOrderToUpdate(null);
                  setStatusAction(null);
                }}
              />
              <h3>Update Purchase Order Status</h3>

              {/* Workflow Steps */}
              <div className="workflow_steps">
                <div
                  className={`workflow_step ${
                    orderToUpdate.orderStatus === "New" ? "active" : ""
                  } ${orderToUpdate.orderStatus !== "New" ? "completed" : ""}`}
                >
                  <div className="step_number">1</div>
                  <div className="step_content">
                    <h4>New</h4>
                    <p>Order received</p>
                  </div>
                </div>

                <div className="workflow_arrow">→</div>

                <div
                  className={`workflow_step ${
                    orderToUpdate.orderStatus === "Processing" ? "active" : ""
                  } ${
                    orderToUpdate.orderStatus === "Success" ? "completed" : ""
                  }`}
                >
                  <div className="step_number">2</div>
                  <div className="step_content">
                    <h4>Processing</h4>
                    <p>Order approved</p>
                  </div>
                </div>

                <div className="workflow_arrow">→</div>

                <div
                  className={`workflow_step ${
                    orderToUpdate.orderStatus === "Success" ? "active" : ""
                  }`}
                >
                  <div className="step_number">3</div>
                  <div className="step_content">
                    <h4>Success</h4>
                    <p>Order completed</p>
                  </div>
                </div>
              </div>

              {/* Action Confirmation */}
              <div className="status_action_info">
                {statusAction === "reject" && (
                  <p>
                    Are you sure you want to <strong>reject</strong> this
                    purchase order? This will change the status to{" "}
                    <strong>Canceled</strong>.
                  </p>
                )}
                {statusAction === "approve" && (
                  <p>
                    Are you sure you want to <strong>approve</strong> this
                    purchase order? This will change the status to{" "}
                    <strong>Processing</strong>.
                  </p>
                )}
                {statusAction === "complete" && (
                  <p>
                    Are you sure you want to <strong>complete</strong> this
                    purchase order? This will change the status to{" "}
                    <strong>Success</strong>.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="status_modal_actions">
                <button
                  className="cancel_status_btn"
                  onClick={() => {
                    setShowStatusModal(false);
                    setOrderToUpdate(null);
                    setStatusAction(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="confirm_status_btn"
                  onClick={confirmStatusUpdate}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* ========================================================= */}
      </div>
    </div>
  );
};

export default PurchaseOrders;
