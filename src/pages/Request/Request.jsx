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
import AddToTier from "../../API/Request/AddToTier";
import PriceTier from "../../API/PriceTier/PriceTier";
import AddTier from "../../API/PriceTier/AddTier";

const Request = () => {
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [downloadingFile, setDownloadingFile] = useState(null);

  // Price Tiers State
  const [allTiers, setAllTiers] = useState([]);
  const [tiersLoading, setTiersLoading] = useState(false);

  // Approval Modal State
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [merchantToApprove, setMerchantToApprove] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState("");
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEditTier, setShowEditTier] = useState(false);
  const [tierUpdateLoading, setTierUpdateLoading] = useState(false);

  // Reject Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [merchantToReject, setMerchantToReject] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);

  // Edit Tier Modal State (for approved merchants)
  const [showEditTierModal, setShowEditTierModal] = useState(false);
  const [merchantToEditTier, setMerchantToEditTier] = useState(null);
  const [editTierSelectedId, setEditTierSelectedId] = useState("");
  const [editTierLoading, setEditTierLoading] = useState(false);

  // Add New Tier Modal State
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [newTierName, setNewTierName] = useState("");
  const [addTierLoading, setAddTierLoading] = useState(false);

  // Fetch requests when filter changes
  useEffect(() => {
    fetchRequestsByFilter();
  }, [currentFilter]);

  // Fetch all price tiers on component mount
  useEffect(() => {
    getAllTiers();
  }, []);

  const getAllTiers = () => {
    PriceTier(setAllTiers, setError, setTiersLoading);
  };

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
    setSelectedTierId(merchant.priceTier || ""); // Set existing tier if available
    setShowApprovalModal(true);
    setShowSuccess(false);
    setShowEditTier(false);
    getAllTiers(); // Refresh tiers list
  };

  // Close approval modal
  const closeApprovalModal = () => {
    setShowApprovalModal(false);
    setMerchantToApprove(null);
    setPassword("");
    setShowPassword(false);
    setSelectedTierId("");
    setShowSuccess(false);
    setShowEditTier(false);
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
        // If tier is selected, add merchant to tier
        if (selectedTierId) {
          await handleAddToTier(merchantToApprove._id, selectedTierId);
        }

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

  // Handle add merchant to tier
  const handleAddToTier = async (merchantId, tierId) => {
    if (!merchantId || !tierId) return;

    setTierUpdateLoading(true);
    let hasError = false;

    const setTierError = (message) => {
      if (message) {
        hasError = true;
        setError(message);
      }
    };

    try {
      await AddToTier(setTierError, setTierUpdateLoading, merchantId, tierId);
    } catch (err) {
      setError("Failed to add merchant to price tier");
      hasError = true;
    } finally {
      setTierUpdateLoading(false);
    }
  };

  // Handle update price tier for approved merchant
  const handleUpdateTier = async () => {
    if (!selectedTierId || !merchantToApprove) {
      setError("Please select a price tier");
      return;
    }

    setTierUpdateLoading(true);
    setError(null);

    let hasError = false;

    const setTierError = (message) => {
      if (message) {
        hasError = true;
        setError(message);
      }
    };

    try {
      await AddToTier(
        setTierError,
        setTierUpdateLoading,
        merchantToApprove._id,
        selectedTierId
      );

      if (!hasError) {
        setShowEditTier(false);
        setShowSuccess(true);
        fetchRequestsByFilter(); // Refresh the list

        // Close modal after 2 seconds
        setTimeout(() => {
          closeApprovalModal();
        }, 2000);
      } else {
        setTierUpdateLoading(false);
      }
    } catch (err) {
      setError("Failed to update price tier");
      setTierUpdateLoading(false);
    }
  };

  // Open edit tier modal for approved merchant
  const handleEditTierClick = (merchant) => {
    setMerchantToEditTier(merchant);
    setEditTierSelectedId(merchant.priceTier || "");
    setShowEditTierModal(true);
    setError(null);
    getAllTiers();
  };

  // Close edit tier modal
  const closeEditTierModal = () => {
    setShowEditTierModal(false);
    setMerchantToEditTier(null);
    setEditTierSelectedId("");
  };

  // Handle update tier for approved merchant (from approved section)
  const handleUpdateMerchantTier = async () => {
    if (!merchantToEditTier) return;

    if (!editTierSelectedId) {
      setError(
        "Please select a tier or use 'Remove Tier' to remove the current tier"
      );
      return;
    }

    setEditTierLoading(true);
    setError(null);

    let hasError = false;

    const setTierError = (message) => {
      if (message) {
        hasError = true;
        setError(message);
      }
    };

    try {
      await AddToTier(
        setTierError,
        setEditTierLoading,
        merchantToEditTier._id,
        editTierSelectedId
      );

      if (!hasError) {
        closeEditTierModal();
        fetchRequestsByFilter(); // Refresh the list
      } else {
        setEditTierLoading(false);
      }
    } catch (err) {
      setError("Failed to update price tier");
      setEditTierLoading(false);
    }
  };

  // Handle remove tier (set to null)
  const handleRemoveTier = async () => {
    if (!merchantToEditTier) return;

    if (
      !window.confirm(
        "Are you sure you want to remove the price tier from this merchant?"
      )
    ) {
      return;
    }

    setEditTierLoading(true);
    setError(null);

    // Set selected tier to empty to represent "no tier"
    setEditTierSelectedId("");

    // Note: The API might need to support null/empty tierId
    // If it doesn't work, we may need a different endpoint
    let hasError = false;

    const setTierError = (message) => {
      if (message && !message.includes("null")) {
        // Ignore errors about null if API doesn't support it
        hasError = true;
        setError(message);
      }
    };

    try {
      // Try with "null" as string first, then empty string
      await AddToTier(
        setTierError,
        setEditTierLoading,
        merchantToEditTier._id,
        "null" // Try "null" as string
      );

      if (!hasError) {
        closeEditTierModal();
        fetchRequestsByFilter();
      } else {
        // If "null" doesn't work, try empty string
        try {
          await AddToTier(
            setTierError,
            setEditTierLoading,
            merchantToEditTier._id,
            "" // Try empty string
          );
          if (!hasError) {
            closeEditTierModal();
            fetchRequestsByFilter();
          } else {
            setEditTierLoading(false);
            setError(
              "API may not support removing tier. Please contact support."
            );
          }
        } catch (err) {
          setError(
            "Failed to remove price tier. API may not support this operation."
          );
          setEditTierLoading(false);
        }
      }
    } catch (err) {
      setError("Failed to remove price tier");
      setEditTierLoading(false);
    }
  };

  // Handle add new tier
  const handleAddNewTier = async () => {
    if (!newTierName.trim()) {
      setError("Please enter a tier name");
      return;
    }

    setAddTierLoading(true);
    setError(null);

    const data = {
      name: newTierName.trim(),
    };

    let hasError = false;
    let newTierId = null;

    const setTierError = (message) => {
      if (message) {
        hasError = true;
        setError(message);
      }
    };

    const closeModal = () => {
      setShowAddTierModal(false);
    };

    try {
      // AddTier API will refresh tiers list automatically
      await AddTier(
        data,
        setTierError,
        setAddTierLoading,
        closeModal,
        getAllTiers
      );

      if (!hasError) {
        setNewTierName("");
        // Refresh tiers and auto-select the newly created tier if in edit mode
        getAllTiers();
        // If we're in edit tier modal, we might want to auto-select the new tier
        // But we don't have the new tier ID, so we'll just refresh the list
      } else {
        setAddTierLoading(false);
      }
    } catch (err) {
      setError("Failed to add new tier");
      setAddTierLoading(false);
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
                    <>
                      <p style={{ color: "green", fontWeight: "bold" }}>
                        Approved
                      </p>
                      <button
                        className="edit_tier_btn_small"
                        onClick={() => handleEditTierClick(item)}
                      >
                        Edit Tier
                      </button>
                    </>
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

                  {/* Price Tier Selection */}
                  <div className="tier_selection_group">
                    <label htmlFor="price_tier_select">
                      Price Tier (Optional)
                    </label>
                    <select
                      id="price_tier_select"
                      value={selectedTierId}
                      onChange={(e) => setSelectedTierId(e.target.value)}
                      className="tier_select"
                      disabled={approvalLoading || tiersLoading}
                    >
                      <option value="">Select a price tier</option>
                      {allTiers.map((tier) => (
                        <option key={tier._id} value={tier._id}>
                          {tier.name}
                        </option>
                      ))}
                    </select>
                    {tiersLoading && (
                      <p className="tier_loading_text">Loading tiers...</p>
                    )}
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
            ) : showEditTier ? (
              <>
                <div className="approval_modal_header">
                  <h2>Update Price Tier</h2>
                  <p>Update price tier for {merchantToApprove.name}</p>
                </div>

                <div className="approval_modal_body">
                  <div className="tier_selection_group">
                    <label htmlFor="edit_price_tier_select">Price Tier</label>
                    <select
                      id="edit_price_tier_select"
                      value={selectedTierId}
                      onChange={(e) => setSelectedTierId(e.target.value)}
                      className="tier_select"
                      disabled={tierUpdateLoading || tiersLoading}
                    >
                      <option value="">Select a price tier</option>
                      {allTiers.map((tier) => (
                        <option key={tier._id} value={tier._id}>
                          {tier.name}
                        </option>
                      ))}
                    </select>
                    {tiersLoading && (
                      <p className="tier_loading_text">Loading tiers...</p>
                    )}
                  </div>

                  {error && (
                    <div className="approval_error_message">{error}</div>
                  )}
                </div>

                <div className="approval_modal_footer">
                  <button
                    className="cancel_approval_btn"
                    onClick={() => {
                      setShowEditTier(false);
                      setError(null);
                    }}
                    disabled={tierUpdateLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="confirm_approval_btn"
                    onClick={handleUpdateTier}
                    disabled={tierUpdateLoading || !selectedTierId}
                  >
                    {tierUpdateLoading ? "Updating..." : "Update Tier"}
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
                <button
                  className="edit_tier_btn"
                  onClick={() => {
                    setShowEditTier(true);
                    setShowSuccess(false);
                    setSelectedTierId(merchantToApprove.priceTier || "");
                    getAllTiers();
                  }}
                >
                  Edit Price Tier
                </button>
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

      {/* Edit Tier Modal for Approved Merchants */}
      {showEditTierModal && merchantToEditTier && (
        <div className="approval_modal_overlay">
          <div className="approval_modal">
            <AiOutlineCloseCircle
              className="close_approval_icon"
              onClick={closeEditTierModal}
            />

            <div className="approval_modal_header">
              <h2>Edit Price Tier</h2>
              <p>Update price tier for {merchantToEditTier.name}</p>
            </div>

            <div className="approval_modal_body">
              <div className="tier_selection_group">
                <label htmlFor="edit_merchant_tier_select">Price Tier</label>
                <div className="tier_select_wrapper">
                  <select
                    id="edit_merchant_tier_select"
                    value={editTierSelectedId}
                    onChange={(e) => setEditTierSelectedId(e.target.value)}
                    className="tier_select"
                    disabled={editTierLoading || tiersLoading}
                  >
                    <option value="">No Tier (None)</option>
                    {allTiers.map((tier) => (
                      <option key={tier._id} value={tier._id}>
                        {tier.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="add_tier_btn_small"
                    onClick={() => {
                      setShowAddTierModal(true);
                    }}
                    disabled={editTierLoading}
                  >
                    <FaPlus /> New Tier
                  </button>
                </div>
                {tiersLoading && (
                  <p className="tier_loading_text">Loading tiers...</p>
                )}
              </div>

              {error && <div className="approval_error_message">{error}</div>}
            </div>

            <div className="approval_modal_footer">
              <button
                className="cancel_approval_btn"
                onClick={closeEditTierModal}
                disabled={editTierLoading}
              >
                Cancel
              </button>
              <button
                className="remove_tier_btn"
                onClick={handleRemoveTier}
                disabled={editTierLoading || !editTierSelectedId}
              >
                Remove Tier
              </button>
              <button
                className="confirm_approval_btn"
                onClick={handleUpdateMerchantTier}
                disabled={editTierLoading || !editTierSelectedId}
              >
                {editTierLoading ? "Updating..." : "Update Tier"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Tier Modal */}
      {showAddTierModal && (
        <div className="approval_modal_overlay">
          <div className="approval_modal">
            <AiOutlineCloseCircle
              className="close_approval_icon"
              onClick={() => {
                setShowAddTierModal(false);
                setNewTierName("");
                setError(null);
              }}
            />

            <div className="approval_modal_header">
              <h2>Add New Price Tier</h2>
              <p>Create a new price tier</p>
            </div>

            <div className="approval_modal_body">
              <div className="password_input_group">
                <label htmlFor="new_tier_name">Tier Name</label>
                <input
                  id="new_tier_name"
                  type="text"
                  value={newTierName}
                  onChange={(e) => setNewTierName(e.target.value)}
                  placeholder="Enter tier name"
                  className="password_input"
                  disabled={addTierLoading}
                />
              </div>

              {error && <div className="approval_error_message">{error}</div>}
            </div>

            <div className="approval_modal_footer">
              <button
                className="cancel_approval_btn"
                onClick={() => {
                  setShowAddTierModal(false);
                  setNewTierName("");
                  setError(null);
                }}
                disabled={addTierLoading}
              >
                Cancel
              </button>
              <button
                className="confirm_approval_btn"
                onClick={handleAddNewTier}
                disabled={addTierLoading || !newTierName.trim()}
              >
                {addTierLoading ? "Adding..." : "Add Tier"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
