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
import GetAllCategories from "../../API/Categories/GetAllCategories";
import AddProduct from "../../API/Products/AddProduct";
import GetProducts from "../../API/Products/GetProducts";
import UpdateProduct from "../../API/Products/UpdateProduct";
import DeleteProduct from "../../API/Products/DeleteProduct";
const Products = () => {
  useEffect(() => {
    getAllTier();
    getAllCompanies();
    getAllBrands();
    getAllCategories();
    GetProducts(setAllProducts, setError, setLoading);
  }, []);

  const [showTable, setShowTable] = useState(true);
  const [AddProductModel, setAddProductModel] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);

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
  const [allProducts, setAllProducts] = useState([]);

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
    GetAllCategories(setAllCategories, setError, setLoading);
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
  const [defaultPriceBox, setDefaultPriceBox] = useState();
  const [piecesNumber, setPiecesNumber] = useState();
  // MULTIPLE CATEGORIES (subcategories)
  const [categories, setcategories] = useState([]);
  const [expandedMainCategories, setExpandedMainCategories] = useState([]);

  // Toggle main category expansion to show/hide subcategories
  const toggleMainCategory = (categoryId, e) => {
    // Prevent any event propagation to avoid triggering checkbox clicks
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpandedMainCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle subcategory selection (multiple subcategories from multiple main categories)
  const handleSubCategorySelect = (subCategoryId, e) => {
    // Prevent event propagation to ensure only explicit checkbox clicks trigger this
    if (e) {
      e.stopPropagation();
    }
    setcategories((prev) => {
      if (prev.includes(subCategoryId)) {
        // Remove if already selected
        return prev.filter((id) => id !== subCategoryId);
      } else {
        // Add if not selected
        return [...prev, subCategoryId];
      }
    });
  };

  const [brand, setBrand] = useState("");

  const [tierPrices, settierPrices] = useState([]);

  const [selectedTier, setSelectedTier] = useState("");
  const [tierPriceValue, setTierPriceValue] = useState("");
  const [boxTierPriceValue, setBoxTierPriceValue] = useState("");
  const addTierPrice = () => {
    if (!selectedTier || !tierPriceValue) return;

    settierPrices((prev) => [
      ...prev,
      {
        tier: selectedTier,
        price: Number(tierPriceValue),
        boxPrice: boxTierPriceValue ? Number(boxTierPriceValue) : undefined,
      },
    ]);

    setSelectedTier("");
    setTierPriceValue("");
    setBoxTierPriceValue("");
  };

  const [stockQ, setStockQ] = useState("");
  const [stockStatus, setStockStatus] = useState("");

  // RESET FORM
  const resetForm = () => {
    setEnName("");
    setArName("");
    setEnDescription("");
    setArDescription("");
    setdefaultPrice("");
    setcode("");
    setArUses("");
    setEnUses("");
    setArFeatures("");
    setEnFeatures("");
    setcompany("");
    setBrand("");
    setcategories([]);
    setExpandedMainCategories([]);
    settierPrices([]);
    setStockQ("");
    setStockStatus("");
    setMainImage(null);
    setGalleryImages([]);
    setIsEditMode(false);
    setEditingProductId(null);
    setDefaultPriceBox("");
    setPiecesNumber("");
    setSelectedTier("");
    setTierPriceValue("");
    setBoxTierPriceValue("");
  };

  // POPULATE FORM WITH PRODUCT DATA
  const populateFormWithProduct = (product) => {
    setEnName(product?.name?.en || "");
    setArName(product?.name?.ar || "");
    setEnDescription(product?.description?.en || "");
    setArDescription(product?.description?.ar || "");
    // Use defaultPrice from backend, fallback to price if defaultPrice doesn't exist
    setdefaultPrice(
      product?.defaultPrice !== undefined && product?.defaultPrice !== null
        ? product.defaultPrice.toString()
        : product?.price !== undefined && product?.price !== null
        ? product.price.toString()
        : ""
    );
    setcode(product?.code || "");
    setArUses(product?.uses?.ar || "");
    setEnUses(product?.uses?.en || "");
    setArFeatures(product?.features?.ar || "");
    setEnFeatures(product?.features?.en || "");
    setcompany(product?.company?._id || product?.company || "");
    setBrand(product?.brand?._id || product?.brand || "");

    // Set defaultPriceBox and piecesNumber - handle null/undefined/0/empty string
    // Don't show "0" if the value is 0, null, undefined, or empty
    const priceBoxValue = product?.defaultPriceBox;
    setDefaultPriceBox(
      priceBoxValue !== undefined &&
        priceBoxValue !== null &&
        priceBoxValue !== "" &&
        priceBoxValue !== 0 &&
        priceBoxValue !== "0"
        ? priceBoxValue.toString()
        : ""
    );
    
    const piecesValue = product?.piecesNumber;
    setPiecesNumber(
      piecesValue !== undefined &&
        piecesValue !== null &&
        piecesValue !== "" &&
        piecesValue !== 0 &&
        piecesValue !== "0"
        ? piecesValue.toString()
        : ""
    );

    // Set categories (subcategories only) - don't auto-expand main categories
    if (product?.categories && Array.isArray(product.categories)) {
      // Extract category IDs (could be main or sub categories)
      const categoryIds = product.categories.map((cat) => cat._id || cat);
      // Only store subcategory IDs, filter out main category IDs
      const subCategoryIds = [];
      allCategories.forEach((mainCat) => {
        if (mainCat.subCategories && Array.isArray(mainCat.subCategories)) {
          mainCat.subCategories.forEach((subCat) => {
            const subCatId = subCat._id || subCat;
            if (categoryIds.includes(subCatId)) {
              subCategoryIds.push(subCatId);
            }
          });
        }
      });
      setcategories(subCategoryIds);
      // Don't auto-expand - let user manually expand if needed
      setExpandedMainCategories([]);
    } else {
      setcategories([]);
      setExpandedMainCategories([]);
    }

    // Set tier prices if available - ensure boxPrice is preserved
    if (product?.tierPrices && Array.isArray(product.tierPrices)) {
      // Map tier prices to ensure boxPrice is properly included
      const mappedTierPrices = product.tierPrices.map((tp) => ({
        tier: tp.tier?._id || tp.tier,
        price: tp.price,
        boxPrice:
          tp.boxPrice !== undefined && tp.boxPrice !== null
            ? tp.boxPrice
            : undefined,
      }));
      settierPrices(mappedTierPrices);
    } else {
      settierPrices([]);
    }

    setStockQ(product?.stock?.toString() || "");
    setStockStatus(product?.stockStatus || "In Stock");

    // Handle images - set existing images as URLs (not files)
    if (product?.picUrls && product.picUrls.length > 0) {
      // Store URLs for display, but we'll need to handle file uploads separately
      setMainImage(null); // Reset to null, user can upload new if needed
      setGalleryImages([]);
    } else {
      setMainImage(null);
      setGalleryImages([]);
    }
  };

  // HANDLE EDIT CLICK
  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setIsEditMode(true);
    populateFormWithProduct(product);
    setAddProductModel(true);
    setShowTable(false);
  };

  // SUBMIT PRODUCT (ADD OR UPDATE)
  const handleAddProduct = () => {
    // Validation - Check required fields
    const missingFields = [];

    // Name (Arabic and English)
    if (!arName || arName.trim() === "") {
      missingFields.push("اسم المنتج (عربي)");
    }
    if (!enName || enName.trim() === "") {
      missingFields.push("Product Name (English)");
    }

    // Barcode
    if (!code || code.trim() === "") {
      missingFields.push("Barcode Number");
    }

    // Description (Arabic and English)
    if (!arDescription || arDescription.trim() === "") {
      missingFields.push("وصف المنتج (عربي)");
    }
    if (!enDescription || enDescription.trim() === "") {
      missingFields.push("Product Description (English)");
    }

    // Uses (Arabic and English)
    if (!arUses || arUses.trim() === "") {
      missingFields.push("استخدامات المنتج (عربي)");
    }
    if (!enUses || enUses.trim() === "") {
      missingFields.push("Product Uses (English)");
    }

    // Default Price
    if (!defaultPrice || defaultPrice.trim() === "" || defaultPrice === "0") {
      missingFields.push("Default Product Price");
    }

    // Stock and Stock Status
    if (!stockQ || stockQ.trim() === "") {
      missingFields.push("Stock Quantity");
    }
    if (!stockStatus || stockStatus.trim() === "") {
      missingFields.push("Stock Status");
    }

    // Images - at least main image
    if (!mainImage) {
      missingFields.push("Product Image (Main Image)");
    }

    // Features (Arabic and English)
    if (!arFeatures || arFeatures.trim() === "") {
      missingFields.push("مزايا المنتج (عربي)");
    }
    if (!enFeatures || enFeatures.trim() === "") {
      missingFields.push("Product Features (English)");
    }

    // Categories - at least one
    if (!categories || categories.length === 0) {
      missingFields.push("Product Categories (at least one)");
    }

    // Company
    if (!company || company.trim() === "") {
      missingFields.push("Product Company");
    }

    // Brand
    if (!brand || brand.trim() === "") {
      missingFields.push("Product Brand");
    }

    // Show alert if there are missing fields
    if (missingFields.length > 0) {
      const message = `Please fill in the following required fields:\n\n${missingFields.join("\n")}`;
      alert(message);
      setError(`Missing required fields: ${missingFields.join(", ")}`);
      return; // Stop submission
    }

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

    // PRICE BOX
    if (
      defaultPriceBox !== undefined &&
      defaultPriceBox !== null &&
      defaultPriceBox !== ""
    ) {
      data.append("defaultPriceBox", defaultPriceBox);
    }
    if (
      piecesNumber !== undefined &&
      piecesNumber !== null &&
      piecesNumber !== ""
    ) {
      data.append("piecesNumber", piecesNumber);
    }

    // MULTIPLE CATEGORIES
    categories.forEach((catId) => {
      data.append("categories", catId);
    });

    // PRICE SEGMENTS (POSTMAN STYLE)
    tierPrices.forEach((tp, index) => {
      data.append(`tierPrices[${index}][tier]`, tp.tier);
      data.append(`tierPrices[${index}][price]`, tp.price);
      // Only send boxPrice if it exists and is not undefined
      if (tp.boxPrice !== undefined && tp.boxPrice !== null) {
        data.append(`tierPrices[${index}][boxPrice]`, tp.boxPrice);
      }
    });

    // IMAGES
    if (mainImage) {
      data.append("image", mainImage);
    }

    galleryImages.forEach((file) => {
      data.append("image", file);
    });

    // SEND TO API
    if (isEditMode && editingProductId) {
      UpdateProduct(
        editingProductId,
        data,
        setError,
        setLoading,
        setAddProductModel,
        setShowTable,
        () => {
          resetForm();
          // Refresh products list
          GetProducts(setAllProducts, setError, setLoading);
        }
      );
    } else {
      AddProduct(data, setError, setLoading, setShowTable, setAddProductModel);
      resetForm();
    }
  };
console.log(allProducts);

  return (
    <div className="products">
      {showTable && (
        <>
          <div className="products_top">
            <input type="text" placeholder="search" />
            <button
              onClick={() => {
                resetForm();
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
                  <th>Category</th>
                  <th>Company</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {allProducts.map((item) => {
                  return (
                    <tr key={item._id}>
                      <td className="product_image">
                        <img src={item?.picUrls[0]} alt="" />
                      </td>
                      <td>{item?.name?.en}</td>
                      <td>{item?.code}</td>
                      <td>{item?.categories.map((cat) => cat.name.en)}</td>
                      <td>{item?.company?.name?.en}</td>
                      <td>{item?.brand?.name?.en || "under development"}</td>
                      <td>{item?.defaultPrice} AED</td>
                      <td className="actions">
                        <RiDeleteBin6Line
                          className="delete_icon"
                          onClick={() => {
                            setDeleteProduct(item);
                            setOpenDeleteModal(true);
                          }}
                        />
                        <RiEditLine
                          className="edit_icon"
                          onClick={() => handleEditClick(item)}
                        />
                      </td>
                    </tr>
                  );
                })}
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
                resetForm();
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
              <h1>{isEditMode ? "Edit Product" : "Basic Details"}</h1>

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
                  <span>Barcode Number</span>
                  <input
                    type="text"
                    placeholder="NBENOV500"
                    value={code}
                    onChange={(e) => setcode(e.target.value)}
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
                      placeholder="100"
                      value={defaultPrice}
                      onChange={(e) => setdefaultPrice(e.target.value)}
                    />
                  </label>

                  <label>
                    <span>Box Price</span>
                    <input
                      type="text"
                      placeholder="89"
                      value={defaultPriceBox}
                      onChange={(e) => setDefaultPriceBox(e.target.value)}
                    />
                  </label>

                  <label>
                    <span>Box Pieces Number</span>
                    <input
                      type="text"
                      placeholder="10"
                      value={piecesNumber}
                      onChange={(e) => setPiecesNumber(e.target.value)}
                    />
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
                      <div className="input_group">
                        <label>Box Tier Price (AED)</label>

                        <input
                          type="number"
                          placeholder="220"
                          value={boxTierPriceValue}
                          onChange={(e) => setBoxTierPriceValue(e.target.value)}
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
                            {item.boxPrice && <p>Box: {item.boxPrice} AED</p>}
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
                  {loading
                    ? isEditMode
                      ? "Updating ..."
                      : "Publishing ..."
                    : isEditMode
                    ? "Update Product"
                    : "Publish Product"}
                </button>
                {error && <div className="error_message">{error}</div>}
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
                      src={
                        typeof mainImage === "string"
                          ? mainImage
                          : URL.createObjectURL(mainImage)
                      }
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
                ) : isEditMode &&
                  allProducts.find((p) => p._id === editingProductId)
                    ?.picUrls?.[0] ? (
                  <>
                    <img
                      className="mainImage"
                      src={
                        allProducts.find((p) => p._id === editingProductId)
                          ?.picUrls[0]
                      }
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
                {/* Show existing gallery images in edit mode */}
                {isEditMode &&
                  allProducts
                    .find((p) => p._id === editingProductId)
                    ?.picUrls?.slice(1)
                    .map((imgUrl, index) => (
                      <div className="gallery_item" key={`existing-${index}`}>
                        <img src={imgUrl} alt="gallery" />
                        <div className="existing_image_label">Existing</div>
                      </div>
                    ))}

                {/* Show new uploaded gallery images */}
                {galleryImages.map((img, index) => (
                  <div className="gallery_item" key={`new-${index}`}>
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
                  <span>Product Categories (Select Subcategories)</span>

                  <div className="categories_hierarchical_list">
                    {allCategories.map((mainCat) => {
                      const isExpanded = expandedMainCategories.includes(mainCat._id);
                      const subCategories = mainCat.subCategories || [];
                      const hasSubCategories = subCategories.length > 0;

                      return (
                        <div key={mainCat._id} className="main_category_item">
                          <div
                            className={`main_category_header ${hasSubCategories ? 'clickable' : ''}`}
                            onClick={(e) => hasSubCategories && toggleMainCategory(mainCat._id, e)}
                          >
                            <span className="main_category_name">
                              {mainCat.name?.en || mainCat.name?.ar || "Category"}
                            </span>
                            {hasSubCategories && (
                              <span className="expand_icon">
                                {isExpanded ? "▼" : "▶"}
                              </span>
                            )}
                            {!hasSubCategories && (
                              <span className="no_subcategories">(No subcategories)</span>
                            )}
                          </div>

                          {isExpanded && hasSubCategories && (
                            <div className="subcategories_list">
                              {subCategories.map((subCat) => {
                                const subCatId = subCat._id || subCat;
                                const isSelected = categories.includes(subCatId);
                                
                                return (
                                  <div
                                    key={subCatId}
                                    className="subcategory_checkbox_item"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => handleSubCategorySelect(subCatId, e)}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <span>
                                        {subCat.name?.en || subCat.name?.ar || "Subcategory"}
                                      </span>
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Show ALL selected subcategories from ALL main categories */}
                  {categories.length > 0 && (
                    <div className="selected_categories_summary">
                      <strong>Selected Subcategories ({categories.length}):</strong>
                      <div className="selected_categories_tags">
                        {categories.map((catId) => {
                          // Find the subcategory name and its main category from ALL categories
                          let subCatName = catId;
                          let mainCatName = "";
                          
                          allCategories.forEach((mainCat) => {
                            if (mainCat.subCategories && Array.isArray(mainCat.subCategories)) {
                              const subCat = mainCat.subCategories.find(
                                (sc) => (sc._id || sc) === catId
                              );
                              if (subCat) {
                                subCatName = subCat.name?.en || subCat.name?.ar || catId;
                                mainCatName = mainCat.name?.en || mainCat.name?.ar || "";
                              }
                            }
                          });
                          
                          return (
                            <span key={catId} className="selected_category_tag">
                              {mainCatName && <span className="main_cat_label">{mainCatName}: </span>}
                              {subCatName}
                              <button
                                type="button"
                                onClick={() => handleSubCategorySelect(catId)}
                                className="remove_category_btn"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <div className="add_product_right_inputs">
                <label>
                  <span>Product Company</span>
                  <select
                    value={company}
                    onChange={(e) => setcompany(e.target.value)}
                  >
                    <option value="">Choose Company</option>
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
                    <option value="">Choose Brand</option>
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

      {/* Delete Product Modal */}
      {openDeleteModal && deleteProduct && (
        <div className="delete_product_modal">
          <div
            className="overlay"
            onClick={() => setOpenDeleteModal(false)}
          ></div>

          <div className="delete_product_modal_container">
            <IoIosCloseCircleOutline
              className="close_delete_icon"
              onClick={() => setOpenDeleteModal(false)}
            />

            <div className="delete_modal_content">
              <div className="delete_icon_animation">
                <RiDeleteBin6Line className="delete_icon_large" />
              </div>

              <h2>Delete Product</h2>
              <p className="delete_modal_message">
                Are you sure you want to delete this product?
              </p>

              <div className="delete_product_info">
                <p>
                  Product:{" "}
                  <strong>
                    {deleteProduct?.name?.en || deleteProduct?.name || "N/A"}
                  </strong>
                </p>
                {deleteProduct?.code && (
                  <p>
                    Code: <strong>{deleteProduct.code}</strong>
                  </p>
                )}
              </div>

              <div className="delete_modal_btns">
                <button
                  className="cancel_btn"
                  onClick={() => setOpenDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="delete_confirm_btn"
                  onClick={() => {
                    DeleteProduct(
                      deleteProduct._id,
                      setError,
                      setLoading,
                      setOpenDeleteModal,
                      () => GetProducts(setAllProducts, setError, setLoading)
                    );
                  }}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>

              {error && <p className="error_message">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
