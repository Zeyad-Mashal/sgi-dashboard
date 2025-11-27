import React from "react";
import "./Coupon.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import couponAdd from "../../assets/coupon-add.png";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiCoupon3Line } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiEdit2Line } from "react-icons/ri";
import couponImage from "../../assets/coupon.png";
const Coupon = () => {
  const [openCouponModal, setOpenCouponModal] = useState(false);
  const [CouponName, setCouponName] = useState("");
  const [CouponPercentage, setCouponPercentage] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [ExpireDate, setExpireDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="Coupons">
      <div className="Coupons_top">
        <input type="text" placeholder="search" />
        <button onClick={() => setOpenCouponModal(true)}>
          New Coupon <FaPlus />
        </button>
      </div>
      <div className="coupon_list">
        <div className="coupon_item">
          <div className="coupon_item_top">
            <h2>
              <img src={couponImage} alt="" />
              Coupon Name
            </h2>
            <p>15% OFF</p>
          </div>
          <div className="coupon_item_bottom">
            <p>
              start date : <span>30/12/2025</span>
            </p>
            <p>
              expire date: <span>30/1/2026</span>
            </p>
          </div>
          <hr />
          <div className="coupon_btns">
            <button>
              <RiDeleteBin6Line />
              Delete
            </button>
            <button>
              <RiEdit2Line />
              Edit
            </button>
          </div>
        </div>
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
              <button>{loading ? "loading..." : "Add Coupon"}</button>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupon;
