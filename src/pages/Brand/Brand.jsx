import React from "react";
import "./Brand.css";
import { FaPlus } from "react-icons/fa6";
import brandimg from "../../assets/brand1.png";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";

const Brand = () => {
  return (
    <div className="brand">
      <div className="brand_top">
        <input type="text" placeholder="search" />
        <button>
          New brand <FaPlus />
        </button>
      </div>
      <div className="brand_list">
        <div className="brand_item">
          <div className="brand_img">
            <img src={brandimg} alt="brand imgage" />
          </div>
          <h2>Cleenol</h2>
          <h2>كلينول</h2>
          <div className="brand_btns">
            <button>
              <RiDeleteBin6Line />
              Delete
            </button>
            <button>
              <RiEditLine />
              Edit
            </button>
          </div>
        </div>
        <div className="brand_item">
          <div className="brand_img">
            <img src={brandimg} alt="brand imgage" />
          </div>
          <h2>Cleenol</h2>
          <h2>كلينول</h2>
          <div className="brand_btns">
            <button>
              <RiDeleteBin6Line />
              Delete
            </button>
            <button>
              <RiEditLine />
              Edit
            </button>
          </div>
        </div>
        <div className="brand_item">
          <div className="brand_img">
            <img src={brandimg} alt="brand imgage" />
          </div>
          <h2>Cleenol</h2>
          <h2>كلينول</h2>
          <div className="brand_btns">
            <button>
              <RiDeleteBin6Line />
              Delete
            </button>
            <button>
              <RiEditLine />
              Edit
            </button>
          </div>
        </div>
        <div className="brand_item">
          <div className="brand_img">
            <img src={brandimg} alt="brand imgage" />
          </div>
          <h2>Cleenol</h2>
          <h2>كلينول</h2>
          <div className="brand_btns">
            <button>
              <RiDeleteBin6Line />
              Delete
            </button>
            <button>
              <RiEditLine />
              Edit
            </button>
          </div>
        </div>
        <div className="brand_item">
          <div className="brand_img">
            <img src={brandimg} alt="brand imgage" />
          </div>
          <h2>Cleenol</h2>
          <h2>كلينول</h2>
          <div className="brand_btns">
            <button>
              <RiDeleteBin6Line />
              Delete
            </button>
            <button>
              <RiEditLine />
              Edit
            </button>
          </div>
        </div>
        <div className="brand_item">
          <div className="brand_img">
            <img src={brandimg} alt="brand imgage" />
          </div>
          <h2>Cleenol</h2>
          <h2>كلينول</h2>
          <div className="brand_btns">
            <button>
              <RiDeleteBin6Line />
              Delete
            </button>
            <button>
              <RiEditLine />
              Edit
            </button>
          </div>
        </div>
        <div className="brand_item">
          <div className="brand_img">
            <img src={brandimg} alt="brand imgage" />
          </div>
          <h2>Cleenol</h2>
          <h2>كلينول</h2>
          <div className="brand_btns">
            <button>
              <RiDeleteBin6Line />
              Delete
            </button>
            <button>
              <RiEditLine />
              Edit
            </button>
          </div>
        </div>
        <div className="brand_item">
          <div className="brand_img">
            <img src={brandimg} alt="brand imgage" />
          </div>
          <h2>Cleenol</h2>
          <h2>كلينول</h2>
          <div className="brand_btns">
            <button>
              <RiDeleteBin6Line />
              Delete
            </button>
            <button>
              <RiEditLine />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brand;
