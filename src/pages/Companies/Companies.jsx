import React from "react";
import "./Companies.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import CompanyApi from "../../API/Company/CompanyApi";
const Companies = () => {
  useEffect(() => {
    getAllCompanies();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCompanies, setAllCompanies] = useState([]);
  const getAllCompanies = () => {
    CompanyApi(setAllCompanies, setError, setLoading);
  };
  return (
    <div className="companies">
      <div className="companies_top">
        <input type="text" placeholder="search" />
        <button>
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
    </div>
  );
};

export default Companies;
