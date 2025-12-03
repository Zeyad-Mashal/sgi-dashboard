import React from "react";
import "./Categories.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import CategoriesApi from "../../API/Categories/CategoriesApi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import tierImage from "../../assets/tier.png";
import CompanyApi from "../../API/Company/CompanyApi";
import AddCategory from "../../API/Categories/AddCategory";
import EditCategory from "../../API/Categories/EditCategory";
import DeleteCategory from "../../API/Categories/DeleteCategory";
import AddSubCategoryApi from "../../API/Categories/AddSubCategoryApi";
const Categories = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAllCategories();
  }, []);
  const getAllCategories = () => {
    CategoriesApi(setAllCategories, setError, setLoading);
  };

  //   companies for the select input
  const [allCompanies, setAllCompanies] = useState([]);
  useEffect(() => {
    CompanyApi(setAllCompanies, setError, setLoading);
  }, []);

  //   add new category function here
  const [openAddModal, setOpenAddModal] = useState(false);
  const [catNameEn, setCatNameEn] = useState("");
  const [catNameAr, setCatNameAr] = useState("");
  const [company, setCompany] = useState("");
  const handleAddCategory = () => {
    const data = {
      enName: catNameEn,
      arName: catNameAr,
    };
    AddCategory(
      data,
      setError,
      setLoading,
      setOpenAddModal,
      getAllCategories,
      company
    );
  };

  //   edit function here
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [editCatNameEn, setEditCatNameEn] = useState("");
  const [editCatNameAr, setEditCatNameAr] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const handleOpenEdit = (cat) => {
    setEditId(cat._id);
    setEditCatNameEn(cat.name.en);
    setEditCatNameAr(cat.name.ar);

    setEditCompany(
      cat.company && typeof cat.company === "object"
        ? cat.company._id
        : cat.company || ""
    );

    setOpenEditModal(true);
  };

  const handleUpdateCategory = () => {
    const data = {
      enName: editCatNameEn,
      arName: editCatNameAr,
    };

    EditCategory(
      editId,
      data,
      setError,
      setLoading,
      setOpenEditModal,
      getAllCategories
    );
  };

  //   delete category function here
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteCategoryName, setDeleteCategoryName] = useState("");
  const handleOpenDelete = (cat) => {
    setDeleteId(cat._id);
    setOpenDeleteModal(true);
    setDeleteCategoryName(cat.name.en);
  };
  const handleDeleteCategory = () => {
    DeleteCategory(
      deleteId,
      setError,
      setLoading,
      setOpenDeleteModal,
      getAllCategories
    );
  };

  // add sub category function here
  const [openSubModal, setOpenSubModal] = useState(false);
  const [subEnName, setSubEnName] = useState("");
  const [subArName, setSubArName] = useState("");

  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const handleOpenSubModal = (cat) => {
    setSelectedCompanyId(cat.company._id);
    setSelectedCategoryId(cat._id);
    setOpenSubModal(true);
  };

  const handleAddSubCategory = () => {
    const data = {
      enName: subEnName,
      arName: subArName,
    };

    AddSubCategoryApi(
      data,
      setError,
      setLoading,
      setOpenSubModal,
      getAllCategories,
      selectedCompanyId,
      selectedCategoryId
    );
  };

  //get all sub categories here
  // show sub category modal
  const [openShowSubModal, setOpenShowSubModal] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [showCompanyId, setShowCompanyId] = useState("");
  const [showCategoryId, setShowCategoryId] = useState("");
  const [showCompanyName, setShowCompanyName] = useState("");
  const [showCategoryName, setShowCategoryName] = useState("");

  return (
    <div className="Categories">
      <div className="Categories_top">
        <input type="text" placeholder="search" />
        <button onClick={() => setOpenAddModal(true)}>
          New Category <FaPlus />
        </button>
      </div>
      <div className="Categories_table">
        <table>
          <thead>
            <tr>
              <th>Category EN</th>
              <th>Catgegory Ar</th>
              <th>Company</th>
              <th>Has SubCategory</th>
              <th>SubCategory</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <div className="loading">
                <p>Loading Categories in progress...</p>
                <span className="loader"></span>
              </div>
            ) : (
              allCategories.map((category) => {
                return (
                  <tr key={category._id}>
                    <td>{category.name?.en}</td>
                    <td>{category.name?.ar}</td>
                    <td>{category.company.name?.en}</td>
                    <button
                      className="show_sub_btn"
                      onClick={() => {
                        setSelectedSubCategories(category.subCategories);

                        setShowCompanyId(category.company._id);
                        setShowCompanyName(category.company.name); // << هنا الاسم

                        setShowCategoryId(category._id);
                        setShowCategoryName(category.name); // << هنا الاسم

                        setOpenShowSubModal(true);
                      }}
                    >
                      Show SubCategories
                    </button>

                    <td>
                      <button
                        className="add_sub_btn"
                        onClick={() => handleOpenSubModal(category)}
                      >
                        Add Sub Category
                      </button>
                    </td>

                    <td className="actions">
                      <RiDeleteBin6Line
                        className="delete_icon"
                        onClick={() => handleOpenDelete(category)}
                      />

                      <RiEditLine
                        className="edit_icon"
                        onClick={() => handleOpenEdit(category)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {openAddModal && (
        <div className="add_category">
          <div className="overlay" onClick={() => setOpenAddModal(false)}></div>

          <div className="add_category_container">
            <IoIosCloseCircleOutline onClick={() => setOpenAddModal(false)} />

            <div className="add_title">
              <img src={tierImage} alt="" />
              <div className="add_title_info">
                <h2>Add New Category</h2>
                <p>Enter the details of the new category</p>
              </div>
            </div>

            <div className="add_form">
              <label>
                <span>Category Name (English)</span>
                <input
                  type="text"
                  placeholder="Category English name..."
                  value={catNameEn}
                  onChange={(e) => setCatNameEn(e.target.value)}
                />
              </label>

              <label>
                <span>Category Name (Arabic)</span>
                <input
                  type="text"
                  placeholder="Category Arabic name..."
                  value={catNameAr}
                  onChange={(e) => setCatNameAr(e.target.value)}
                />
              </label>

              <label>
                <span>Company</span>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                >
                  <option value="">Select a company</option>
                  {allCompanies.map((comp) => (
                    <option key={comp._id} value={comp._id}>
                      {comp.name.en}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="add_btns">
              <button onClick={() => setOpenAddModal(false)}>Cancel</button>

              <button onClick={handleAddCategory}>
                {loading ? "loading..." : "Add Category"}
              </button>

              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
      {openEditModal && (
        <div className="add_category">
          <div
            className="overlay"
            onClick={() => setOpenEditModal(false)}
          ></div>

          <div className="add_category_container">
            <IoIosCloseCircleOutline onClick={() => setOpenEditModal(false)} />

            <div className="add_title">
              <img src={tierImage} alt="" />
              <div className="add_title_info">
                <h2>Edit Category</h2>
                <p>Modify the category data</p>
              </div>
            </div>

            <div className="add_form">
              <label>
                <span>Category Name (English)</span>
                <input
                  type="text"
                  value={editCatNameEn}
                  onChange={(e) => setEditCatNameEn(e.target.value)}
                />
              </label>

              <label>
                <span>Category Name (Arabic)</span>
                <input
                  type="text"
                  value={editCatNameAr}
                  onChange={(e) => setEditCatNameAr(e.target.value)}
                />
              </label>

              <label>
                <span>Company</span>
                <select
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                >
                  <option value="">Select a company</option>
                  {allCompanies.map((comp) => (
                    <option key={comp._id} value={comp._id}>
                      {comp.name.en}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="add_btns">
              <button onClick={() => setOpenEditModal(false)}>Cancel</button>

              <button onClick={handleUpdateCategory}>
                {loading ? "loading..." : "Save Changes"}
              </button>

              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
      {openDeleteModal && (
        <div className="add_category">
          <div
            className="overlay"
            onClick={() => setOpenDeleteModal(false)}
          ></div>

          <div className="add_category_container delete_category_container">
            <IoIosCloseCircleOutline
              onClick={() => setOpenDeleteModal(false)}
            />

            <div className="add_title">
              <img src={tierImage} alt="" />
              <div className="add_title_info">
                <h2>Delete Category</h2>
                <p>Are you sure you want to delete this category?</p>
              </div>
            </div>

            <div className="delete_warning">
              <p>
                You are about to delete category with Name:
                <br />
                <strong style={{ color: "red" }}>{deleteCategoryName}</strong>
              </p>
            </div>

            <div className="add_btns">
              <button onClick={() => setOpenDeleteModal(false)}>Cancel</button>

              <button onClick={handleDeleteCategory}>
                {loading ? "Deleting..." : "Delete"}
              </button>

              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}

      {openSubModal && (
        <div className="add_category">
          <div className="overlay" onClick={() => setOpenSubModal(false)}></div>

          <div className="add_category_container">
            <IoIosCloseCircleOutline onClick={() => setOpenSubModal(false)} />

            <div className="add_title">
              <img src={tierImage} alt="" />
              <div className="add_title_info">
                <h2>Add Sub Category</h2>
                <p>Enter the details of the new sub category</p>
              </div>
            </div>

            <div className="add_form">
              <label>
                <span>SubCategory Name (English)</span>
                <input
                  type="text"
                  placeholder="SubCategory English name..."
                  value={subEnName}
                  onChange={(e) => setSubEnName(e.target.value)}
                />
              </label>

              <label>
                <span>SubCategory Name (Arabic)</span>
                <input
                  type="text"
                  placeholder="SubCategory Arabic name..."
                  value={subArName}
                  onChange={(e) => setSubArName(e.target.value)}
                />
              </label>

              {/* IDs (hidden but stored) */}
              <input type="hidden" value={selectedCompanyId} />
              <input type="hidden" value={selectedCategoryId} />
            </div>

            <div className="add_btns">
              <button onClick={() => setOpenSubModal(false)}>Cancel</button>

              <button onClick={handleAddSubCategory}>
                {loading ? "Loading..." : "Add Sub Category"}
              </button>

              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
      {openShowSubModal && (
        <div className="add_category">
          <div
            className="overlay"
            onClick={() => setOpenShowSubModal(false)}
          ></div>

          <div className="add_category_container subcategory_list_container">
            <IoIosCloseCircleOutline
              onClick={() => setOpenShowSubModal(false)}
            />

            <div className="add_title">
              <img src={tierImage} alt="" />
              <div className="add_title_info">
                <h2>Sub Categories</h2>
                <p>Listing all sub categories for this category</p>
              </div>
            </div>

            <div className="Categories_table">
              <table>
                <thead>
                  <tr>
                    <th>EN Name</th>
                    <th>AR Name</th>
                    <th>Company ID</th>
                    <th>Category ID</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedSubCategories.length > 0 ? (
                    selectedSubCategories.map((sub) => (
                      <tr key={sub._id}>
                        <td>{sub.name.en}</td>
                        <td>{sub.name.ar}</td>
                        <td>{showCompanyName.en}</td>
                        <td>{showCategoryName.en}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No SubCategories Yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="add_btns">
              <button onClick={() => setOpenShowSubModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
