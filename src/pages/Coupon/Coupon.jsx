import React from "react";
import "./Coupon.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import couponAdd from "../../assets/coupon-add.png";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiCoupon3Line } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiEdit2Line } from "react-icons/ri";
import couponImage from "../../assets/coupon.png";
import CouponApi from "../../API/Coupon/CouponApi";
import AddCoupon from "../../API/Coupon/AddCoupon";
import EditCoupon from "../../API/Coupon/EditCoupon";
import DeleteCouponAPI from "../../API/Coupon/DeleteCouponAPI";
const Coupon = () => {
  useEffect(() => {
    getAllCoupons();
  }, []);
  const [openCouponModal, setOpenCouponModal] = useState(false);
  const [CouponName, setCouponName] = useState("");
  const [CouponPercentage, setCouponPercentage] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [ExpireDate, setExpireDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allCoupons, setAllCoupons] = useState([]);
  const getAllCoupons = () => {
    CouponApi(setAllCoupons, setError, setLoading);
  };

  // Handle Add Coupon
  const handleAddCoupon = () => {
    const data = {
      coupon: CouponName,
      discount: CouponPercentage,
      startingDate: StartDate,
      expiryDate: ExpireDate,
    };
    AddCoupon(data, setError, setLoading, setOpenCouponModal, getAllCoupons);
  };
  // Handle update Coupon
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const handleUpdateCoupon = () => {
    const data = {
      coupon: selectedCoupon.coupon,
      discount: selectedCoupon.discount,
      startingDate: selectedCoupon.startingDate,
      expiryDate: selectedCoupon.expiryDate,
    };

    EditCoupon(
      data,
      setError,
      setLoading,
      setOpenEditModal,
      getAllCoupons,
      selectedCoupon.id
    );
  };

  // Delete Coupon
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteCoupon, setDeleteCoupon] = useState(null);

  return (
    <div className="Coupons">
      <div className="Coupons_top">
        <input type="text" placeholder="search" />
        <button onClick={() => setOpenCouponModal(true)}>
          New Coupon <FaPlus />
        </button>
      </div>
      <div className="coupon_list">
        {loading ? (
          <div className="loading">
            <p>Loading Coupons in progress...</p>
            <span className="loader"></span>
          </div>
        ) : (
          allCoupons.map((item) => {
            return (
              <div className="coupon_item">
                <div className="coupon_item_top">
                  <h2>
                    <img src={couponImage} alt="" />
                    {item.coupon}
                  </h2>
                  <p>{item.discount}% OFF</p>
                </div>
                <div className="coupon_item_bottom">
                  <p>
                    start date : <span>{item.startingDate.split("T")[0]}</span>
                  </p>

                  <p>
                    expire date: <span>{item.expiryDate.split("T")[0]}</span>
                  </p>
                </div>
                <hr />
                <div className="coupon_btns">
                  <button
                    onClick={() => {
                      setDeleteCoupon({
                        id: item._id,
                        coupon: item.coupon,
                      });
                      setOpenDeleteModal(true);
                    }}
                  >
                    <RiDeleteBin6Line />
                    Delete
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCoupon({
                        id: item._id,
                        coupon: item.coupon,
                        discount: item.discount,
                        startingDate: item.startingDate,
                        expiryDate: item.expiryDate,
                      });
                      setOpenEditModal(true);
                    }}
                  >
                    <RiEdit2Line />
                    Edit
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {openCouponModal && (
        <div className="add_Coupon">
          <div
            className="overlay"
            onClick={() => setOpenCouponModal(false)}
          ></div>
          <div className="add_Coupon_container">
            <IoIosCloseCircleOutline
              onClick={() => setOpenCouponModal(false)}
            />
            <div className="add_title">
              <img src={couponAdd} alt="" />
              <div className="add_title_info">
                <h2>Add New Coupon</h2>
                <p>Enter the details of the new Coupon</p>
              </div>
            </div>
            <div className="add_form">
              <label>
                <span>Coupon Name</span>
                <input
                  type="text"
                  placeholder="Zeyad10"
                  value={CouponName}
                  onChange={(e) => setCouponName(e.target.value)}
                />
              </label>
              <label>
                <span>Percentage</span>
                <input
                  type="text"
                  placeholder="10%"
                  value={CouponPercentage}
                  onChange={(e) => setCouponPercentage(e.target.value)}
                />
              </label>
              <label>
                <span>Start Date</span>
                <input
                  type="date"
                  placeholder="1/1/2026"
                  value={StartDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label>
                <span>Expire Date</span>
                <input
                  type="date"
                  placeholder="1/2/2026"
                  value={ExpireDate}
                  onChange={(e) => setExpireDate(e.target.value)}
                />
              </label>
            </div>
            <div className="add_btns">
              <button onClick={() => setOpenCouponModal(false)}>Cancel</button>
              <button onClick={handleAddCoupon}>
                {loading ? "loading..." : "Add Coupon"}
              </button>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
      {openEditModal && selectedCoupon && (
        <div className="add_Coupon">
          <div
            className="overlay"
            onClick={() => setOpenEditModal(false)}
          ></div>

          <div className="add_Coupon_container">
            <IoIosCloseCircleOutline onClick={() => setOpenEditModal(false)} />

            <div className="add_title">
              <img src={couponAdd} alt="" />
              <div className="add_title_info">
                <h2>Edit Coupon</h2>
                <p>Update coupon information</p>
              </div>
            </div>

            <div className="add_form">
              <label>
                <span>Coupon Name</span>
                <input
                  type="text"
                  value={selectedCoupon.coupon}
                  onChange={(e) =>
                    setSelectedCoupon({
                      ...selectedCoupon,
                      coupon: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                <span>Percentage</span>
                <input
                  type="text"
                  value={selectedCoupon.discount}
                  onChange={(e) =>
                    setSelectedCoupon({
                      ...selectedCoupon,
                      discount: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                <span>Start Date</span>
                <input
                  type="date"
                  value={selectedCoupon.startingDate.split("T")[0]}
                  onChange={(e) =>
                    setSelectedCoupon({
                      ...selectedCoupon,
                      startingDate: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                <span>Expire Date</span>
                <input
                  type="date"
                  value={selectedCoupon.expiryDate.split("T")[0]}
                  onChange={(e) =>
                    setSelectedCoupon({
                      ...selectedCoupon,
                      expiryDate: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="add_btns">
              <button onClick={() => setOpenEditModal(false)}>Cancel</button>

              <button onClick={handleUpdateCoupon}>
                {loading ? "loading..." : "Update Coupon"}
              </button>

              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
      {openDeleteModal && deleteCoupon && (
        <div className="add_Coupon">
          <div
            className="overlay"
            onClick={() => setOpenDeleteModal(false)}
          ></div>

          <div className="add_Coupon_container delete_modal">
            <IoIosCloseCircleOutline
              onClick={() => setOpenDeleteModal(false)}
            />

            <div className="add_title">
              <img src={couponAdd} alt="" />
              <div className="add_title_info">
                <h2>Delete Coupon</h2>
                <p>Are you sure you want to delete this coupon?</p>
                <p style={{ color: "red", marginTop: "5px" }}>
                  {deleteCoupon.coupon}
                </p>
              </div>
            </div>

            <div className="add_btns">
              <button onClick={() => setOpenDeleteModal(false)}>Cancel</button>

              <button
                onClick={() => {
                  DeleteCouponAPI(
                    setError,
                    setLoading,
                    setOpenDeleteModal,
                    getAllCoupons,
                    deleteCoupon.id
                  );
                }}
                style={{ backgroundColor: "red", color: "#fff" }}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>

            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupon;
