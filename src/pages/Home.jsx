import "./Home.css";
import Kpis from "../API/Kpis/Kpis";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import status1 from "../assets/status.png";
import status2 from "../assets/status2.png";
import AllRequest from "../API/Request/AllRequest";
import GetTraderKpis from "../API/Kpis/GetTraderKpis";
import GetProducts from "../API/Products/GetProducts";
import GetProductKpis from "../API/Kpis/GetProductKpis";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function Home() {
  const navigate = useNavigate();
  const [kpi, setKpi] = useState(null);
  const [previousKpi, setPreviousKpi] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [traders, setTraders] = useState([]);
  const [tradersKpis, setTradersKpis] = useState({});
  const [tradersLoading, setTradersLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsKpis, setProductsKpis] = useState({});
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductStatusModal, setShowProductStatusModal] = useState(false);
  const [selectedProductKpi, setSelectedProductKpi] = useState(null);

  // Calculate default dates (last 7 days)
  const getDefaultEndDate = () => new Date().toISOString().split("T")[0];
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());

  // Calculate previous period dates (7 days before the selected period)
  const getPreviousPeriodDates = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - diffDays);

    return {
      prevStart: prevStart.toISOString().split("T")[0],
      prevEnd: prevEnd.toISOString().split("T")[0],
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Kpis(setKpi, setError, setLoading, startDate, endDate);

      // Fetch previous period data for comparison
      const { prevStart, prevEnd } = getPreviousPeriodDates();
      await Kpis(setPreviousKpi, setError, () => {}, prevStart, prevEnd);
    };

    fetchData();
  }, [startDate, endDate]);

  // Fetch traders and their KPIs
  useEffect(() => {
    const fetchTraders = async () => {
      setTradersLoading(true);

      await AllRequest(
        (merchants) => {
          setTraders(merchants);
          // Fetch KPIs for each trader
          merchants.forEach((merchant) => {
            GetTraderKpis(
              (kpiData) => {
                setTradersKpis((prev) => ({
                  ...prev,
                  [merchant._id]: kpiData.result || kpiData,
                }));
              },
              (err) => {
                console.error(
                  `Error fetching KPI for trader ${merchant._id}:`,
                  err
                );
              },
              () => {},
              startDate,
              endDate,
              merchant._id
            );
          });
          setTradersLoading(false);
        },
        (err) => {
          console.error("Error fetching traders:", err);
          setTradersLoading(false);
        },
        () => {}
      );
    };

    fetchTraders();
  }, [startDate, endDate]);

  // Fetch products and their KPIs
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);

      await GetProducts(
        (productsList) => {
          setProducts(productsList || []);
          // Fetch KPIs for each product
          if (productsList && productsList.length > 0) {
            productsList.forEach((product) => {
              GetProductKpis(
                (kpiData) => {
                  setProductsKpis((prev) => ({
                    ...prev,
                    [product._id]: kpiData.result || kpiData,
                  }));
                },
                (err) => {
                  console.error(
                    `Error fetching KPI for product ${product._id}:`,
                    err
                  );
                },
                () => {},
                startDate,
                endDate,
                product._id
              );
            });
          }
          setProductsLoading(false);
        },
        (err) => {
          console.error("Error fetching products:", err);
          setProductsLoading(false);
        },
        () => {}
      );
    };

    fetchProducts();
  }, [startDate, endDate]);

  // Calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  // Get ratio class name based on positive/negative change
  const getRatioClassName = (current, previous) => {
    const change = parseFloat(calculatePercentageChange(current, previous));
    return change >= 0 ? "ratio_positive" : "ratio_negative";
  };

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    return num.toLocaleString();
  };

  // Format currency
  const formatCurrency = (num) => {
    if (num === null || num === undefined) return "0";
    return `AED ${num.toLocaleString()}`;
  };

  // Handle product click to show status
  const handleProductClick = async (product) => {
    setSelectedProduct(product);
    setShowProductStatusModal(true);

    // Fetch KPI for the selected product
    setSelectedProductKpi(null);
    await GetProductKpis(
      (kpiData) => {
        setSelectedProductKpi(kpiData.result || kpiData);
      },
      (err) => {
        console.error("Error fetching product KPI:", err);
      },
      () => {},
      startDate,
      endDate,
      product._id
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard_container">
        {/* Date Picker Section */}
        <div className="date_picker_section">
          <div className="date_picker_item">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date_input"
            />
          </div>
          <div className="date_picker_item">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date_input"
            />
          </div>
        </div>

        <div className="dashboard_header">
          {/* Total Orders */}
          <div className="header_item">
            <div className="item_top">
              <h2>Total Orders</h2>
            </div>
            <p>
              {startDate} to {endDate}
            </p>
            <div className="header_bottom">
              <h1>
                {formatNumber(kpi?.totalOrders)}
                {previousKpi?.totalOrders && (
                  <span
                    className={getRatioClassName(
                      kpi?.totalOrders || 0,
                      previousKpi?.totalOrders || 0
                    )}
                  >
                    {" "}
                    {calculatePercentageChange(
                      kpi?.totalOrders || 0,
                      previousKpi?.totalOrders || 0
                    ) > 0
                      ? "+"
                      : ""}
                    {calculatePercentageChange(
                      kpi?.totalOrders || 0,
                      previousKpi?.totalOrders || 0
                    )}
                    %
                  </span>
                )}
              </h1>
              <span>
                Previous 7 days: {formatNumber(previousKpi?.totalOrders || 0)}
              </span>
            </div>
            <img src={status1} alt="status" />
          </div>

          {/* Total Revenue */}
          <div className="header_item">
            <div className="item_top">
              <h2>Total Revenue</h2>
            </div>
            <p>
              {startDate} to {endDate}
            </p>
            <div className="header_bottom">
              <h1>
                {formatCurrency(kpi?.totalRevenue || 0)}
                {previousKpi?.totalRevenue && (
                  <span
                    className={getRatioClassName(
                      kpi?.totalRevenue || 0,
                      previousKpi?.totalRevenue || 0
                    )}
                  >
                    {" "}
                    {calculatePercentageChange(
                      kpi?.totalRevenue || 0,
                      previousKpi?.totalRevenue || 0
                    ) > 0
                      ? "+"
                      : ""}
                    {calculatePercentageChange(
                      kpi?.totalRevenue || 0,
                      previousKpi?.totalRevenue || 0
                    )}
                    %
                  </span>
                )}
              </h1>
              <span>
                Previous 7 days:{" "}
                {formatCurrency(previousKpi?.totalRevenue || 0)}
              </span>
            </div>
            <img src={status2} alt="status" />
          </div>

          {/* New Orders */}
          <div className="header_item">
            <div className="item_top">
              <h2>New Orders</h2>
            </div>
            <p>
              {startDate} to {endDate}
            </p>
            <div className="header_bottom">
              <h1>{formatNumber(kpi?.newOrders)}</h1>

              <span>
                Previous 7 days: {formatNumber(previousKpi?.newOrders || 0)}
              </span>
            </div>
            <img src={status1} alt="status" />
          </div>
        </div>

        <div className="dashboard_header">
          {/* Success Orders */}
          <div className="header_item">
            <div className="item_top">
              <h2>Success Orders</h2>
            </div>
            <p>
              {startDate} to {endDate}
            </p>
            <div className="header_bottom">
              <h1>
                {formatNumber(kpi?.successOrders || 0)}
                {previousKpi?.successOrders && (
                  <span
                    className={getRatioClassName(
                      kpi?.successOrders || 0,
                      previousKpi?.successOrders || 0
                    )}
                  >
                    {" "}
                    {calculatePercentageChange(
                      kpi?.successOrders || 0,
                      previousKpi?.successOrders || 0
                    ) > 0
                      ? "+"
                      : ""}
                    {calculatePercentageChange(
                      kpi?.successOrders || 0,
                      previousKpi?.successOrders || 0
                    )}
                    %
                  </span>
                )}
              </h1>
              <span>
                Previous 7 days: {formatNumber(previousKpi?.successOrders || 0)}
              </span>
            </div>
            <img src={status2} alt="status" />
          </div>

          {/* Pending & Canceled */}
          <div className="header_item">
            <div className="item_top">
              <h2>Pending & Canceled</h2>
            </div>
            <p>
              {startDate} to {endDate}
            </p>
            <div className="header_bottom_pending">
              <div className="header_bottom_box">
                <h3>Pending</h3>
                <p>{formatNumber(kpi?.processingOrders || 0)}</p>
                {previousKpi?.processingOrders && (
                  <span className="ratio_text">
                    Previous: {formatNumber(previousKpi?.processingOrders || 0)}
                  </span>
                )}
              </div>
              <div className="header_bottom_box">
                <h3>Canceled</h3>
                <p>{formatNumber(kpi?.canceledOrders || 0)}</p>
                {previousKpi?.canceledOrders && (
                  <span className="ratio_text">
                    Previous: {formatNumber(previousKpi?.canceledOrders || 0)}
                  </span>
                )}
              </div>
            </div>
            <img src={status1} alt="status" />
          </div>

          {/* Merchants */}
          <div className="header_item">
            <div className="item_top">
              <h2>Total Merchants</h2>
            </div>
            <p>
              {startDate} to {endDate}
            </p>
            <div className="header_bottom">
              <h1>
                {formatNumber(kpi?.merchants || 0)}
                {previousKpi?.merchants && (
                  <span
                    className={getRatioClassName(
                      kpi?.merchants || 0,
                      previousKpi?.merchants || 0
                    )}
                  >
                    {" "}
                    {calculatePercentageChange(
                      kpi?.merchants || 0,
                      previousKpi?.merchants || 0
                    ) > 0
                      ? "+"
                      : ""}
                    {calculatePercentageChange(
                      kpi?.merchants || 0,
                      previousKpi?.merchants || 0
                    )}
                    %
                  </span>
                )}
              </h1>
              <span>
                Previous 7 days: {formatNumber(previousKpi?.merchants || 0)}
              </span>
            </div>
            <img src={status2} alt="status" />
          </div>
        </div>

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">Error: {error}</div>}

        {/* Traders Table Section */}
        <div className="traders_section">
          <div className="traders_section_header">
            <h2>Traders Overview</h2>
            <button
              className="view_all_btn"
              onClick={() => navigate("/traders")}
            >
              View All
            </button>
          </div>

          <div className="traders_table_container">
            {tradersLoading ? (
              <div className="loading">Loading Traders...</div>
            ) : (
              <table className="traders_overview_table">
                <thead>
                  <tr>
                    <th>Trader Name</th>
                    <th>Phone</th>
                    <th>Total Orders</th>
                    <th>Total Items</th>
                    <th>Total Revenue</th>
                    <th>Avg Order Value</th>
                  </tr>
                </thead>
                <tbody>
                  {traders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No traders found
                      </td>
                    </tr>
                  ) : (
                    traders.map((trader) => {
                      const traderKpi = tradersKpis[trader._id];
                      return (
                        <tr key={trader._id}>
                          <td>{trader.name || "N/A"}</td>
                          <td>{trader.phone || "N/A"}</td>
                          <td>{traderKpi?.totalOrders || 0}</td>
                          <td>{traderKpi?.totalItemsPurchased || 0}</td>
                          <td>
                            {formatCurrency(traderKpi?.totalRevenue || 0)}
                          </td>
                          <td>
                            {formatCurrency(traderKpi?.avgOrderValue || 0)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="traders_section">
          <div className="traders_section_header">
            <h2>Products Overview</h2>
            <button
              className="view_all_btn"
              onClick={() => navigate("/products")}
            >
              View All
            </button>
          </div>

          <div className="traders_table_container">
            {productsLoading ? (
              <div className="loading">Loading Products...</div>
            ) : (
              <table className="traders_overview_table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Categories</th>
                    <th>Total Quantity Sold</th>
                    <th>Total Revenue</th>
                    <th>Avg Selling Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No products found
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const productKpi = productsKpis[product._id];
                      return (
                        <tr
                          key={product._id}
                          onClick={() => handleProductClick(product)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{product?.name?.en || product?.name || "N/A"}</td>
                          <td>
                            {product.categories
                              ?.map((cat) => cat?.name?.en)
                              .join(", ")}
                          </td>
                          <td>{productKpi?.totalQuantitySold || 0}</td>
                          <td>
                            {formatCurrency(productKpi?.totalRevenue || 0)}
                          </td>
                          <td>
                            {formatCurrency(productKpi?.avgSellingPrice || 0)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Product Status Modal */}
        {showProductStatusModal && selectedProduct && (
          <div className="product_status_modal">
            <div
              className="overlay"
              onClick={() => {
                setShowProductStatusModal(false);
                setSelectedProduct(null);
                setSelectedProductKpi(null);
              }}
            ></div>

            <div className="product_status_modal_container">
              <IoIosCloseCircleOutline
                className="close_status_icon"
                onClick={() => {
                  setShowProductStatusModal(false);
                  setSelectedProduct(null);
                  setSelectedProductKpi(null);
                }}
              />

              <div className="product_status_content">
                <h2>Product Status</h2>
                <div className="product_status_info">
                  <div className="product_status_item">
                    <span className="status_label">Product Name:</span>
                    <span className="status_value">
                      {selectedProduct?.name?.en ||
                        selectedProduct?.name ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="product_status_item">
                    <span className="status_label">SKU:</span>
                    <span className="status_value">
                      {selectedProductKpi?.sku || selectedProduct?._id || "N/A"}
                    </span>
                  </div>
                  {selectedProduct?.brand && (
                    <div className="product_status_item">
                      <span className="status_label">Brand:</span>
                      <span className="status_value">
                        {selectedProduct?.brand?.name?.en ||
                          selectedProduct?.brand?.name ||
                          "N/A"}
                      </span>
                    </div>
                  )}
                </div>

                {selectedProductKpi ? (
                  <div className="product_kpi_display">
                    <div className="kpi_card">
                      <div className="kpi_label">Total Quantity Sold</div>
                      <div className="kpi_value">
                        {selectedProductKpi.totalQuantitySold || 0}
                      </div>
                    </div>
                    <div className="kpi_card">
                      <div className="kpi_label">Total Revenue</div>
                      <div className="kpi_value">
                        {formatCurrency(selectedProductKpi.totalRevenue || 0)}
                      </div>
                    </div>
                    <div className="kpi_card">
                      <div className="kpi_label">Avg Selling Price</div>
                      <div className="kpi_value">
                        {formatCurrency(
                          selectedProductKpi.avgSellingPrice || 0
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="loading">Loading product statistics...</div>
                )}

                <div className="status_date_info">
                  <p>
                    Period: {startDate} to {endDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
