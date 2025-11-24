import React from "react";
import "./SideNav.css";
import logo from "../../../assets/logo-black.png";
import { LuHouse } from "react-icons/lu";
import { HiOutlineUserAdd } from "react-icons/hi";
import { GrLocationPin } from "react-icons/gr";
import { FaRegBuilding } from "react-icons/fa";
import { TbCube } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineContactSupport } from "react-icons/md";
import { SlLogout } from "react-icons/sl";
import { Link, Links } from "react-router-dom";
import { PiTag } from "react-icons/pi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { FiUsers } from "react-icons/fi";

const SideNav = () => {
  return (
    <div className="sidenav">
      <div className="sidenav_container">
        <img src={logo} alt="logo" />
        <div className="menu">
          <h3>Main Menu</h3>
          <ul>
            <li>
              <Link to={"/"}>
                <LuHouse />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to={"/requests"}>
                <HiOutlineUserAdd />
                Requests
              </Link>
            </li>
            <li>
              <Link to={"/brands"}>
                <GrLocationPin />
                Brands
              </Link>
            </li>
            <li>
              <Link to={"/companies"}>
                <FaRegBuilding />
                Companies
              </Link>
            </li>
            <li>
              <Link to={"/categories"}>
                <HiOutlineSquares2X2 />
                Categories
              </Link>
            </li>
            <li>
              <Link to={"/products"}>
                <TbCube />
                Products
              </Link>
            </li>
            <li>
              <Link to={"/Tiers"}>
                <PiTag />
                Price Tiers
              </Link>
            </li>
            <li>
              <Link to={"/traders"}>
                <FiUsers />
                Traders
              </Link>
            </li>
          </ul>
        </div>
        <div className="general">
          <h3>General</h3>
          <ul>
            {/* <li>
              <IoSettingsOutline />
              Settings
            </li> */}
            <li>
              <MdOutlineContactSupport />
              Support
            </li>
          </ul>
        </div>
        <div className="Logout">
          <h3>
            <SlLogout />
            Logout
          </h3>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
