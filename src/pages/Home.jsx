import "./Home.css";
import Kpis from "../API/Kpis/Kpis";
import { useState, useEffect } from "react";
import status1 from "../assets/status.png";
import status2 from "../assets/status2.png";

export default function Home() {
  const [kpi, setKpi] = useState(null);
  const [previousKpi, setPreviousKpi] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      </div>
    </div>
  );
}
