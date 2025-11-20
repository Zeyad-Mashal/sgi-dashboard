import React from "react";
import "./Companies.css";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
const Companies = () => {
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
            <tr>
              <td>Tech style group</td>
              <td>022-6638999</td>
              <td>contact@techstyle.com</td>
              <td>Tax-2024-00</td>
              <td>License-2024</td>
              <td className="actions">
                <RiDeleteBin6Line className="delete_icon" />
                <RiEditLine className="edit_icon" />
              </td>
            </tr>

            <tr>
              <td>Tech style group</td>
              <td>022-6638999</td>
              <td>contact@techstyle.com</td>
              <td>Tax-2024-00</td>
              <td>License-2024</td>
              <td className="actions">
                <RiDeleteBin6Line className="delete_icon" />
                <RiEditLine className="edit_icon" />
              </td>
            </tr>

            <tr>
              <td>Tech style group</td>
              <td>022-6638999</td>
              <td>contact@techstyle.com</td>
              <td>Tax-2024-00</td>
              <td>License-2024</td>
              <td className="actions">
                <RiDeleteBin6Line className="delete_icon" />
                <RiEditLine className="edit_icon" />
              </td>
            </tr>
            <tr>
              <td>Tech style group</td>
              <td>022-6638999</td>
              <td>contact@techstyle.com</td>
              <td>Tax-2024-00</td>
              <td>License-2024</td>
              <td className="actions">
                <RiDeleteBin6Line className="delete_icon" />
                <RiEditLine className="edit_icon" />
              </td>
            </tr>
            <tr>
              <td>Tech style group</td>
              <td>022-6638999</td>
              <td>contact@techstyle.com</td>
              <td>Tax-2024-00</td>
              <td>License-2024</td>
              <td className="actions">
                <RiDeleteBin6Line className="delete_icon" />
                <RiEditLine className="edit_icon" />
              </td>
            </tr>
            <tr>
              <td>Tech style group</td>
              <td>022-6638999</td>
              <td>contact@techstyle.com</td>
              <td>Tax-2024-00</td>
              <td>License-2024</td>
              <td className="actions">
                <RiDeleteBin6Line className="delete_icon" />
                <RiEditLine className="edit_icon" />
              </td>
            </tr>
            <tr>
              <td>Tech style group</td>
              <td>022-6638999</td>
              <td>contact@techstyle.com</td>
              <td>Tax-2024-00</td>
              <td>License-2024</td>
              <td className="actions">
                <RiDeleteBin6Line className="delete_icon" />
                <RiEditLine className="edit_icon" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Companies;
