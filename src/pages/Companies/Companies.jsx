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
import AddToDraftCompany from "../../API/Company/AddToDraftCompany";
import GetDraftedCompanies from "../../API/Company/GetDraftedCompanies";
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

  // draft company function (replaces delete)
  const [openAddToDraftModal, setOpenAddToDraftModal] = useState(false);
  const [draftCompany, setDraftCompany] = useState(null);
  const handleAddToDraft = () => {
    if (!draftCompany) return;
    AddToDraftCompany(
      setError,
      setLoading,
      setOpenAddToDraftModal,
      getAllCompanies,
      draftCompany._id
    );
  };
  const getAllCompanies = () => {
    CompanyApi(setAllCompanies, setError, setLoading);
  };

  // Drafted Companies Modal
  const [openDraftedCompaniesModal, setOpenDraftedCompaniesModal] =
    useState(false);
  const [draftedCompanies, setDraftedCompanies] = useState([]);
  const [draftedCompaniesLoading, setDraftedCompaniesLoading] = useState(false);
  const [draftedCompaniesError, setDraftedCompaniesError] = useState(null);
  const [restoringCompanyId, setRestoringCompanyId] = useState(null);

  const getDraftedCompanies = () => {
    GetDraftedCompanies(
      setDraftedCompanies,
      setDraftedCompaniesError,
      setDraftedCompaniesLoading
    );
  };

  const handleOpenDraftedCompanies = () => {
    setOpenDraftedCompaniesModal(true);
    getDraftedCompanies();
  };

  const handleRestoreCompany = async (companyId) => {
    setRestoringCompanyId(companyId);
    setDraftedCompaniesError(null);
    const token = localStorage.getItem("SGI_TOKEN");
    const URL = `https://sgi-dy1p.onrender.com/api/v1/company/draft/${companyId}`;

    try {
      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          "x-is-dashboard": true,
          authorization: `sgiQ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setOpenDraftedCompaniesModal(false);
        getAllCompanies();
        setRestoringCompanyId(null);
      } else {
        setDraftedCompaniesError(result.message || "Failed to restore company");
        setRestoringCompanyId(null);
      }
    } catch (error) {
      setDraftedCompaniesError("An error occurred while restoring company");
      setRestoringCompanyId(null);
    }
  };
  return (
    <div className="companies">
      <div className="companies_top">
        <input type="text" placeholder="search" />
        <div className="companies_top_btns">
          <button onClick={handleOpenDraftedCompanies}>Draft Companies</button>
          <button onClick={() => setOpenCompanyModal(true)}>
            New Company <FaPlus />
          </button>
        </div>
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
                          setDraftCompany(item);
                          setOpenAddToDraftModal(true);
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
      {openAddToDraftModal && draftCompany && (
        <div className="add_company">
          <div
            className="overlay"
            onClick={() => setOpenAddToDraftModal(false)}
          ></div>

          <div className="delete_modal_container draft_modal_container">
            <IoIosCloseCircleOutline
              onClick={() => setOpenAddToDraftModal(false)}
              className="close_delete_icon"
            />

            <div className="draft_warning_icon">⚠️</div>
            <h2>Move to Draft</h2>
            <p className="draft_warning_text">
              Are you sure you want to move{" "}
              <strong>
                "
                {draftCompany.name?.en ||
                  draftCompany.name?.ar ||
                  draftCompany.name ||
                  "this company"}
                "
              </strong>{" "}
              to draft?
            </p>
            <p className="draft_info_text">
              This company will be moved to the draft section and will not be
              visible in the main company list.
            </p>

            <div className="delete_details">
              <strong>Company Name:</strong>
              <span>
                {draftCompany.name?.en ||
                  draftCompany.name?.ar ||
                  draftCompany.name ||
                  "N/A"}
              </span>
            </div>

            <div className="delete_btns">
              <button onClick={() => setOpenAddToDraftModal(false)}>
                Cancel
              </button>

              <button
                className="draft_confirm_btn"
                onClick={handleAddToDraft}
                disabled={loading}
              >
                {loading ? "Moving to Draft..." : "Move to Draft"}
              </button>
            </div>

            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}

      {/* Drafted Companies Modal */}
      {openDraftedCompaniesModal && (
        <div className="add_company">
          <div
            className="overlay"
            onClick={() => setOpenDraftedCompaniesModal(false)}
          ></div>

          <div className="drafted_companies_modal">
            <IoIosCloseCircleOutline
              className="close_draft_icon"
              onClick={() => setOpenDraftedCompaniesModal(false)}
            />
            <div className="drafted_companies_header">
              <h2>Drafted Companies</h2>
              <p>All companies that have been moved to draft</p>
            </div>

            <div className="drafted_companies_content">
              {draftedCompaniesLoading ? (
                <div className="loading">
                  <p>Loading drafted companies...</p>
                  <span className="loader"></span>
                </div>
              ) : draftedCompaniesError ? (
                <div className="draft_error_message">
                  {draftedCompaniesError}
                </div>
              ) : draftedCompanies && draftedCompanies.length > 0 ? (
                <div className="drafted_companies_list">
                  {draftedCompanies.map((company) => (
                    <div className="drafted_company_item" key={company._id}>
                      <div className="drafted_company_info">
                        <h3>
                          {company.name?.en ||
                            company.name?.ar ||
                            company.name ||
                            "N/A"}
                        </h3>
                        {company.name?.ar && company.name?.en && (
                          <p className="drafted_company_ar">
                            {company.name.ar}
                          </p>
                        )}
                        <div className="drafted_company_details">
                          {company.company_id && (
                            <p>
                              <strong>Company ID:</strong> {company.company_id}
                            </p>
                          )}
                          {company.email && (
                            <p>
                              <strong>Email:</strong> {company.email}
                            </p>
                          )}
                          {company.phone && (
                            <p>
                              <strong>Phone:</strong> {company.phone}
                            </p>
                          )}
                          {company.taxCard && (
                            <p>
                              <strong>Tax Card:</strong> {company.taxCard}
                            </p>
                          )}
                          {company.BusinessLicense && (
                            <p>
                              <strong>Business License:</strong>{" "}
                              {company.BusinessLicense}
                            </p>
                          )}
                          {company.createdAt && (
                            <p>
                              <strong>Created:</strong>{" "}
                              {new Date(company.createdAt).toLocaleDateString()}
                            </p>
                          )}
                          {company.updatedAt && (
                            <p>
                              <strong>Updated:</strong>{" "}
                              {new Date(company.updatedAt).toLocaleDateString()}
                            </p>
                          )}
                          {company.isDeleted && (
                            <p className="draft_status">
                              <strong>Status:</strong>{" "}
                              <span className="draft_badge">Drafted</span>
                            </p>
                          )}
                        </div>
                        <div className="drafted_company_actions">
                          <button
                            className="restore_company_btn"
                            onClick={() => handleRestoreCompany(company._id)}
                            disabled={restoringCompanyId === company._id}
                          >
                            {restoringCompanyId === company._id
                              ? "Restoring..."
                              : "Restore"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no_drafted_companies">
                  <p>No drafted companies found</p>
                </div>
              )}
            </div>

            <div className="drafted_companies_footer">
              <button onClick={() => setOpenDraftedCompaniesModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
