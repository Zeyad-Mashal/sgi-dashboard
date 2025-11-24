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
import CompanyApi from "../../API/Company/CompanyApi";
import AddBrand from "../../API/Brands/AddBrand";
import UpdateBrandAPI from "../../API/Brands/UpdateBrandAPI";
import DeleteBrand from "../../API/Brands/DeleteBrand";
const Brand = () => {
  useEffect(() => {
    getAllBrands();
    getAllCompanies();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allBrands, setAllBrands] = useState([]);
  // add brand function
  const [openBrandModal, setOpenBrandModal] = useState(false);
  const [image, setImage] = useState(null);
  const [brandAr, setBrandAr] = useState("");
  const [brandEn, setBrandEn] = useState("");
  const [companyId, setCompanyId] = useState("");
  const fileInputRef = useRef(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file); // <-- file الحقيقي
  };

  const removeImage = () => {
    setImage(null);

    // Reset للانبوت
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleAddBrand = () => {
    if (!brandEn || !brandAr || !image || !companyId) {
      setError("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("enName", brandEn);
    formData.append("arName", brandAr);
    formData.append("image", image);

    AddBrand(
      formData,
      setError,
      setLoading,
      setOpenBrandModal,
      getAllBrands,
      companyId
    );
  };

  // EDIT BRAND
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null); // البيانات القديمة
  const [editImage, setEditImage] = useState(null); // صورة جديدة أو قديمة

  const handleUpdateBrand = (brand, newImage) => {
    const formData = new FormData();
    formData.append("enName", brand.name.en);
    formData.append("arName", brand.name.ar);
    formData.append("companyId", brand.company._id);

    if (newImage) formData.append("image", newImage);

    UpdateBrandAPI(brand._id, formData, setLoading, setError, () => {
      getAllBrands();
      setOpenEditModal(false);
    });
  };

  // delete brand function
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteBrandId, setDeleteBrandId] = useState("");
  const handleDeleteBrand = () => {
    DeleteBrand(
      setError,
      setLoading,
      setOpenDeleteModal,
      getAllBrands,
      deleteBrandId
    );
  };
  // get all brands
  const getAllBrands = () => {
    AllBrands(setAllBrands, setError, setLoading);
  };

  // get all companies
  const [allCompanies, setAllCompanies] = useState([]);
  const getAllCompanies = () => {
    CompanyApi(setAllCompanies, setError, setLoading);
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
              <div className="brand_item" key={item._id}>
                <div className="brand_img">
                  <img src={item.logo} alt="brand imgage" />
                </div>
                <div className="brand_item_name">
                  <h2>{item.name.en}</h2>
                  <h2>{item.name.ar}</h2>
                </div>
                <h2>{item.company.name.en}</h2>
                <div className="brand_btns">
                  <button
                    onClick={() => {
                      setDeleteBrandId(item._id);
                      setOpenDeleteModal(true);
                    }}
                  >
                    <RiDeleteBin6Line />
                    Delete
                  </button>

                  <button
                    onClick={() => {
                      setEditBrand(item);
                      setEditImage(null);
                      setOpenEditModal(true);
                    }}
                  >
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
                  <p className="upload_desc">
                    JPG, JPEG, PNG, WEBP (recommend) less than 200KB
                  </p>
                  <p className="upload_desc">
                    Image width 160px, height 75px : 80px
                  </p>
                </div>
              )}
            </label>

            {/* Preview Image */}
            {image && (
              <div className="preview_container">
                <img src={URL.createObjectURL(image)} className="preview_img" />

                <button className="delete_preview" onClick={removeImage}>
                  ✕
                </button>
              </div>
            )}

            <div className="add_form">
              <label>
                <span>Brand name (EN)</span>
                <input
                  type="text"
                  placeholder="sgi inc..."
                  value={brandEn}
                  onChange={(e) => setBrandEn(e.target.value)}
                />
              </label>
              <label>
                <span>Brand name (عربي)</span>
                <input
                  type="text"
                  placeholder="sgi inc..."
                  value={brandAr}
                  onChange={(e) => setBrandAr(e.target.value)}
                />
              </label>
              <label>
                <span>Company name</span>
                <select
                  value={companyId}
                  onChange={(e) => {
                    setCompanyId(e.target.value);
                    console.log(companyId);
                  }}
                >
                  <option value="">Select Company</option>

                  {allCompanies.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name.en}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="add_btns">
              <button onClick={() => setOpenBrandModal(false)}>Cancel</button>
              <button onClick={handleAddBrand}>
                {loading ? "loading..." : "Add Brand"}
              </button>
            </div>
          </div>
        </div>
      )}
      {openEditModal && editBrand && (
        <div className="add_Brand">
          <div
            className="overlay"
            onClick={() => setOpenEditModal(false)}
          ></div>

          <div className="add_Brand_container">
            <IoIosCloseCircleOutline onClick={() => setOpenEditModal(false)} />

            <div className="add_title">
              <img src={add_brand} alt="" />
              <div className="add_title_info">
                <h2>Edit Brand</h2>
                <p>Edit the details of the selected brand</p>
              </div>
            </div>

            {/* UPLOAD */}
            <label className="upload_box">
              <input
                type="file"
                accept="image/jpeg, image/jpg, image/png"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setEditImage(file);
                }}
              />

              {!editImage && (
                <div className="upload_content">
                  <IoImagesOutline />
                  <p className="upload_click">
                    <span>Click to upload</span> or drag and drop
                  </p>
                  <p className="upload_desc">JPG, JPEG, PNG less than 1MB</p>
                </div>
              )}
            </label>

            {/* PREVIEW */}
            {(editImage || editBrand.logo) && (
              <div className="preview_container">
                <img
                  src={
                    editImage ? URL.createObjectURL(editImage) : editBrand.logo
                  }
                  className="preview_img"
                />
                <button
                  className="delete_preview"
                  onClick={() => setEditImage(null)}
                >
                  ✕
                </button>
              </div>
            )}

            <div className="add_form">
              {/* EN NAME */}
              <label>
                <span>Brand name (EN)</span>
                <input
                  type="text"
                  defaultValue={editBrand.name.en}
                  onChange={(e) =>
                    setEditBrand({
                      ...editBrand,
                      name: {
                        ...editBrand.name,
                        en: e.target.value,
                      },
                    })
                  }
                />
              </label>

              {/* AR NAME */}
              <label>
                <span>Brand name (عربي)</span>
                <input
                  type="text"
                  defaultValue={editBrand.name.ar}
                  onChange={(e) =>
                    setEditBrand({
                      ...editBrand,
                      name: {
                        ...editBrand.name,
                        ar: e.target.value,
                      },
                    })
                  }
                />
              </label>

              {/* COMPANY */}
              <label>
                <span>Company name</span>
                <select
                  value={editBrand.company._id}
                  onChange={(e) =>
                    setEditBrand({
                      ...editBrand,
                      company: { ...editBrand.company, _id: e.target.value },
                    })
                  }
                >
                  {allCompanies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name.en}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* BUTTONS */}
            <div className="add_btns">
              <button onClick={() => setOpenEditModal(false)}>Cancel</button>
              <button onClick={() => handleUpdateBrand(editBrand, editImage)}>
                {loading ? "loading..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
      {openDeleteModal && (
        <div className="add_Brand">
          <div
            className="overlay"
            onClick={() => setOpenDeleteModal(false)}
          ></div>

          <div className="delete_modal">
            <h2>Are you sure you want to delete this brand?</h2>

            <div className="delete_btns">
              <button onClick={() => setOpenDeleteModal(false)}>Cancel</button>

              <button className="delete_confirm" onClick={handleDeleteBrand}>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brand;
