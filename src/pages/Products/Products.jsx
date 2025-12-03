import React from "react";
import "./Products.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import p1d from "../../assets/p1d.jpg";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { GrPowerCycle } from "react-icons/gr";
import { IoReturnUpBack } from "react-icons/io5";
import PriceTier from "../../API/PriceTier/PriceTier";
import CompanyApi from "../../API/Company/CompanyApi";
import AllBrands from "../../API/Brands/AllBrands";
import CategoriesApi from "../../API/Categories/CategoriesApi";
import AddProduct from "../../API/Products/AddProduct";

const Products = () => {
  useEffect(() => {
    getAllTier();
    getAllCompanies();
    getAllBrands();
    getAllCategories();
  }, []);

  const [showTable, setShowTable] = useState(true);
  const [AddProductModel, setAddProductModel] = useState(false);

  // IMAGES (FILES)
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const handleMainUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file); // FILE
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages((prev) => [...prev, ...files]); // FILES
  };

  const removeGalleryImage = (img) => {
    setGalleryImages(galleryImages.filter((i) => i !== img));
  };

  // API DATA
  const [allTiers, setAllTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllTier = () => {
    PriceTier(setAllTiers, setError, setLoading);
  };

  const [allCompanies, setAllCompanies] = useState([]);
  const getAllCompanies = () => {
    CompanyApi(setAllCompanies, setError, setLoading);
  };

  const [allBrands, setAllBrands] = useState([]);
  const getAllBrands = () => {
    AllBrands(setAllBrands, setError, setLoading);
  };

  const [allCategories, setAllCategories] = useState([]);
  const getAllCategories = () => {
    CategoriesApi(setAllCategories, setError, setLoading);
  };

  // INPUTS
  const [arName, setArName] = useState("");
  const [enName, setEnName] = useState("");
  const [enDescription, setEnDescription] = useState("");
  const [arDescription, setArDescription] = useState("");
  const [defaultPrice, setdefaultPrice] = useState("");
  const [code, setcode] = useState("");
  const [arUses, setArUses] = useState("");
  const [enUses, setEnUses] = useState("");
  const [arFeatures, setArFeatures] = useState("");
  const [enFeatures, setEnFeatures] = useState("");
  const [company, setcompany] = useState("");

  // MULTIPLE CATEGORIES
  const [categories, setcategories] = useState([]);

  const handleCategorySelect = (e) => {
    const selected = [...e.target.selectedOptions].map((o) => o.value);
    setcategories(selected);
  };

  const [brand, setBrand] = useState("");

  const [tierPrices, settierPrices] = useState([]);

  const [selectedTier, setSelectedTier] = useState("");
  const [tierPriceValue, setTierPriceValue] = useState("");

  const addTierPrice = () => {
    if (!selectedTier || !tierPriceValue) return;

    settierPrices((prev) => [
      ...prev,
      { tier: selectedTier, price: Number(tierPriceValue) },
    ]);

    setSelectedTier("");
    setTierPriceValue("");
  };

  const [stockQ, setStockQ] = useState("");
  const [stockStatus, setStockStatus] = useState("");

  // SUBMIT PRODUCT
  const handleAddProduct = () => {
    const data = new FormData();

    // BASIC INFO
    data.append("enName", enName);
    data.append("arName", arName);
    data.append("enDescription", enDescription);
    data.append("arDescription", arDescription);
    data.append("defaultPrice", defaultPrice);
    data.append("code", code);

    // USES
    data.append("arUses", arUses);
    data.append("enUses", enUses);

    // FEATURES
    data.append("arFeatures", arFeatures);
    data.append("enFeatures", enFeatures);

    // COMPANY / BRAND
    data.append("company", company);
    data.append("brand", brand);

    // STOCK
    data.append("stockQuantity", stockQ);
    data.append("stockStatus", stockStatus);

    // MULTIPLE CATEGORIES
    categories.forEach((catId, i) => {
      data.append(`categories[${i}]`, catId);
    });

    // PRICE SEGMENTS (POSTMAN STYLE)
    tierPrices.forEach((tp, index) => {
      data.append(`tierPrices[${index}][tier]`, tp.tier);
      data.append(`tierPrices[${index}][price]`, tp.price);
    });

    // IMAGES
    if (mainImage) {
      data.append("image", mainImage);
    }

    galleryImages.forEach((file) => {
      data.append("image", file);
    });

    // SEND TO API
    AddProduct(data, setError, setLoading, setShowTable, setAddProductModel);
  };

  return (
    <div className="products">
      {showTable && (
        <>
          <div className="products_top">
            <input type="text" placeholder="search" />
            <button
              onClick={() => {
                setAddProductModel(true);
                setShowTable(false);
              }}
            >
              New Product <FaPlus />
            </button>
          </div>

          <div className="products_table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Barcode Number</th>
                  <th>Brand</th>
                  <th>Company</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="product_image">
                    <img src={p1d} alt="" />
                  </td>
                  <td>Product name</td>
                  <td>022-6638999</td>
                  <td>CLEENNOL</td>
                  <td>SGI</td>
                  <td>1500 AED</td>
                  <td className="actions">
                    <RiDeleteBin6Line className="delete_icon" />
                    <RiEditLine className="edit_icon" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {AddProductModel && (
        <>
          <div className="products_top">
            <button
              onClick={() => {
                setShowTable(true);
                setAddProductModel(false);
              }}
              className="returnToProducts"
            >
              <IoReturnUpBack />
              Back To Products
            </button>
          </div>

          <div className="add_product_container">
            {/* LEFT SIDE */}
            <div className="add_product_left">
              <h1>Basic Details</h1>

              <div className="add_product_left_inputs">
                <label>
                  <span>Product Name (EN)</span>
                  <input
                    type="text"
                    placeholder="Creystal Brite"
                    value={enName}
                    onChange={(e) => setEnName(e.target.value)}
                  />
                </label>

                <label>
                  <span>Product Name (Ar)</span>
                  <input
                    type="text"
                    placeholder="اسم المنتج"
                    value={arName}
                    onChange={(e) => setArName(e.target.value)}
                  />
                </label>
              </div>

              <div className="add_product_left_inputs">
                <label>
                  <span>Product Description (EN)</span>
                  <textarea
                    value={enDescription}
                    onChange={(e) => setEnDescription(e.target.value)}
                  ></textarea>
                </label>
              </div>

              <div className="add_product_left_inputs">
                <label>
                  <span>Product Description (Ar)</span>
                  <textarea
                    value={arDescription}
                    onChange={(e) => setArDescription(e.target.value)}
                  ></textarea>
                </label>
              </div>

              <div className="add_product_left_inputs">
                <label>
                  <span>Product Uses (En)</span>
                  <textarea
                    value={enUses}
                    onChange={(e) => setEnUses(e.target.value)}
                  ></textarea>
                </label>

                <label>
                  <span>Product Uses (Ar)</span>
                  <textarea
                    value={arUses}
                    onChange={(e) => setArUses(e.target.value)}
                  ></textarea>
                </label>
              </div>

              {/* PRICING */}
              <div className="add_product_left_pricing">
                <h2>Pricing</h2>

                <div className="add_product_left_pricing_inputs">
                  <label>
                    <span>Default Product Price</span>
                    <input
                      type="text"
                      placeholder="100 AED"
                      value={defaultPrice}
                      onChange={(e) => setdefaultPrice(e.target.value)}
                    />
                  </label>

                  <label>
                    <span>Discounted Price (Optional)</span>
                    <input type="text" placeholder="89 AED" />
                  </label>
                </div>

                {/* TIER SECTION */}
                <div className="add_product_left_pricing_inputs">
                  <div className="tier_section">
                    <h3>Price Segments</h3>

                    <div className="tier_inputs_row">
                      <div className="input_group">
                        <label>Select Tier</label>

                        <select
                          value={selectedTier}
                          onChange={(e) => setSelectedTier(e.target.value)}
                        >
                          <option value="">Choose Tier</option>
                          {allTiers.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="input_group">
                        <label>Tier Price (AED)</label>

                        <input
                          type="number"
                          placeholder="250"
                          value={tierPriceValue}
                          onChange={(e) => setTierPriceValue(e.target.value)}
                        />
                      </div>

                      <button className="add_tier_btn" onClick={addTierPrice}>
                        + Add Tier
                      </button>
                    </div>

                    {/* LIST */}
                    <div className="tier_list">
                      {tierPrices.map((item, index) => (
                        <div className="tier_card" key={index}>
                          <div className="tier_info">
                            <h4>
                              {allTiers.find((t) => t._id === item.tier)?.name}
                            </h4>
                            <p>{item.price} AED</p>
                          </div>

                          <IoIosCloseCircleOutline
                            className="tier_remove"
                            onClick={() =>
                              settierPrices(
                                tierPrices.filter((_, i) => i !== index)
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* INVENTORY */}
              <div className="add_product_left_inventory">
                <h2>Inventory</h2>

                <div className="add_product_left_inventory_inputs">
                  <label>
                    <span>Stock Quantity</span>

                    <input
                      type="text"
                      placeholder="1000"
                      value={stockQ}
                      onChange={(e) => setStockQ(e.target.value)}
                    />
                  </label>

                  <label>
                    <span>Stock Status</span>

                    <select
                      value={stockStatus}
                      onChange={(e) => setStockStatus(e.target.value)}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="product_btns">
                <button onClick={handleAddProduct}>
                  {loading ? "Publishing ..." : "Publish Product"}
                </button>
                {error}
              </div>
            </div>

            {/* ================= RIGHT SIDE ===================== */}
            <div className="add_product_right">
              <h1>Upload Product Image</h1>

              {/* MAIN IMAGE */}
              <div className="main_upload_box">
                {mainImage ? (
                  <>
                    <img
                      className="mainImage"
                      src={URL.createObjectURL(mainImage)}
                      alt="main"
                    />
                    <div className="image_actions">
                      <label className="replace_btn">
                        <h3>
                          <GrPowerCycle />
                          Replace
                        </h3>

                        <input type="file" onChange={handleMainUpload} hidden />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="upload_area">
                    <span>Browse</span>
                    <input type="file" onChange={handleMainUpload} hidden />
                  </label>
                )}
              </div>

              {/* GALLERY */}
              <div className="gallery_container">
                {galleryImages.map((img, index) => (
                  <div className="gallery_item" key={index}>
                    <img src={URL.createObjectURL(img)} alt="gallery" />

                    <IoIosCloseCircleOutline
                      className="delete_icon"
                      onClick={() => removeGalleryImage(img)}
                    />

                    <button
                      className="set_main_btn"
                      onClick={() => setMainImage(img)}
                    >
                      Set as Main
                    </button>
                  </div>
                ))}

                <label className="add_img_box">
                  +
                  <input
                    type="file"
                    multiple
                    onChange={handleGalleryUpload}
                    hidden
                  />
                </label>
              </div>

              <div className="add_product_right_inputs">
                <label>
                  <span>Product Features (En)</span>
                  <textarea
                    value={enFeatures}
                    onChange={(e) => setEnFeatures(e.target.value)}
                  ></textarea>
                </label>

                <label>
                  <span>Product Features (Ar)</span>
                  <textarea
                    value={arFeatures}
                    onChange={(e) => setArFeatures(e.target.value)}
                  ></textarea>
                </label>
              </div>
              <div className="add_product_right_inputs">
                <label>
                  <span>Product Categories</span>

                  <div className="categories_checkbox_list">
                    {allCategories.map((cat) => (
                      <label key={cat._id} className="category_checkbox_item">
                        <input
                          type="checkbox"
                          value={cat._id}
                          checked={categories.includes(cat._id)}
                          onChange={(e) => {
                            const value = e.target.value;

                            if (categories.includes(value)) {
                              // remove it
                              setcategories(
                                categories.filter((c) => c !== value)
                              );
                            } else {
                              // add it
                              setcategories([...categories, value]);
                            }
                          }}
                        />
                        {cat.name.en}
                      </label>
                    ))}
                  </div>
                </label>
              </div>

              <div className="add_product_right_inputs">
                <label>
                  <span>Product Company</span>
                  <select
                    value={company}
                    onChange={(e) => setcompany(e.target.value)}
                  >
                    {allCompanies.map((com) => (
                      <option value={com._id}>{com.name.en}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="add_product_right_inputs">
                <label>
                  <span>Product Brand</span>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  >
                    {allBrands.map((brand) => (
                      <option value={brand._id}>{brand.name.en}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="add_ToFeature_section">
                <label>
                  <input type="checkbox" />
                  <span>Highlight this product in a featured section.</span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
