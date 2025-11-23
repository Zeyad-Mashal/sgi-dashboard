import React from "react";
import "./Tiers.css";
import { FaPlus } from "react-icons/fa6";
import { PiTag } from "react-icons/pi";
import { RiEdit2Line } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";

const Tiers = () => {
  return (
    <div className="Tiers">
      <div className="Tiers_top">
        <input type="text" placeholder="search" />
        <button>
          New Tier <FaPlus />
        </button>
      </div>
      <div className="tier_list">
        <div className="tier_item">
          <div className="tire_title">
            <PiTag />
            <h2>Basic</h2>
          </div>
          <div className="tier_btns">
            <button className="delete_btn">
              <RiDeleteBin6Line />
              Delete
            </button>
            <button className="edit_btn">
              <RiEdit2Line />
              Edit
            </button>
          </div>
        </div>
        <div className="tier_item">
          <div className="tire_title">
            <PiTag />
            <h2>Basic</h2>
          </div>
          <div className="tier_btns">
            <button className="delete_btn">
              <RiDeleteBin6Line />
              Delete
            </button>
            <button className="edit_btn">
              <RiEdit2Line />
              Edit
            </button>
          </div>
        </div>
        <div className="tier_item">
          <div className="tire_title">
            <PiTag />
            <h2>Basic</h2>
          </div>
          <div className="tier_btns">
            <button className="delete_btn">
              <RiDeleteBin6Line />
              Delete
            </button>
            <button className="edit_btn">
              <RiEdit2Line />
              Edit
            </button>
          </div>
        </div>
        <div className="tier_item">
          <div className="tire_title">
            <PiTag />
            <h2>Basic</h2>
          </div>
          <div className="tier_btns">
            <button className="delete_btn">
              <RiDeleteBin6Line />
              Delete
            </button>
            <button className="edit_btn">
              <RiEdit2Line />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tiers;
