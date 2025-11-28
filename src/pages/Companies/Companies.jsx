import React from "react";
import "./Companies.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import CompanyApi from "../../API/Company/CompanyApi";
import { BsBuildingAdd } from "react-icons/bs";
import building from "../../assets/building.png";
import { IoIosCloseCircleOutline } from "react-icons/io";
import AddCompany from "../../API/Company/AddCompany";
import UpdateCompany from "../../API/Company/UpdateCompany";
import DeleteCompnay from "../../API/Company/DeleteCompnay";
const Companies = () => {
  useEffect(() => {
    getAllCompanies();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCompanies, setAllCompanies] = useState([]);
  // add company function
  const [openCompanyModal, setOpenCompanyModal] = useState(false);
  const [companyNameAr, setCompanyNameAr] = useState("");
  const [companyNameEn, setCompanyNameEn] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyTaxCard, setCompanyTaxCard] = useState("");
  const [companyBusinessLicense, setCompanyBusinessLicense] = useState("");
  const handleAddCompany = () => {
    const data = {
      arName: companyNameAr,
      enName: companyNameEn,
      email: companyEmail,
      phone: companyPhone,
      taxCard: companyTaxCard,
      BusinessLicense: companyBusinessLicense,
    };
    AddCompany(
      data,
      setError,
      setLoading,
      setOpenCompanyModal,
      getAllCompanies
    );
  };
  // update company function
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const handleUpdateCompany = () => {
    const data = {
      arName: selectedCompany.name.ar,
      enName: selectedCompany.name.en,
      email: selectedCompany.email,
      phone: selectedCompany.phone,
      taxCard: selectedCompany.taxCard,
      BusinessLicense: selectedCompany.BusinessLicense,
    };
    UpdateCompany(
      data,
      setError,
      setLoading,
      setOpenEditModal,
      getAllCompanies,
      selectedCompany._id
    );
  };

  // delete company function
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteCompany, setDeleteCompany] = useState(null);
  const handleDeleteCompany = () => {
    DeleteCompnay(
      setError,
      setLoading,
      setOpenDeleteModal,
      getAllCompanies,
      deleteCompany._id
    );
  };
  const getAllCompanies = () => {
    CompanyApi(setAllCompanies, setError, setLoading);
  };
  return (
    <div className="companies">
      <div className="companies_top">
        <input type="text" placeholder="search" />
        <button onClick={() => setOpenCompanyModal(true)}>
          New Company <FaPlus />
        </button>
      </div>
      <div className="companies_table">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>الشركه</th>
              <th>Phone Number</th>
              <th>E-mail</th>
              <th>Tax card</th>
              <th>License</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <div className="loading">
                <p>Loading Companies in progress...</p>
                <span className="loader"></span>
              </div>
            ) : (
              allCompanies.map((item) => {
                return (
                  <tr key={item._id}>
                    <td>{item.name.en}</td>
                    <td>{item.name.ar}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>{item.taxCard}</td>
                    <td>{item.BusinessLicense}</td>
                    <td className="actions">
                      <RiDeleteBin6Line
                        className="delete_icon"
                        onClick={() => {
                          setDeleteCompany(item);
                          setOpenDeleteModal(true);
                        }}
                      />

                      <RiEditLine
                        className="edit_icon"
                        onClick={() => {
                          setSelectedCompany(item);
                          setOpenEditModal(true);
                        }}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {openCompanyModal && (
        <div className="add_company">
          <div
            className="overlay"
            onClick={() => setOpenCompanyModal(false)}
          ></div>
          <div className="add_company_container">
            <IoIosCloseCircleOutline
              onClick={() => setOpenCompanyModal(false)}
            />
            <div className="add_title">
              <img src={building} alt="" />
              <div className="add_title_info">
                <h2>Add New Company</h2>
                <p>Enter the details of the new company</p>
              </div>
            </div>
            <div className="add_form">
              <label>
                <span>Company name (عربي)</span>
                <input
                  type="text"
                  placeholder="sgi inc..."
                  value={companyNameAr}
                  onChange={(e) => setCompanyNameAr(e.target.value)}
                />
              </label>
              <label>
                <span>Company name (EN)</span>
                <input
                  type="text"
                  placeholder="sgi inc..."
                  value={companyNameEn}
                  onChange={(e) => setCompanyNameEn(e.target.value)}
                />
              </label>

              <label>
                <span>E-mail</span>
                <input
                  type="text"
                  placeholder="example@gmail.com"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </label>
              <label>
                <span>Phone Number</span>
                <input
                  type="text"
                  placeholder="5X XXX XXXX"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                />
              </label>
              <label>
                <span>Business License</span>
                <input
                  type="text"
                  placeholder="022-6638999"
                  value={companyBusinessLicense}
                  onChange={(e) => setCompanyBusinessLicense(e.target.value)}
                />
              </label>
              <label>
                <span>Tax Card</span>
                <input
                  type="text"
                  placeholder="022-6638999"
                  value={companyTaxCard}
                  onChange={(e) => setCompanyTaxCard(e.target.value)}
                />
              </label>
            </div>
            <div className="add_btns">
              <button onClick={() => setOpenCompanyModal(false)}>Cancel</button>
              <button onClick={handleAddCompany}>
                {loading ? "loading..." : "Add Company"}
              </button>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
      {openEditModal && selectedCompany && (
        <div className="add_company">
          <div
            className="overlay"
            onClick={() => setOpenEditModal(false)}
          ></div>

          <div className="add_company_container">
            <IoIosCloseCircleOutline onClick={() => setOpenEditModal(false)} />

            <div className="add_title">
              <img src={building} alt="" />
              <div className="add_title_info">
                <h2>Edit Company</h2>
                <p>Update company information</p>
              </div>
            </div>

            <div className="add_form">
              <label>
                <span>Company name (عربي)</span>
                <input
                  type="text"
                  value={selectedCompany.name.ar}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      name: { ...selectedCompany.name, ar: e.target.value },
                    })
                  }
                />
              </label>

              <label>
                <span>Company name (EN)</span>
                <input
                  type="text"
                  value={selectedCompany.name.en}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      name: { ...selectedCompany.name, en: e.target.value },
                    })
                  }
                />
              </label>

              <label>
                <span>E-mail</span>
                <input
                  type="text"
                  value={selectedCompany.email}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      email: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                <span>Phone Number</span>
                <input
                  type="text"
                  value={selectedCompany.phone}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      phone: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                <span>Business License</span>
                <input
                  type="text"
                  value={selectedCompany.BusinessLicense}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      BusinessLicense: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                <span>Tax Card</span>
                <input
                  type="text"
                  value={selectedCompany.taxCard}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      taxCard: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="add_btns">
              <button onClick={() => setOpenEditModal(false)}>Cancel</button>
              <button onClick={handleUpdateCompany}>
                {loading ? "Updating..." : "Save Changes"}
              </button>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
      {openDeleteModal && (
        <div className="add_company">
          <div
            className="overlay"
            onClick={() => setOpenDeleteModal(false)}
          ></div>

          <div className="delete_modal_container">
            <IoIosCloseCircleOutline
              onClick={() => setOpenDeleteModal(false)}
              className="close_delete_icon"
            />

            <h2>Delete Company</h2>
            <p>Are you sure you want to delete this company?</p>

            <div className="delete_details">
              <strong>Company Name:</strong>
              <span>{deleteCompany.name.en}</span>
            </div>

            <div className="delete_btns">
              <button onClick={() => setOpenDeleteModal(false)}>Cancel</button>

              <button className="delete_company" onClick={handleDeleteCompany}>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>

            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
