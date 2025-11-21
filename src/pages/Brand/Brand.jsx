import React from "react";
import "./Brand.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import brandimg from "../../assets/brand1.png";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import AllBrands from "../../API/Brands/AllBrands";
const Brand = () => {
  useEffect(() => {
    getAllBrands();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allBrands, setAllBrands] = useState([]);
  const getAllBrands = () => {
    AllBrands(setAllBrands, setError, setLoading);
  };
  return (
    <div className="brand">
      <div className="brand_top">
        <input type="text" placeholder="search" />
        <button>
          New brand <FaPlus />
        </button>
      </div>
      <div className="brand_list">
        {loading ? (
          <div className="loading">
            <p>Loading Brands in progress...</p>
            <span class="loader"></span>
          </div>
        ) : (
          allBrands.map((item) => {
            return (
              <div className="brand_item">
                <div className="brand_img">
                  <img src={item.logo} alt="brand imgage" />
                </div>
                <div className="brand_item_name">
                  <h2>{item.name.en}</h2>
                  <h2>{item.name.ar}</h2>
                </div>
                <h2>{item.company.name.en}</h2>
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
            );
          })
        )}
      </div>
    </div>
  );
};

export default Brand;
