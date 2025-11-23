import React from "react";
import "./Brand.css";
import { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import brandimg from "../../assets/brand1.png";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import AllBrands from "../../API/Brands/AllBrands";
import add_brand from "../../assets/add_brand.png";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoImagesOutline } from "react-icons/io5";

const Brand = () => {
  useEffect(() => {
    getAllBrands();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allBrands, setAllBrands] = useState([]);
  // add brand function
  const [openBrandModal, setOpenBrandModal] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    // لو فيه صورة مرفوعة بالفعل — امنع إضافة تاني
    if (image) return;

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  const removeImage = () => {
    setImage(null);

    // Reset للانبوت
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  // get all brands
  const getAllBrands = () => {
    AllBrands(setAllBrands, setError, setLoading);
  };
  return (
    <div className="brand">
      <div className="brand_top">
        <input type="text" placeholder="search" />
        <button onClick={() => setOpenBrandModal(true)}>
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
      {openBrandModal && (
        <div className="add_Brand">
          <div
            className="overlay"
            onClick={() => setOpenBrandModal(false)}
          ></div>
          <div className="add_Brand_container">
            <IoIosCloseCircleOutline onClick={() => setOpenBrandModal(false)} />
            <div className="add_title">
              <img src={add_brand} alt="" />
              <div className="add_title_info">
                <h2>Add New Brand</h2>
                <p>Enter the details of the new Brand</p>
              </div>
            </div>
            <label className="upload_box">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleImageUpload}
              />

              {!image && (
                <div className="upload_content">
                  <IoImagesOutline />

                  <p className="upload_click">
                    <span>Click to upload</span> or drag and drop
                  </p>
                  <p className="upload_desc">JPG, JPEG, PNG less than 1MB</p>
                </div>
              )}
            </label>

            {/* Preview Image */}
            {image && (
              <div className="preview_container">
                <img src={image} alt="preview" className="preview_img" />

                <button className="delete_preview" onClick={removeImage}>
                  ✕
                </button>
              </div>
            )}

            <div className="add_form">
              <label>
                <span>Brand name (EN)</span>
                <input type="text" placeholder="sgi inc..." />
              </label>
              <label>
                <span>Brand name (عربي)</span>
                <input type="text" placeholder="sgi inc..." />
              </label>
              <label>
                <span>Company name</span>
                <select>
                  <option value="SGI Company">SGI Company</option>
                  <option value="SGI Company">SGI Company</option>
                  <option value="SGI Company">SGI Company</option>
                  <option value="SGI Company">SGI Company</option>
                </select>
              </label>
            </div>
            <div className="add_btns">
              <button onClick={() => setOpenBrandModal(false)}>Cancel</button>
              <button>Add Brand</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brand;
