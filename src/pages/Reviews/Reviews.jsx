import React, { useEffect, useState } from "react";
import "./Reviews.css";
import { FaStar, FaRegStar, FaCheck } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbCube } from "react-icons/tb";
import GetReviews from "../../API/Reviews/GetReviews";
import AcceptReview from "../../API/Reviews/AcceptReview";
import RejectReview from "../../API/Reviews/RejectReview";

const Reviews = () => {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Fetch reviews on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    GetReviews(setAllReviews, setError, setLoading);
  };

  // Accept Action
  const handleAcceptReview = async () => {
    if (!selectedReview) return;
    setActionLoading(true);
    setError(null);

    const success = await AcceptReview(setError, setActionLoading, selectedReview._id);
    if (success) {
      setShowAcceptModal(false);
      setSelectedReview(null);
      // Refresh list
      fetchData();
    }
  };

  // Reject Action
  const handleRejectReview = async () => {
    if (!selectedReview) return;
    setActionLoading(true);
    setError(null);

    const success = await RejectReview(setError, setActionLoading, selectedReview._id);
    if (success) {
      setShowRejectModal(false);
      setSelectedReview(null);
      // Refresh list
      fetchData();
    }
  };

  // Helper to render stars
  const renderStars = (rating) => {
    const stars = [];
    const val = rating || 5;
    for (let i = 1; i <= 5; i++) {
      if (i <= val) {
        stars.push(<FaStar key={i} />);
      } else {
        stars.push(<FaRegStar key={i} style={{ color: "#ccc" }} />);
      }
    }
    return <div className="stars_display">{stars}</div>;
  };

  // Helper to format string/object values safely (e.g. translation objects {en, ar})
  const getLocalizedValue = (val) => {
    if (!val) return "";
    if (typeof val === "object") {
      return val.en || val.ar || Object.values(val)[0] || "";
    }
    return String(val);
  };

  // Filter reviews based on search query (product name, user name, or comment)
  const filteredReviews = allReviews.filter((item) => {
    if (!item) return false;
    
    const userName = getLocalizedValue(item.user?.name || item.userName || item.name);
    const productName = getLocalizedValue(item.product?.name || item.product?.nameAr || item.product?.title || item.product);
    const comment = getLocalizedValue(item.review || item.comment);
    
    const query = searchQuery.toLowerCase();
    return (
      userName.toLowerCase().includes(query) ||
      productName.toLowerCase().includes(query) ||
      comment.toLowerCase().includes(query)
    );
  });

  // Calculate statistics
  const totalCount = allReviews.length;
  // If backend returns status or active field
  const acceptedCount = allReviews.filter(r => r.status === "accepted" || r.active === true).length;
  const pendingCount = totalCount - acceptedCount;

  return (
    <div className="Reviews">
      <div className="Reviews_top">
        <input
          type="text"
          placeholder="Search by product, user or review text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="Reviews_stats">
          <div className="stat_card">
            <span>Total Reviews</span>
            <h4>{totalCount}</h4>
          </div>
          <div className="stat_card">
            <span>Accepted</span>
            <h4 style={{ color: "#2ec4b6" }}>{acceptedCount}</h4>
          </div>
          <div className="stat_card">
            <span>Pending</span>
            <h4 style={{ color: "#e63946" }}>{pendingCount}</h4>
          </div>
        </div>
      </div>

      {error && <div className="error_message">{error}</div>}

      <div className="Reviews_table">
        <table style={{ width: "100%", tableLayout: "auto" }}>
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Product</th>
              <th style={{ width: "20%" }}>User</th>
              <th style={{ width: "15%" }}>Rating</th>
              <th style={{ width: "25%" }}>Comment</th>
              <th style={{ width: "15%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">
                  <div className="loading_container">
                    <p>Loading Customer Reviews in progress...</p>
                    <span className="loader"></span>
                  </div>
                </td>
              </tr>
            ) : filteredReviews.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                  No reviews found matching the search criteria.
                </td>
              </tr>
            ) : (
              filteredReviews.map((item) => {
                const userName = getLocalizedValue(item.user?.name || item.userName || item.name || item.postedBy || "N/A");
                const userEmail = getLocalizedValue(item.user?.email || item.email || "");
                
                let productName = "Unknown Product";
                let productImg = null;
                
                if (item.product && typeof item.product === "object") {
                  productName = getLocalizedValue(item.product.name || item.product.nameAr || item.product.title || "Product");
                  productImg = item.product.picUrls?.[0] || item.product.image;
                } else if (item.product) {
                  productName = getLocalizedValue(item.product);
                }

                const ratingValue = item.numberOfStar || item.stars || item.rating || 5;
                const commentText = getLocalizedValue(item.review || item.comment || "No comment");
                const reviewDate = item.createdAt 
                  ? new Date(item.createdAt).toLocaleDateString() 
                  : (item.date ? new Date(item.date).toLocaleDateString() : "N/A");

                // Check active status
                const isAccepted = item.status === "accepted" || item.active === true;


                return (
                  <tr key={item._id || item.id}>
                    <td>
                      <div className="product_col">
                        {productImg ? (
                          <img src={productImg} alt={productName} className="product_thumb" />
                        ) : (
                          <div className="product_thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#eaeaea" }}>
                            <TbCube style={{ fontSize: "1.2rem", color: "#888" }} />
                          </div>
                        )}
                        <div className="product_info">
                          <span className="product_name">{productName}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "600", color: "#333" }}>{userName}</span>
                        {userEmail && <span style={{ fontSize: "0.75rem", color: "#888" }}>{userEmail}</span>}
                      </div>
                    </td>
                    <td>{renderStars(ratingValue)}</td>
                    <td>
                      <div className="review_text">{commentText}</div>
                    </td>
                    <td>
                      <div className="review_actions">
                        {!isAccepted && (
                          <button
                            className="accept_btn"
                            disabled={actionLoading}
                            onClick={() => {
                              setSelectedReview(item);
                              setShowAcceptModal(true);
                            }}
                          >
                            <FaCheck /> Accept
                          </button>
                        )}
                        <button
                          className="reject_btn"
                          disabled={actionLoading}
                          onClick={() => {
                            setSelectedReview(item);
                            setShowRejectModal(true);
                          }}
                        >
                          <RiDeleteBin6Line /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Accept Confirmation Modal */}
      {showAcceptModal && selectedReview && (
        <div className="reviews_modal_overlay">
          <div className="reviews_modal_box">
            <h3>Accept Review</h3>
            <p>
              Are you sure you want to accept this review by <b>{selectedReview.user?.name || selectedReview.userName || selectedReview.name || "User"}</b>?
            </p>
            <div className="reviews_modal_actions">
              <button className="modal_cancel_btn" onClick={() => { setShowAcceptModal(false); setSelectedReview(null); }} disabled={actionLoading}>
                Cancel
              </button>
              <button className="modal_confirm_accept" onClick={handleAcceptReview} disabled={actionLoading}>
                {actionLoading ? "Accepting..." : "Accept"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && selectedReview && (
        <div className="reviews_modal_overlay">
          <div className="reviews_modal_box">
            <h3>Reject & Delete Review</h3>
            <p>
              Are you sure you want to reject and delete this review by <b>{selectedReview.user?.name || selectedReview.userName || selectedReview.name || "User"}</b>? This action cannot be undone.
            </p>
            <div className="reviews_modal_actions">
              <button className="modal_cancel_btn" onClick={() => { setShowRejectModal(false); setSelectedReview(null); }} disabled={actionLoading}>
                Cancel
              </button>
              <button className="modal_confirm_reject" onClick={handleRejectReview} disabled={actionLoading}>
                {actionLoading ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
