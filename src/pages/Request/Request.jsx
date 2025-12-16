import React from "react";
import "./Request.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import img from "../../assets/company.jpg";
import { MdOutlineDateRange } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { IoDocumentsOutline } from "react-icons/io5";
import { MdDownload } from "react-icons/md";
import AllRequest from "../../API/Request/AllRequest";
import ApprovedRequests from "../../API/Request/ApprovedRequests";
import PendingRequest from "../../API/Request/PendingRequest";
import RejectedRequest from "../../API/Request/RejectedRequest";
import DownloadPDF from "../../API/PO/DownloadPDF";

const Request = () => {
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [downloadingFile, setDownloadingFile] = useState(null);

  // Fetch requests when filter changes
  useEffect(() => {
    fetchRequestsByFilter();
  }, [currentFilter]);

  const fetchRequestsByFilter = () => {
    setLoading(true);
    setAllRequests([]);
    
    switch (currentFilter) {
      case "all":
        AllRequest(setAllRequests, setError, setLoading);
        break;
      case "approved":
        ApprovedRequests(setAllRequests, setError, setLoading);
        break;
      case "pending":
        PendingRequest(setAllRequests, setError, setLoading);
        break;
      case "rejected":
        RejectedRequest(setAllRequests, setError, setLoading);
        break;
      default:
        AllRequest(setAllRequests, setError, setLoading);
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    if (!fileId) {
      setError("File ID not available");
      return;
    }

    setDownloadingFile(fileId);
    let blobUrl = null;
    try {
      const fileUrl = await DownloadPDF(setError, setLoading, fileId);
      if (fileUrl) {
        blobUrl = fileUrl;
        // Create a temporary link and trigger download
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName || "document.pdf";
        
        // If it's a blob URL, we need to handle it differently
        if (fileUrl.startsWith("blob:")) {
          link.target = "_blank";
        } else if (fileUrl.startsWith("http") || fileUrl.startsWith("https")) {
          // Direct URL - open in new tab
          link.target = "_blank";
        }
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up blob URL after a short delay to allow download to start
        if (fileUrl.startsWith("blob:")) {
          setTimeout(() => {
            window.URL.revokeObjectURL(fileUrl);
          }, 100);
        }
      }
    } catch (error) {
      setError("Failed to download file");
      console.error("Download error:", error);
      // Clean up blob URL on error
      if (blobUrl && blobUrl.startsWith("blob:")) {
        window.URL.revokeObjectURL(blobUrl);
      }
    } finally {
      setDownloadingFile(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

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
              <span className="loader"></span>
            </div>
          ) : error ? (
            <p>{error}</p>
          ) : (
            allRequests.map((item) => (
              <div className="request_item" key={item._id}>
                <div className="request_item_top">
                  <img src={img} alt="merchant image" />
                  <div className="item_title">
                    <h2>{item.name || "N/A"}</h2>
                    <p>
                      <MdOutlineDateRange />
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
                
                {item.account_id && (
                  <p>
                    <strong>Account ID:</strong> {item.account_id}
                  </p>
                )}
                
                <p>
                  <FiPhone />
                  {item.phone || "N/A"}
                </p>
                <p>
                  <HiOutlineMail />
                  {item.email || "N/A"}
                </p>

                {item.taxRegistration && (
                  <p>
                    <IoDocumentsOutline />
                    Tax Registration: {item.taxRegistration}
                  </p>
                )}

                {item.taxNumber && (
                  <p>
                    <IoDocumentsOutline />
                    Tax Number: {item.taxNumber}
                  </p>
                )}

                {item.taxCard && (
                  <p>
                    <IoDocumentsOutline />
                    Tax Card: {item.taxCard}
                  </p>
                )}

                {item.expiryDate && (
                  <p>
                    <strong>Expiry Date:</strong> {item.expiryDate}
                  </p>
                )}

                {/* Price Tier - if available */}
                {item.priceTier && (
                  <p>
                    <strong>Price Tier:</strong> {item.priceTier}
                  </p>
                )}

                {/* VAT Registration File */}
                {item.vatRegistrationId && (
                  <div className="file_download_item">
                    <IoDocumentsOutline />
                    <span>VAT Registration</span>
                    <button
                      className="download_btn"
                      onClick={() =>
                        handleDownloadFile(
                          item.vatRegistrationId,
                          `VAT_Registration_${item.name || item._id}.pdf`
                        )
                      }
                      disabled={downloadingFile === item.vatRegistrationId}
                    >
                      {downloadingFile === item.vatRegistrationId ? (
                        "Downloading..."
                      ) : (
                        <>
                          <MdDownload /> Download
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Commercial License File */}
                {item.commercialLicenseId && (
                  <div className="file_download_item">
                    <IoDocumentsOutline />
                    <span>Commercial License</span>
                    <button
                      className="download_btn"
                      onClick={() =>
                        handleDownloadFile(
                          item.commercialLicenseId,
                          `Commercial_License_${item.name || item._id}.pdf`
                        )
                      }
                      disabled={downloadingFile === item.commercialLicenseId}
                    >
                      {downloadingFile === item.commercialLicenseId ? (
                        "Downloading..."
                      ) : (
                        <>
                          <MdDownload /> Download
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="request_item_btns">
                  {!item.approval && !item.rejected && (
                    <>
                      <button>Reject</button>
                      <button>Approve</button>
                    </>
                  )}
                  {item.approval && (
                    <p style={{ color: "green", fontWeight: "bold" }}>
                      Approved
                    </p>
                  )}
                  {item.rejected && (
                    <p style={{ color: "red", fontWeight: "bold" }}>
                      Rejected
                    </p>
                  )}
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
