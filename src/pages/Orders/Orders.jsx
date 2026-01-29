import React from "react";
import "./Orders.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { HiDownload } from "react-icons/hi";
import AllOrders from "../../API/Orders/AllOrders";
import GetOrderDetails from "../../API/Orders/GetOrderDetails";
import updateOrderStatus from "../../API/Orders/updateOrderStatus";
import OrderSearch from "../../API/Search/OrderSearch";
import { BsPatchQuestion } from "react-icons/bs";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Export Order Function
  const exportOrder = async () => {
    if (!orderDetails) return;

    try {
      // Prepare data
      const address = [
        orderDetails?.street,
        orderDetails?.neighborhood,
        orderDetails?.city
      ].filter(Boolean).join(", ") || "N/A";

      const orderDate = orderDetails?.orderDate 
        ? new Date(orderDetails.orderDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : "N/A";

      // Create document sections
      const sections = [];

      // Title
      sections.push(
        new Paragraph({
          text: "ORDER DETAILS",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );

      // Customer Information Section
      sections.push(
        new Paragraph({
          text: "CUSTOMER INFORMATION",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Name: ", bold: true }),
            new TextRun({ text: orderDetails?.userName || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Phone: ", bold: true }),
            new TextRun({ text: orderDetails?.userPhone || "N/A" }),
          ],
          spacing: { after: 200 },
        })
      );

      // Delivery Information Section
      sections.push(
        new Paragraph({
          text: "DELIVERY INFORMATION",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Address: ", bold: true }),
            new TextRun({ text: address }),
          ],
          spacing: { after: 200 },
        })
      );

      // Order Information Section
      sections.push(
        new Paragraph({
          text: "ORDER INFORMATION",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Order Date: ", bold: true }),
            new TextRun({ text: orderDate }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Status: ", bold: true }),
            new TextRun({ text: orderDetails?.orderStatus || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Payment Method: ", bold: true }),
            new TextRun({ text: orderDetails?.paymentWay || "N/A" }),
          ],
          spacing: { after: 200 },
        })
      );

      // Order Items Section
      sections.push(
        new Paragraph({
          text: "ORDER ITEMS",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        })
      );

      // Create table for order items
      if (orderDetails?.cartItems && orderDetails.cartItems.length > 0) {
        const tableRows = [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: "Item", bold: true })],
                width: { size: 10, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "Product Name", bold: true })],
                width: { size: 40, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "SKU", bold: true })],
                width: { size: 20, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "Quantity", bold: true })],
                width: { size: 10, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "Price", bold: true })],
                width: { size: 10, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ text: "Subtotal", bold: true })],
                width: { size: 10, type: WidthType.PERCENTAGE },
              }),
            ],
          }),
        ];

        orderDetails.cartItems.forEach((item, index) => {
          const itemTotal = (item?.quantity || 0) * (item?.price || 0);
          tableRows.push(
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: `${index + 1}` })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: item?.name || item?.productId?.name?.en || "N/A" })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: item?.sku || "N/A" })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: `${item?.quantity || 0}` })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: `${item?.price || 0} AED` })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: `${itemTotal} AED` })],
                }),
              ],
            })
          );
        });

        sections.push(
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          })
        );
      } else {
        sections.push(
          new Paragraph({
            text: "No items found",
            spacing: { after: 200 },
          })
        );
      }

      // Total Amount
      sections.push(
        new Paragraph({
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text: "TOTAL AMOUNT: ", 
              bold: true,
              size: 28,
            }),
            new TextRun({ 
              text: `${orderDetails?.totalAmount || 0} AED`,
              bold: true,
              size: 28,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        })
      );

      // Create document
      const doc = new Document({
        sections: [{
          children: sections,
        }],
      });

      // Generate and download
      const blob = await Packer.toBlob(doc);
      
      // Use customer name as filename
      const customerName = (orderDetails?.userName || "Order")
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase()
        .substring(0, 50);
      const dateStr = orderDetails?.orderDate 
        ? new Date(orderDetails.orderDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      
      saveAs(blob, `${customerName}_order_${dateStr}.docx`);
    } catch (error) {
      console.error("Error exporting order:", error);
      setError("Failed to export order. Please try again.");
    }
  };
  
  return (
    <div className="orders">
      <div className="Orders_top">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => {
            const query = e.target.value;
            setSearchQuery(query);
            
            // If input is empty, get all orders with current filter
            if (query.trim() === "") {
              getAllOrders();
            } else {
              // Search as user types
              OrderSearch(setAllOrders, setError, setLoading, encodeURIComponent(query.trim()));
            }
          }}
        />
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
                  <th>Customer Name</th>
                  <th>Phone</th>
                  <th>Items Count</th>
                  <th>Total Price</th>
                  <th>Order Date</th>
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
                    const totalItems = item.cartItems?.reduce((sum, ci) => sum + (ci.quantity || 0), 0) || 0;
                    return (
                      <tr
                        onClick={() => {
                          setSelectedOrderId(item._id);
                          setShowBox(true);
                        }}
                        key={item._id}
                      >
                        <td>{item.userName || "N/A"}</td>
                        <td>{item.userPhone || "N/A"}</td>
                        <td>{totalItems} items</td>
                        <td>{item.totalAmount || 0} AED</td>
                        <td>
                          {item.orderDate 
                            ? new Date(item.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : "N/A"}
                        </td>
                        <td
                          className={`status ${item.orderStatus?.toLowerCase() || ''}`}
                        >
                          {item.orderStatus || "N/A"}
                        </td>
                        <td className="actions">
                          <RiEditLine
                            className="edit_icon"
                            onClick={(e) => {
                              e.stopPropagation();
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
      {/* Order Details Modal */}
      {showBox && (
        <div className="order_details_modal">
          <div className="order_details_overlay" onClick={() => setShowBox(false)}></div>
          <div className="order_details_content">
            <div className="order_details_header">
              <h2>Order Details</h2>
              <div className="header_actions">
                <button 
                  className="export_order_btn"
                  onClick={exportOrder}
                  disabled={loading || !orderDetails}
                  title="Export Order"
                >
                  <HiDownload />
                  Export Order
                </button>
                <AiOutlineCloseCircle 
                  className="close_modal_icon" 
                  onClick={() => setShowBox(false)} 
                />
              </div>
            </div>

            {loading ? (
              <div className="loading">
                <p>Loading order details...</p>
                <span className="loader"></span>
              </div>
            ) : (
              <div className="order_details_body">
                {/* Customer Information */}
                <div className="details_section">
                  <h3 className="section_title">Customer Information</h3>
                  <div className="details_grid">
                    <div className="detail_item">
                      <span className="detail_label">Name:</span>
                      <span className="detail_value">{orderDetails?.userName || "N/A"}</span>
                    </div>
                    <div className="detail_item">
                      <span className="detail_label">Phone:</span>
                      <span className="detail_value">
                        <FiPhone /> {orderDetails?.userPhone || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="details_section">
                  <h3 className="section_title">Delivery Information</h3>
                  <div className="details_grid">
                    <div className="detail_item full_width">
                      <span className="detail_label">Address:</span>
                      <span className="detail_value">
                        <IoLocationOutline />
                        {orderDetails?.street && `${orderDetails.street}, `}
                        {orderDetails?.neighborhood && `${orderDetails.neighborhood}, `}
                        {orderDetails?.city || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Information */}
                <div className="details_section">
                  <h3 className="section_title">Order Information</h3>
                  <div className="details_grid">
                    <div className="detail_item">
                      <span className="detail_label">Order Date:</span>
                      <span className="detail_value">
                        {orderDetails?.orderDate 
                          ? new Date(orderDetails.orderDate).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : "N/A"}
                      </span>
                    </div>
                    <div className="detail_item">
                      <span className="detail_label">Status:</span>
                      <span className={`detail_value status_badge ${orderDetails?.orderStatus?.toLowerCase() || ''}`}>
                        {orderDetails?.orderStatus || "N/A"}
                      </span>
                    </div>
                    <div className="detail_item">
                      <span className="detail_label">Payment Method:</span>
                      <span className="detail_value">{orderDetails?.paymentWay || "N/A"}</span>
                    </div>
                    <div className="detail_item">
                      <span className="detail_label">Total Amount:</span>
                      <span className="detail_value total_amount">{orderDetails?.totalAmount || 0} AED</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="details_section">
                  <h3 className="section_title">
                    Order Items ({orderDetails?.cartItems?.length || 0})
                  </h3>
                  <div className="order_items_list">
                    {orderDetails?.cartItems?.map((prod, index) => (
                      <div className="order_item_card" key={index}>
                        <div className="item_image_container">
                          <img 
                            src={prod?.productId?.picUrls?.[0] || prod?.picUrls?.[0] || "/placeholder.png"} 
                            alt={prod?.name || "Product"} 
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                            }}
                          />
                        </div>
                        <div className="item_info">
                          <h4 className="item_name">{prod?.name || prod?.productId?.name?.en || "Product Name"}</h4>
                          <div className="item_details_row">
                            <span className="item_quantity">Quantity: {prod?.quantity || 0}</span>
                            <span className="item_price">{prod?.price || 0} AED</span>
                          </div>
                          {prod?.sku && (
                            <span className="item_sku">SKU: {prod.sku}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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
