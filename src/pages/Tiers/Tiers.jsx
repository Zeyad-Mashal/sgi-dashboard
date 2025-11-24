import React from "react";
import "./Tiers.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { PiTag } from "react-icons/pi";
import { RiEdit2Line } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import PriceTier from "../../API/PriceTier/PriceTier";
import { IoIosCloseCircleOutline } from "react-icons/io";
import tierImage from "../../assets/tier.png";
import AddTier from "../../API/PriceTier/AddTier";
import UpdateTier from "../../API/PriceTier/UpdateTier";
import DeleteTier from "../../API/PriceTier/DeleteTier";
const Tiers = () => {
  useEffect(() => {
    getAllTiers();
  }, []);
  // get all tiers
  const [allTiers, setAllTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const getAllTiers = () => {
    PriceTier(setAllTiers, setError, setLoading);
  };
  // add tier model
  const [openTiersModel, setopenTiersModel] = useState(false);
  const [tierName, setTierName] = useState("");
  const handleAddTier = () => {
    const data = {
      name: tierName,
    };
    AddTier(data, setError, setLoading, setopenTiersModel, getAllTiers);
  };

  // edit tier modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editTierName, setEditTierName] = useState("");
  const [editTierId, setEditTierId] = useState(null);
  const handleEditTier = () => {
    const data = {
      name: editTierName,
    };

    UpdateTier(
      editTierId,
      data,
      setError,
      setLoading,
      setOpenEditModal,
      getAllTiers
    );
  };

  // delete tier modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteTierId, setDeleteTierId] = useState(null);
  const [deleteTierName, setDeleteTierName] = useState("");

  const handleDeleteTier = () => {
    DeleteTier(
      deleteTierId,
      setError,
      setLoading,
      setOpenDeleteModal,
      getAllTiers
    );
  };

  return (
    <div className="Tiers">
      <div className="Tiers_top">
        <input type="text" placeholder="search" />
        <button onClick={() => setopenTiersModel(true)}>
          New Tier <FaPlus />
        </button>
      </div>
      <div className="tier_list">
        {loading ? (
          <div className="loading">
            <p>Loading Price Tiers in progress...</p>
            <span class="loader"></span>
          </div>
        ) : (
          allTiers.map((tier) => {
            return (
              <div className="tier_item" key={tier._id}>
                <div className="tire_title">
                  <PiTag />
                  <h2>{tier.name}</h2>
                </div>
                <div className="tier_btns">
                  <button
                    className="delete_btn"
                    onClick={() => {
                      setOpenDeleteModal(true);
                      setDeleteTierId(tier._id);
                      setDeleteTierName(tier.name); // <<< مهم
                    }}
                  >
                    <RiDeleteBin6Line />
                    Delete
                  </button>

                  <button
                    className="edit_btn"
                    onClick={() => {
                      setOpenEditModal(true);
                      setEditTierName(tier.name);
                      setEditTierId(tier._id);
                    }}
                  >
                    <RiEdit2Line />
                    Edit
                  </button>
                </div>
              </div>
            );
          })
        )}
        {error && <p className="error_message">{error}</p>}
      </div>
      {openTiersModel && (
        <div className="add_Tier">
          <div
            className="overlay"
            onClick={() => setopenTiersModel(false)}
          ></div>
          <div className="add_Tier_container">
            <IoIosCloseCircleOutline onClick={() => setopenTiersModel(false)} />
            <div className="add_title">
              <img src={tierImage} alt="" />
              <div className="add_title_info">
                <h2>Add New Tier</h2>
                <p>Enter the details of the new Tier</p>
              </div>
            </div>
            <div className="add_form">
              <label>
                <span>Tier name (عربي)</span>
                <input
                  type="text"
                  placeholder="sgi inc..."
                  value={tierName}
                  onChange={(e) => setTierName(e.target.value)}
                />
              </label>
            </div>
            <div className="add_btns">
              <button onClick={() => setopenTiersModel(false)}>Cancel</button>
              <button onClick={handleAddTier}>
                {loading ? "loading..." : "Add Tier"}
              </button>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
      {openEditModal && (
        <div className="add_Tier">
          <div
            className="overlay"
            onClick={() => setOpenEditModal(false)}
          ></div>
          <div className="add_Tier_container">
            <IoIosCloseCircleOutline onClick={() => setOpenEditModal(false)} />

            <div className="add_title">
              <img src={tierImage} alt="" />
              <div className="add_title_info">
                <h2>Edit Tier</h2>
                <p>Update the Tier details</p>
              </div>
            </div>

            <div className="add_form">
              <label>
                <span>Tier name (عربي)</span>
                <input
                  type="text"
                  value={editTierName}
                  onChange={(e) => setEditTierName(e.target.value)}
                />
              </label>
            </div>

            <div className="add_btns">
              <button onClick={() => setOpenEditModal(false)}>Cancel</button>
              <button onClick={handleEditTier}>
                {loading ? "loading..." : "Save Changes"}
              </button>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
      {openDeleteModal && (
        <div className="add_Tier">
          <div
            className="overlay"
            onClick={() => setOpenDeleteModal(false)}
          ></div>

          <div className="add_Tier_container">
            <IoIosCloseCircleOutline
              onClick={() => setOpenDeleteModal(false)}
            />

            <div className="add_title">
              <img src={tierImage} alt="" />
              <div className="add_title_info">
                <h2>Delete Tier</h2>
                <p>Are you sure you want to delete this tier?</p>
              </div>
            </div>

            <div className="add_form">
              <label>
                <span>Tier Name</span>
                <input
                  type="text"
                  value={deleteTierName}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </label>
            </div>

            <div className="add_btns">
              <button onClick={() => setOpenDeleteModal(false)}>Cancel</button>
              <button
                style={{ backgroundColor: "red", color: "#fff" }}
                onClick={handleDeleteTier}
              >
                {loading ? "loading..." : "Delete"}
              </button>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tiers;
