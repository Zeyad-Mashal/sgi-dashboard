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
import { AiOutlineCloseCircle } from "react-icons/ai";
import { HiRefresh } from "react-icons/hi";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import AllRequest from "../../API/Request/AllRequest";
import ApprovedRequests from "../../API/Request/ApprovedRequests";
import PendingRequest from "../../API/Request/PendingRequest";
import RejectedRequest from "../../API/Request/RejectedRequest";
import DownloadPDF from "../../API/PO/DownloadPDF";
import ApproveMerchant from "../../API/Request/ApproveMerchant";
import RejectMerchant from "../../API/Request/RejectMerchant";

const Request = () => {
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [downloadingFile, setDownloadingFile] = useState(null);

  // Approval Modal State
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [merchantToApprove, setMerchantToApprove] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reject Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [merchantToReject, setMerchantToReject] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);

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

  // Generate password with requirements: lowercase, uppercase, number, @, #
  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "@#";
    const allChars = lowercase + uppercase + numbers + special;

    // Ensure at least one of each required character type
    let newPassword = "";
    newPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    newPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    newPassword += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly (total length: 6 characters)
    for (let i = newPassword.length; i < 6; i++) {
      newPassword += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    newPassword = newPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setPassword(newPassword);
  };

  // Open approval modal
  const handleApproveClick = (merchant) => {
    setMerchantToApprove(merchant);
    generatePassword(); // Auto-generate password when modal opens
    setShowApprovalModal(true);
    setShowSuccess(false);
  };

  // Close approval modal
  const closeApprovalModal = () => {
    setShowApprovalModal(false);
    setMerchantToApprove(null);
    setPassword("");
    setShowPassword(false);
    setShowSuccess(false);
  };

  // Open reject modal
  const handleRejectClick = (merchant) => {
    setMerchantToReject(merchant);
    setShowRejectModal(true);
    setShowRejectSuccess(false);
    setError(null);
  };

  // Close reject modal
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setMerchantToReject(null);
    setShowRejectSuccess(false);
  };

  // Handle reject merchant
  const handleRejectMerchant = async () => {
    if (!merchantToReject) return;

    setRejectLoading(true);
    setError(null);

    let hasError = false;

    const setRejectError = (message) => {
      if (message) {
        hasError = true;
        setError(message);
      }
    };

    try {
      await RejectMerchant(
        setRejectError,
        setRejectLoading,
        merchantToReject._id
      );

      // Check if there was an error
      if (!hasError) {
        // Show success message
        setShowRejectSuccess(true);
        setRejectLoading(false);

        // Close modal and refresh after 2.5 seconds
        setTimeout(() => {
          closeRejectModal();
          fetchRequestsByFilter(); // Refresh the list
        }, 2500);
      } else {
        setRejectLoading(false);
      }
    } catch (err) {
      setError("Failed to reject merchant");
      setRejectLoading(false);
    }
  };

  // Handle approve merchant
  const handleApproveMerchant = async () => {
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!merchantToApprove) return;

    setApprovalLoading(true);
    setError(null);

    let hasError = false;

    const setApprovalError = (message) => {
      if (message) {
        hasError = true;
        setError(message);
      }
    };

    try {
      const data = { password: password };
      await ApproveMerchant(
        data,
        setApprovalError,
        setApprovalLoading,
        merchantToApprove._id
      );

      // Check if there was an error
      if (!hasError) {
        // Show success message
        setShowSuccess(true);
        setApprovalLoading(false);

        // Close modal and refresh after 2.5 seconds
        setTimeout(() => {
          closeApprovalModal();
          fetchRequestsByFilter(); // Refresh the list
        }, 2500);
      } else {
        setApprovalLoading(false);
      }
    } catch (err) {
      setError("Failed to approve merchant");
      setApprovalLoading(false);
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
                      <button onClick={() => handleRejectClick(item)}>
                        Reject
                      </button>
                      <button onClick={() => handleApproveClick(item)}>
                        Approve
                      </button>
                    </>
                  )}
                  {item.approval && (
                    <p style={{ color: "green", fontWeight: "bold" }}>
                      Approved
                    </p>
                  )}
                  {item.rejected && (
                    <p style={{ color: "red", fontWeight: "bold" }}>Rejected</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && merchantToApprove && (
        <div className="approval_modal_overlay">
          <div
            className={`approval_modal ${showSuccess ? "success_state" : ""}`}
          >
            <AiOutlineCloseCircle
              className="close_approval_icon"
              onClick={closeApprovalModal}
            />

            {!showSuccess ? (
              <>
                <div className="approval_modal_header">
                  <h2>Approve Merchant</h2>
                  <p>Set a password for {merchantToApprove.name}</p>
                </div>

                <div className="approval_modal_body">
                  <div className="password_input_group">
                    <label htmlFor="merchant_password">Password</label>
                    <div className="password_input_wrapper">
                      <input
                        id="merchant_password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="password_input"
                      />
                      <button
                        type="button"
                        className="toggle_password_btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                    </div>
                  </div>

                  <div className="password_actions">
                    <button
                      type="button"
                      className="generate_password_btn"
                      onClick={generatePassword}
                      disabled={approvalLoading}
                    >
                      <HiRefresh /> Generate New Password
                    </button>
                  </div>

                  {error && (
                    <div className="approval_error_message">{error}</div>
                  )}

                  <div className="password_requirements">
                    <p>Password must contain:</p>
                    <ul>
                      <li className={password.match(/[a-z]/) ? "valid" : ""}>
                        Lowercase letter (a-z)
                      </li>
                      <li className={password.match(/[A-Z]/) ? "valid" : ""}>
                        Uppercase letter (A-Z)
                      </li>
                      <li className={password.match(/[0-9]/) ? "valid" : ""}>
                        Number (0-9)
                      </li>
                      <li className={password.match(/[@#]/) ? "valid" : ""}>
                        Special character (@ or #)
                      </li>
                      <li className={password.length >= 6 ? "valid" : ""}>
                        At least 6 characters
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="approval_modal_footer">
                  <button
                    className="cancel_approval_btn"
                    onClick={closeApprovalModal}
                    disabled={approvalLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="confirm_approval_btn"
                    onClick={handleApproveMerchant}
                    disabled={
                      approvalLoading || !password || password.length < 6
                    }
                  >
                    {approvalLoading ? "Approving..." : "Approve Merchant"}
                  </button>
                </div>
              </>
            ) : (
              <div className="success_animation_container">
                <div className="success_checkmark">
                  <svg
                    className="checkmark_svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="checkmark_circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark_check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                </div>
                <h2 className="success_title">Merchant Approved!</h2>
                <p className="success_message">
                  {merchantToApprove.name} has been successfully approved.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && merchantToReject && (
        <div className="approval_modal_overlay">
          <div
            className={`approval_modal reject_modal ${
              showRejectSuccess ? "success_state" : ""
            }`}
          >
            <AiOutlineCloseCircle
              className="close_approval_icon"
              onClick={closeRejectModal}
            />

            {!showRejectSuccess ? (
              <>
                <div className="approval_modal_header">
                  <h2>Reject Merchant</h2>
                  <p className="warning_text">
                    ⚠️ Warning: You are about to reject {merchantToReject.name}
                  </p>
                </div>

                <div className="reject_warning_box">
                  <p>
                    <strong>
                      Are you sure you want to reject this merchant?
                    </strong>
                  </p>
                  <p>
                    This action will mark the merchant as rejected. This action
                    cannot be undone.
                  </p>
                </div>

                {error && (
                  <div
                    className="approval_error_message"
                    style={{ margin: "0 25px 20px" }}
                  >
                    {error}
                  </div>
                )}

                <div className="approval_modal_footer reject_modal_footer">
                  <button
                    className="cancel_approval_btn"
                    onClick={closeRejectModal}
                    disabled={rejectLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="confirm_reject_btn"
                    onClick={handleRejectMerchant}
                    disabled={rejectLoading}
                  >
                    {rejectLoading ? (
                      <>
                        <span className="reject_btn_loader"></span>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <span className="reject_icon">✕</span>
                        Reject Merchant
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="success_animation_container">
                <div className="success_checkmark reject_checkmark">
                  <svg
                    className="checkmark_svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="checkmark_circle reject_circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark_check reject_check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                </div>
                <h2 className="success_title reject_title">
                  Merchant Rejected!
                </h2>
                <p className="success_message">
                  {merchantToReject.name} has been successfully rejected.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
