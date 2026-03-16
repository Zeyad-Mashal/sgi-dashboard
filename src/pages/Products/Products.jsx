import React from "react";
import "./Products.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
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
import ProductSearch from "../../API/Search/ProductSearch";
import GetProductStock from "../../API/Products/GetProductStock";
const Products = () => {
  const [showTable, setShowTable] = useState(true);
  const [AddProductModel, setAddProductModel] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [productStock, setProductStock] = useState([]);
  // IMAGES (FILES)
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  // Store original product images for update
  const [originalMainImageUrl, setOriginalMainImageUrl] = useState(null);
  const [originalGalleryImageUrls, setOriginalGalleryImageUrls] = useState([]);
  // Track deleted and replaced gallery images in edit mode
  const [deletedGalleryImageUrls, setDeletedGalleryImageUrls] = useState([]);
  const [replacedGalleryImages, setReplacedGalleryImages] = useState([]); // {originalUrl: newFile}

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

  // Replace (edit) a new gallery image at index
  const replaceNewGalleryImage = (index, newFile) => {
    setGalleryImages((prev) =>
      prev.map((img, i) => (i === index ? newFile : img)),
    );
  };

  // Remove existing gallery image (in edit mode)
  const removeExistingGalleryImage = (imgUrl) => {
    setDeletedGalleryImageUrls((prev) => [...prev, imgUrl]);
    // Also remove from replaced images if it was being replaced
    setReplacedGalleryImages((prev) => {
      const newReplaced = { ...prev };
      delete newReplaced[imgUrl];
      return newReplaced;
    });
  };

  // Replace existing gallery image (in edit mode)
  const replaceExistingGalleryImage = (originalUrl, newFile) => {
    setReplacedGalleryImages((prev) => ({
      ...prev,
      [originalUrl]: newFile,
    }));
    // Remove from deleted list if it was marked for deletion
    setDeletedGalleryImageUrls((prev) =>
      prev.filter((url) => url !== originalUrl),
    );
  };

  // Handle file input for replacing existing gallery image
  const handleReplaceGalleryImage = (originalUrl, e) => {
    const file = e.target.files[0];
    if (file) {
      replaceExistingGalleryImage(originalUrl, file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  // API DATA
  const [allTiers, setAllTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: null,
    totalProducts: null,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    getAllTier();
    getAllCompanies();
    getAllBrands();
    getAllCategories();
    GetProducts(
      setAllProducts,
      setError,
      setLoading,
      currentPage,
      setPaginationInfo,
    );
    GetProductStock(setProductStock, setError, setLoading);
  }, [currentPage]);

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
  // MULTIPLE CATEGORIES (subcategories and main categories)
  const [categories, setcategories] = useState([]);
  const [expandedMainCategories, setExpandedMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");

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
        : [...prev, categoryId],
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

  // Handle main category selection from dropdown
  const handleMainCategorySelect = (mainCategoryId) => {
    if (!mainCategoryId) return;

    setcategories((prev) => {
      // Check if already selected
      if (prev.includes(mainCategoryId)) {
        return prev; // Already selected, don't add again
      } else {
        // Add main category ID to categories array
        return [...prev, mainCategoryId];
      }
    });

    // Reset select after adding
    setSelectedMainCategory("");
  };

  // Remove a specific category (used by the remove button)
  const removeCategory = (categoryId, e) => {
    // Stop event propagation to prevent triggering other handlers
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setcategories((prev) => {
      // Filter out only the specific category ID
      return prev.filter((id) => id !== categoryId);
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
  const [isFeatured, setIsFeatured] = useState(false);

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
    setSelectedMainCategory("");
    settierPrices([]);
    setStockQ("");
    setStockStatus("");
    setMainImage(null);
    setGalleryImages([]);
    setOriginalMainImageUrl(null);
    setOriginalGalleryImageUrls([]);
    setDeletedGalleryImageUrls([]);
    setReplacedGalleryImages([]);
    setIsEditMode(false);
    setEditingProductId(null);
    setDefaultPriceBox("");
    setPiecesNumber("");
    setSelectedTier("");
    setTierPriceValue("");
    setBoxTierPriceValue("");
    setIsFeatured(false);
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
          : "",
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
        : "",
    );

    const piecesValue = product?.piecesNumber;
    setPiecesNumber(
      piecesValue !== undefined &&
        piecesValue !== null &&
        piecesValue !== "" &&
        piecesValue !== 0 &&
        piecesValue !== "0"
        ? piecesValue.toString()
        : "",
    );

    // Set categories (both main categories and subcategories)
    if (product?.categories && Array.isArray(product.categories)) {
      // Extract category IDs (could be main or sub categories)
      const categoryIds = product.categories.map((cat) => cat._id || cat);

      // Separate main categories and subcategories
      const mainCategoryIds = [];
      const subCategoryIds = [];

      // Get all main category IDs
      const allMainCategoryIds = allCategories.map(
        (mainCat) => mainCat._id || mainCat,
      );

      // Check each category ID
      categoryIds.forEach((catId) => {
        // Check if it's a main category
        if (allMainCategoryIds.includes(catId)) {
          mainCategoryIds.push(catId);
        } else {
          // Check if it's a subcategory
          allCategories.forEach((mainCat) => {
            if (mainCat.subCategories && Array.isArray(mainCat.subCategories)) {
              mainCat.subCategories.forEach((subCat) => {
                const subCatId = subCat._id || subCat;
                if (subCatId === catId && !subCategoryIds.includes(subCatId)) {
                  subCategoryIds.push(subCatId);
                }
              });
            }
          });
        }
      });

      // Combine main and sub categories
      setcategories([...mainCategoryIds, ...subCategoryIds]);
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

    // Set featured status - check if product has type=featured
    setIsFeatured(product?.type === "featured" || product?.featured === true);

    // Handle images - store original image URLs for update
    if (product?.picUrls && product.picUrls.length > 0) {
      // Store original main image URL
      setOriginalMainImageUrl(product.picUrls[0]);
      // Store original gallery images (all except first)
      setOriginalGalleryImageUrls(product.picUrls.slice(1) || []);
      // Reset new uploads and edit mode states
      setMainImage(null);
      setGalleryImages([]);
      setDeletedGalleryImageUrls([]);
      setReplacedGalleryImages([]);
    } else {
      setOriginalMainImageUrl(null);
      setOriginalGalleryImageUrls([]);
      setMainImage(null);
      setGalleryImages([]);
      setDeletedGalleryImageUrls([]);
      setReplacedGalleryImages([]);
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

    // Images - at least main image (only required in add mode)
    if (!isEditMode && !mainImage) {
      missingFields.push("Product Image (Main Image)");
    }
    // In edit mode, require either new image or original image
    if (isEditMode && !mainImage && !originalMainImageUrl) {
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

    // في وضع التعديل: نأخذ المنتج الحالي لاستخدام بياناته كاحتياطي حتى لا تُمسح أي حقل
    const currentProduct =
      isEditMode && editingProductId
        ? allProducts.find((p) => p._id === editingProductId)
        : null;

    const orFromProduct = (formVal, productVal) => {
      const v = formVal !== undefined && formVal !== null && String(formVal).trim() !== "" ? formVal : productVal;
      return v !== undefined && v !== null ? String(v) : "";
    };

    const data = new FormData();

    // BASIC INFO - نستخدم قيمة النموذج أو الاحتياطي من المنتج
    data.append("enName", orFromProduct(enName, currentProduct?.name?.en));
    data.append("arName", orFromProduct(arName, currentProduct?.name?.ar));
    data.append("enDescription", orFromProduct(enDescription, currentProduct?.description?.en));
    data.append("arDescription", orFromProduct(arDescription, currentProduct?.description?.ar));
    data.append("defaultPrice", orFromProduct(defaultPrice, currentProduct?.defaultPrice ?? currentProduct?.price));
    data.append("code", orFromProduct(code, currentProduct?.code));

    // USES
    data.append("arUses", orFromProduct(arUses, currentProduct?.uses?.ar));
    data.append("enUses", orFromProduct(enUses, currentProduct?.uses?.en));

    // FEATURES
    data.append("arFeatures", orFromProduct(arFeatures, currentProduct?.features?.ar));
    data.append("enFeatures", orFromProduct(enFeatures, currentProduct?.features?.en));

    // COMPANY / BRAND
    data.append("company", orFromProduct(company, currentProduct?.company?._id ?? currentProduct?.company));
    data.append("brand", orFromProduct(brand, currentProduct?.brand?._id ?? currentProduct?.brand));

    // STOCK — إرسال stock للباك إند (الكمية) + stockStatus، مع الاحتفاظ بـ stockQuantity للتوافق
    const stockValue = orFromProduct(stockQ, currentProduct?.stock);
    const stockStatusValue = orFromProduct(stockStatus, currentProduct?.stockStatus ?? "In Stock");
    data.append("stock", stockValue);
    data.append("stockQuantity", stockValue);
    data.append("stockStatus", stockStatusValue);

    // PRICE BOX
    if (isEditMode && editingProductId) {
      data.append(
        "defaultPriceBox",
        orFromProduct(defaultPriceBox, currentProduct?.defaultPriceBox)
      );
      data.append(
        "piecesNumber",
        orFromProduct(piecesNumber, currentProduct?.piecesNumber)
      );
    } else {
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
    }

    // MULTIPLE CATEGORIES - إن كانت القائمة فاضية في التعديل نستخدم تصنيفات المنتج
    const categoriesToSend =
      isEditMode && currentProduct && (!categories || categories.length === 0)
        ? (currentProduct.categories || []).map((c) => c._id || c)
        : categories || [];
    categoriesToSend.forEach((catId) => {
      data.append("categories", catId);
    });

    // PRICE SEGMENTS - إن كانت فاضية في التعديل نستخدم أسعار المنتج
    const tierPricesToSend =
      isEditMode && currentProduct && (!tierPrices || tierPrices.length === 0)
        ? (currentProduct.tierPrices || []).map((tp) => ({
            tier: tp.tier?._id ?? tp.tier,
            price: tp.price,
            boxPrice: tp.boxPrice,
          }))
        : tierPrices || [];
    tierPricesToSend.forEach((tp, index) => {
      data.append(`tierPrices[${index}][tier]`, tp.tier);
      data.append(`tierPrices[${index}][price]`, tp.price);
      if (tp.boxPrice !== undefined && tp.boxPrice !== null) {
        data.append(`tierPrices[${index}][boxPrice]`, tp.boxPrice);
      }
    });

    // IMAGES - في التعديل: نرسل كل الصور من المنتج الحالي (مصدر واحد: currentProduct.picUrls) + الملفات الجديدة
    if (isEditMode && editingProductId && currentProduct) {
      const productPicUrls = Array.isArray(currentProduct.picUrls) ? [...currentProduct.picUrls] : [];
      const mainUrlFromProduct = productPicUrls[0] || originalMainImageUrl || "";
      const galleryUrlsFromProduct = productPicUrls.slice(1);

      const keptGalleryUrls = galleryUrlsFromProduct.filter(
        (url) => url && !deletedGalleryImageUrls.includes(url) && !replacedGalleryImages[url]
      );

      const mainUrlToKeep =
        mainImage && typeof mainImage === "string"
          ? mainImage
          : mainImage && typeof mainImage !== "string"
            ? null
            : mainUrlFromProduct;

      const fullPicUrls = [
        ...(mainUrlToKeep ? [mainUrlToKeep] : []),
        ...keptGalleryUrls,
      ];

      // 1) إرسال القائمة الكاملة للصور (كل ما نريد الإبقاء عليه) بعدة صيغ لضمان فهم الباك إند
      if (fullPicUrls.length > 0) {
        data.append("picUrls", JSON.stringify(fullPicUrls));
        fullPicUrls.forEach((url) => data.append("picUrls[]", url));
      }

      data.append("existingImageCount", String(fullPicUrls.length));

      if (mainUrlToKeep) {
        data.append("existingMainImage", mainUrlToKeep);
      }
      keptGalleryUrls.forEach((url) => {
        data.append("existingGalleryImage", url);
        data.append("existingGalleryImage[]", url);
      });
      deletedGalleryImageUrls.forEach((url) => {
        data.append("deletedGalleryImage", url);
      });

      // 2) الصور الجديدة (ملفات فقط) — يُفترض أن الباك إند يضيفها إلى picUrls ولا يستبدل القائمة
      if (mainImage && typeof mainImage !== "string") {
        data.append("image", mainImage);
      }
      galleryImages.forEach((file) => {
        if (typeof file !== "string") data.append("image", file);
        else data.append("existingGalleryImage", file);
      });
      Object.entries(replacedGalleryImages).forEach(([, newFile]) => {
        if (newFile) data.append("image", newFile);
      });
    } else if (isEditMode && editingProductId) {
      // تعديل بدون currentProduct (احتياطي): نعتمد على الحالة — نرسل كل الصور الموجودة من state
      const fallbackMain = (mainImage && typeof mainImage === "string") ? mainImage : originalMainImageUrl;
      const fallbackGallery = (originalGalleryImageUrls || []).filter(
        (url) => !deletedGalleryImageUrls.includes(url) && !replacedGalleryImages[url]
      );
      const fallbackPicUrls = [...(fallbackMain ? [fallbackMain] : []), ...fallbackGallery];
      if (fallbackPicUrls.length > 0) {
        data.append("picUrls", JSON.stringify(fallbackPicUrls));
        fallbackPicUrls.forEach((url) => data.append("picUrls[]", url));
      }
      if (fallbackMain) data.append("existingMainImage", fallbackMain);
      fallbackGallery.forEach((url) => {
        data.append("existingGalleryImage", url);
        data.append("existingGalleryImage[]", url);
      });
      if (mainImage && typeof mainImage !== "string") data.append("image", mainImage);
      galleryImages.forEach((file) => {
        if (typeof file !== "string") data.append("image", file);
        else data.append("existingGalleryImage", file);
      });
      Object.entries(replacedGalleryImages).forEach(([, newFile]) => {
        if (newFile) data.append("image", newFile);
      });
      deletedGalleryImageUrls.forEach((url) => data.append("deletedGalleryImage", url));
    } else {
      // Add mode: only send new uploaded images
      if (mainImage) {
        data.append("image", mainImage);
      }

      galleryImages.forEach((file) => {
        data.append("image", file);
      });
    }

    // FEATURED TYPE - Only add if checkbox is checked
    if (isFeatured) {
      data.append("type", "featured");
    }

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
          GetProducts(
            setAllProducts,
            setError,
            setLoading,
            currentPage,
            setPaginationInfo,
          );
        },
        isFeatured,
      );
    } else {
      AddProduct(data, setError, setLoading, setShowTable, setAddProductModel);
      resetForm();
    }
  };

  return (
    <div className="products">
      {showTable && (
        <>
          <div className="products_top">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                const query = e.target.value;
                setSearchQuery(query);

                // If input is empty, get all products
                if (query.trim() === "") {
                  setCurrentPage(1); // Reset to page 1 when clearing search
                  GetProducts(
                    setAllProducts,
                    setError,
                    setLoading,
                    1,
                    setPaginationInfo,
                  );
                } else {
                  // Search as user types
                  ProductSearch(
                    setAllProducts,
                    setError,
                    setLoading,
                    encodeURIComponent(query.trim()),
                  );
                }
              }}
            />
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
                  <th>Box Price</th>
                  <th>Price</th>
                  <th>Stock (Odoo)</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <div className="loading">
                        <p>Searching products...</p>
                        <span className="loader"></span>
                      </div>
                    </td>
                  </tr>
                ) : allProducts.length > 0 ? (
                  allProducts.map((item) => {
                    const productCode = item?.code != null ? String(item.code).trim() : "";
                    const odooStock = Array.isArray(productStock)
                      ? productStock.find(
                          (s) =>
                            s?.internal_reference != null &&
                            String(s.internal_reference).trim() === productCode
                        )
                      : null;
                    const quantityAvailable = odooStock?.quantity_available ?? odooStock?.qty_available ?? "—";

                    return (
                      <tr key={item._id}>
                        <td className="product_image">
                          <img src={item?.picUrls[0]} alt="" />
                        </td>
                        <td>{item?.name?.en}</td>
                        <td>{item?.code}</td>
                        <td>
                          {item?.categories &&
                          Array.isArray(item.categories) &&
                          item.categories.length > 0
                            ? item.categories
                                .map(
                                  (cat) =>
                                    cat?.name?.en || cat?.name?.ar || "N/A",
                                )
                                .join(", ")
                            : "No categories"}
                        </td>
                        <td>{item?.company?.name?.en}</td>
                        <td>{item?.defaultPriceBox} AED</td>
                        <td>{item?.defaultPrice} AED</td>
                        <td>{quantityAvailable}</td>
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
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <p>No products found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls - Only show when not searching */}
          {!loading && allProducts.length > 0 && !searchQuery && (
            <div className="pagination_controls">
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
                disabled={currentPage === 1 || !paginationInfo.hasPrevPage}
                className="pagination_btn"
              >
                Previous
              </button>

              <div className="pagination_info">
                <span>Page {paginationInfo.currentPage || currentPage}</span>
                {paginationInfo.totalPages && (
                  <span> of {paginationInfo.totalPages}</span>
                )}
                {paginationInfo.totalProducts && (
                  <span> ({paginationInfo.totalProducts} total products)</span>
                )}
              </div>

              <button
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
                disabled={!paginationInfo.hasNextPage}
                className="pagination_btn"
              >
                Next
              </button>
            </div>
          )}
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
                // Clear search and reload all products
                setSearchQuery("");
                setCurrentPage(1);
                GetProducts(
                  setAllProducts,
                  setError,
                  setLoading,
                  1,
                  setPaginationInfo,
                );
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
                                tierPrices.filter((_, i) => i !== index),
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
                    .filter(
                      (imgUrl) => !deletedGalleryImageUrls.includes(imgUrl),
                    )
                    .map((imgUrl, index) => {
                      // Check if this image was replaced
                      const isReplaced = replacedGalleryImages[imgUrl];
                      const displayImage = isReplaced
                        ? URL.createObjectURL(isReplaced)
                        : imgUrl;

                      return (
                        <div className="gallery_item" key={`existing-${index}`}>
                          <img src={displayImage} alt="gallery" />
                          <div className="existing_image_label">
                            {isReplaced ? "Replaced" : "Existing"}
                          </div>

                          {/* Delete button */}
                          <IoIosCloseCircleOutline
                            className="delete_icon"
                            onClick={() => removeExistingGalleryImage(imgUrl)}
                            title="Delete image"
                          />

                          {/* Edit button (replace image) - left side */}
                          <label
                            className="edit_gallery_icon"
                            title="Edit image"
                          >
                            <RiEditLine />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleReplaceGalleryImage(imgUrl, e)
                              }
                              hidden
                            />
                          </label>

                          {/* Set as main button (only for replaced images) */}
                          {isReplaced && (
                            <button
                              className="set_main_btn"
                              onClick={() => setMainImage(isReplaced)}
                            >
                              Set as Main
                            </button>
                          )}
                        </div>
                      );
                    })}

                {/* Show new uploaded gallery images */}
                {galleryImages.map((img, index) => (
                  <div className="gallery_item" key={`new-${index}`}>
                    <img src={URL.createObjectURL(img)} alt="gallery" />

                    <IoIosCloseCircleOutline
                      className="delete_icon"
                      onClick={() => removeGalleryImage(img)}
                      title="Delete image"
                    />

                    <label className="edit_gallery_icon" title="Edit image">
                      <RiEditLine />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) replaceNewGalleryImage(index, file);
                          e.target.value = "";
                        }}
                        hidden
                      />
                    </label>

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

                  {/* Main Categories Select */}
                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}
                    >
                      Add Main Category:
                    </label>
                    <select
                      value={selectedMainCategory}
                      onChange={(e) => handleMainCategorySelect(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        fontSize: "14px",
                      }}
                    >
                      <option value="">Choose Main Category</option>
                      {allCategories.map((mainCat) => {
                        const isAlreadySelected = categories.includes(
                          mainCat._id,
                        );
                        return (
                          <option
                            key={mainCat._id}
                            value={mainCat._id}
                            disabled={isAlreadySelected}
                          >
                            {mainCat.name?.en || mainCat.name?.ar || "Category"}
                            {isAlreadySelected ? " (Already Selected)" : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div
                    style={{
                      marginBottom: "15px",
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    <strong>Or select subcategories below:</strong>
                  </div>

                  <div className="categories_hierarchical_list">
                    {allCategories.map((mainCat) => {
                      const isExpanded = expandedMainCategories.includes(
                        mainCat._id,
                      );
                      const subCategories = mainCat.subCategories || [];
                      const hasSubCategories = subCategories.length > 0;

                      return (
                        <div key={mainCat._id} className="main_category_item">
                          <div
                            className={`main_category_header ${hasSubCategories ? "clickable" : ""}`}
                            onClick={(e) =>
                              hasSubCategories &&
                              toggleMainCategory(mainCat._id, e)
                            }
                          >
                            <span className="main_category_name">
                              {mainCat.name?.en ||
                                mainCat.name?.ar ||
                                "Category"}
                            </span>
                            {hasSubCategories && (
                              <span className="expand_icon">
                                {isExpanded ? "▼" : "▶"}
                              </span>
                            )}
                            {!hasSubCategories && (
                              <span className="no_subcategories">
                                (No subcategories)
                              </span>
                            )}
                          </div>

                          {isExpanded && hasSubCategories && (
                            <div className="subcategories_list">
                              {subCategories.map((subCat) => {
                                const subCatId = subCat._id || subCat;
                                const isSelected =
                                  categories.includes(subCatId);

                                return (
                                  <div
                                    key={subCatId}
                                    className="subcategory_checkbox_item"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <label
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        width: "100%",
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) =>
                                          handleSubCategorySelect(subCatId, e)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <span>
                                        {subCat.name?.en ||
                                          subCat.name?.ar ||
                                          "Subcategory"}
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

                  {/* Show ALL selected categories (main categories and subcategories) */}
                  {categories.length > 0 && (
                    <div className="selected_categories_summary">
                      <strong>
                        Selected Categories ({categories.length}):
                      </strong>
                      <div className="selected_categories_tags">
                        {categories.map((catId, index) => {
                          // Check if it's a main category
                          const mainCategory = allCategories.find(
                            (mainCat) => (mainCat._id || mainCat) === catId,
                          );

                          if (mainCategory) {
                            // It's a main category
                            return (
                              <span
                                key={`${catId}-${index}`}
                                className="selected_category_tag main_category_tag"
                              >
                                <span className="main_cat_label">Main: </span>
                                {mainCategory.name?.en ||
                                  mainCategory.name?.ar ||
                                  catId}
                                <button
                                  type="button"
                                  onClick={(e) => removeCategory(catId, e)}
                                  className="remove_category_btn"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          } else {
                            // It's a subcategory - find its name and main category
                            let subCatName = catId;
                            let mainCatName = "";

                            allCategories.forEach((mainCat) => {
                              if (
                                mainCat.subCategories &&
                                Array.isArray(mainCat.subCategories)
                              ) {
                                const subCat = mainCat.subCategories.find(
                                  (sc) => (sc._id || sc) === catId,
                                );
                                if (subCat) {
                                  subCatName =
                                    subCat.name?.en || subCat.name?.ar || catId;
                                  mainCatName =
                                    mainCat.name?.en || mainCat.name?.ar || "";
                                }
                              }
                            });

                            return (
                              <span
                                key={`${catId}-${index}`}
                                className="selected_category_tag"
                              >
                                {mainCatName && (
                                  <span className="main_cat_label">
                                    {mainCatName}:{" "}
                                  </span>
                                )}
                                {subCatName}
                                <button
                                  type="button"
                                  onClick={(e) => removeCategory(catId, e)}
                                  className="remove_category_btn"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          }
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
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
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
                      () =>
                        GetProducts(
                          setAllProducts,
                          setError,
                          setLoading,
                          currentPage,
                          setPaginationInfo,
                        ),
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
