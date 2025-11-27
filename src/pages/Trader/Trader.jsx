import React from "react";
import "./Trader.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import AllRequest from "../../API/Request/AllRequest";
import building from "../../assets/building.png";
import { IoIosCloseCircleOutline } from "react-icons/io";
import AddTrader from "../../API/Trader/AddTrader";
import UpdateTrader from "../../API/Trader/UpdateTrader";
import DeleteTrader from "../../API/Trader/DeleteTrader";
const Trader = () => {
  useEffect(() => {
    getAllMerchants();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const getAllMerchants = () => {
    AllRequest(setAllRequests, setError, setLoading);
  };

  // add trader modal
  const [openTraderModal, setOpenTraderModal] = useState(false);
  const [TraderName, setTraderName] = useState("");
  const [TraderEmail, setTraderEmail] = useState("");
  const [TraderPassword, setTraderPassword] = useState("");
  const [TraderBusinessLicense, setTraderBusinessLicense] = useState("");
  const [TraderTaxCard, setTraderTaxCard] = useState("");
  const [TraderPhone, setTraderPhone] = useState("");
  const handleAddTrader = () => {
    const data = {
      name: TraderName,
      email: TraderEmail,
      password: TraderPassword,
      phone: TraderPhone,
      businessLicense: TraderBusinessLicense,
      taxCard: TraderTaxCard,
    };
    AddTrader(data, setError, setLoading, setOpenTraderModal, getAllMerchants);
  };

  // update trader modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editTrader, setEditTrader] = useState(null);

  // delete trader modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteTrader, setDeleteTrader] = useState(null);

  return (
    <div className="traders">
      <div className="traders_top">
        <input type="text" placeholder="search" />
        <button onClick={() => setOpenTraderModal(true)}>
          New Trader <FaPlus />
        </button>
      </div>
      <div className="traders_table">
        <table>
          <thead>
            <tr>
              <th>Trader</th>
              <th>Phone Number</th>
              <th>E-mail</th>
              <th>Phone</th>
              <th>Tax card</th>
              <th>License</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <div className="loading">
                <p>Loading Traders in progress...</p>
                <span class="loader"></span>
              </div>
            ) : (
              allRequests.map((req) => {
                return (
                  <tr key={req._id}>
                    <td>{req.name}</td>
                    <td>{req.phone}</td>
                    <td>{req.email}</td>
                    <td>{req.phone}</td>
                    <td>{req.taxCard}</td>
                    <td>{req.businessLicense}</td>
                    <td className="actions">
                      <RiDeleteBin6Line
                        className="delete_icon"
                        onClick={() => {
                          setDeleteTrader(req);
                          setOpenDeleteModal(true);
                        }}
                      />

                      <RiEditLine
                        className="edit_icon"
                        onClick={() => {
                          setEditTrader(req);
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
      {openTraderModal && (
        <div className="add_Trader">
          <div
            className="overlay"
            onClick={() => setOpenTraderModal(false)}
          ></div>
          <div className="add_Trader_container">
            <IoIosCloseCircleOutline
              onClick={() => setOpenTraderModal(false)}
            />
            <div className="add_title">
              <img src={building} alt="" />
              <div className="add_title_info">
                <h2>Add New Trader</h2>
                <p>Enter the details of the new Trader</p>
              </div>
            </div>
            <div className="add_form">
              <label>
                <span>Trader name</span>
                <input
                  type="text"
                  placeholder="sgi inc..."
                  value={TraderName}
                  onChange={(e) => setTraderName(e.target.value)}
                />
              </label>

              <label>
                <span>E-mail</span>
                <input
                  type="text"
                  placeholder="example@gmail.com"
                  value={TraderEmail}
                  onChange={(e) => setTraderEmail(e.target.value)}
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  type="text"
                  placeholder="5X XXX XXXX"
                  value={TraderPassword}
                  onChange={(e) => setTraderPassword(e.target.value)}
                />
              </label>
              <label>
                <span>Phone Number</span>
                <input
                  type="text"
                  placeholder="5X XXX XXXX"
                  value={TraderPhone}
                  onChange={(e) => setTraderPhone(e.target.value)}
                />
              </label>
              <label>
                <span>Business License</span>
                <input
                  type="text"
                  placeholder="022-6638999"
                  value={TraderBusinessLicense}
                  onChange={(e) => setTraderBusinessLicense(e.target.value)}
                />
              </label>
              <label>
                <span>Tax Card</span>
                <input
                  type="text"
                  placeholder="022-6638999"
                  value={TraderTaxCard}
                  onChange={(e) => setTraderTaxCard(e.target.value)}
                />
              </label>
            </div>
            <div className="add_btns">
              <button onClick={() => setOpenTraderModal(false)}>Cancel</button>
              <button onClick={handleAddTrader}>
                {loading ? "loading..." : "Add Trader"}
              </button>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
      {openEditModal && editTrader && (
        <div className="add_Trader">
          <div
            className="overlay"
            onClick={() => setOpenEditModal(false)}
          ></div>

          <div className="add_Trader_container">
            <IoIosCloseCircleOutline onClick={() => setOpenEditModal(false)} />

            <div className="add_title">
              <img src={building} alt="" />
              <div className="add_title_info">
                <h2>Edit Trader</h2>
                <p>Edit the details of the trader</p>
              </div>
            </div>

            <div className="add_form">
              <label>
                <span>Trader name</span>
                <input
                  type="text"
                  value={editTrader.name}
                  onChange={(e) =>
                    setEditTrader({ ...editTrader, name: e.target.value })
                  }
                />
              </label>

              <label>
                <span>E-mail</span>
                <input
                  type="text"
                  value={editTrader.email}
                  onChange={(e) =>
                    setEditTrader({ ...editTrader, email: e.target.value })
                  }
                />
              </label>

              <label>
                <span>Phone Number</span>
                <input
                  type="text"
                  value={editTrader.phone}
                  onChange={(e) =>
                    setEditTrader({ ...editTrader, phone: e.target.value })
                  }
                />
              </label>

              <label>
                <span>Business License</span>
                <input
                  type="text"
                  value={editTrader.businessLicense}
                  onChange={(e) =>
                    setEditTrader({
                      ...editTrader,
                      businessLicense: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                <span>Tax Card</span>
                <input
                  type="text"
                  value={editTrader.taxCard}
                  onChange={(e) =>
                    setEditTrader({ ...editTrader, taxCard: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="add_btns">
              <button onClick={() => setOpenEditModal(false)}>Cancel</button>

              <button
                onClick={() => {
                  UpdateTrader(
                    editTrader._id,
                    editTrader,
                    setError,
                    setLoading,
                    setOpenEditModal,
                    getAllMerchants
                  );
                }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
      {openDeleteModal && deleteTrader && (
        <div className="add_Trader">
          <div
            className="overlay"
            onClick={() => setOpenDeleteModal(false)}
          ></div>

          <div className="add_Trader_container delete_modal_container">
            <IoIosCloseCircleOutline
              onClick={() => setOpenDeleteModal(false)}
            />

            <div className="add_title">
              <img src={building} alt="" />
              <div className="add_title_info">
                <h2>Delete Trader</h2>
                <p>Are you sure you want to delete this trader?</p>
              </div>
            </div>

            <div className="delete_text">
              <p>
                Trader: <strong>{deleteTrader.name}</strong>
              </p>
              <p>
                Email: <strong>{deleteTrader.email}</strong>
              </p>
            </div>

            <div className="add_btns">
              <button onClick={() => setOpenDeleteModal(false)}>Cancel</button>

              <button
                className="delete_btn"
                onClick={() => {
                  DeleteTrader(
                    deleteTrader._id,
                    setError,
                    setLoading,
                    setOpenDeleteModal,
                    getAllMerchants
                  );
                }}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>

              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trader;
