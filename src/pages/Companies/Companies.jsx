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

const Companies = () => {
  useEffect(() => {
    getAllCompanies();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCompanies, setAllCompanies] = useState([]);
  // add company function
  const [openCompanyModal, setOpenCompanyModal] = useState(false);
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
                <span class="loader"></span>
              </div>
            ) : (
              allCompanies.map((item) => {
                return (
                  <tr key={item._id}>
                    <td>{item.name.en}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>{item.taxCard}</td>
                    <td>{item.BusinessLicense}</td>
                    <td className="actions">
                      <RiDeleteBin6Line className="delete_icon" />
                      <RiEditLine className="edit_icon" />
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
                <span>Company name</span>
                <input type="text" placeholder="sgi inc..." />
              </label>
              <label>
                <span>E-mail</span>
                <input type="text" placeholder="example@gmail.com" />
              </label>
              <label>
                <span>Phone Number</span>
                <input type="text" placeholder="5X XXX XXXX" />
              </label>
              <label>
                <span>Business License</span>
                <input type="text" placeholder="022-6638999" />
              </label>
              <label>
                <span>Tax Card</span>
                <input type="text" placeholder="022-6638999" />
              </label>
            </div>
            <div className="add_btns">
              <button onClick={() => setOpenCompanyModal(false)}>Cancel</button>
              <button>Add Company</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
