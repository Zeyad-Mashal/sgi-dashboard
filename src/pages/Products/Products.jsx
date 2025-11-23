import React from "react";
import "./Products.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import p1d from "../../assets/p1d.jpg";
const Products = () => {
  return (
    <div className="products">
      <div className="products_top">
        <input type="text" placeholder="search" />
        <button>
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
            {/* <div className="loading">
                <p>Loading Products in progress...</p>
                <span class="loader"></span>
              </div> */}
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
    </div>
  );
};

export default Products;
