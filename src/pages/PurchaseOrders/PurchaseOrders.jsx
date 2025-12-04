import React from "react";
import "./PurchaseOrders.css";
import { useState, useRef } from "react";
import { FiPhone } from "react-icons/fi";
import { MdOutlineMailOutline, MdOutlineLocationOn } from "react-icons/md";
import { IoImageOutline } from "react-icons/io5";
import po1 from "../../assets/po.webp";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PurchaseOrders = () => {
  const [currentFilter, setCurrentFilter] = useState("New");

  // ====== NEW: State for Preview Modal ======
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const pdfRef = useRef(null);

  // Example data (replace with your real data later)
  const exampleOrder = {
    name: "Sgi Group",
    phone: "+1 (555) 123-8477",
    email: "contact@sgigroup.com",
    address: "123, st 10, dubai",
    file: {
      // url: "https://via.placeholder.com/400",
      url: po1,
      type: "image", // can be image OR link
      size: "10.2 MB",
    },
  };

  const openPreview = () => {
    setPreviewData(exampleOrder);
    setShowPreview(true);
  };

  const generatePDF = async () => {
    const element = pdfRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    pdf.save("purchase-order.pdf");
  };

  return (
    <div className="po">
      <div className="po_container">
        <div className="po_filter">
          <p
            onClick={() => setCurrentFilter("New")}
            className={currentFilter === "New" ? "active" : ""}
          >
            New
          </p>

          <p
            onClick={() => setCurrentFilter("Success")}
            className={currentFilter === "Success" ? "active" : ""}
          >
            Completed
          </p>

          <p
            onClick={() => setCurrentFilter("Processing")}
            className={currentFilter === "Processing" ? "active" : ""}
          >
            Pending
          </p>

          <p
            onClick={() => setCurrentFilter("Canceled")}
            className={currentFilter === "Canceled" ? "active" : ""}
          >
            Canceled
          </p>
        </div>
        <div className="po_list">
          <div className="po_item">
            <h1>{exampleOrder.name}</h1>

            <div className="po_item_info">
              <p>
                <FiPhone /> {exampleOrder.phone}
              </p>
              <p>
                <MdOutlineMailOutline /> {exampleOrder.email}
              </p>
            </div>

            <p>
              <MdOutlineLocationOn /> {exampleOrder.address}
            </p>

            <div className="po_file">
              <p onClick={openPreview} style={{ cursor: "pointer" }}>
                <IoImageOutline />
                upload po.png
                <span>Preview</span>
              </p>
              <span>{exampleOrder.file.size}</span>
            </div>

            <div className="po_btns">
              <button>Reject</button>
              <button>Approve</button>
            </div>
          </div>
          <div className="po_item">
            <h1>{exampleOrder.name}</h1>

            <div className="po_item_info">
              <p>
                <FiPhone /> {exampleOrder.phone}
              </p>
              <p>
                <MdOutlineMailOutline /> {exampleOrder.email}
              </p>
            </div>

            <p>
              <MdOutlineLocationOn /> {exampleOrder.address}
            </p>

            <div className="po_file">
              <p onClick={openPreview} style={{ cursor: "pointer" }}>
                <IoImageOutline />
                upload po.png
                <span>Preview</span>
              </p>
              <span>{exampleOrder.file.size}</span>
            </div>

            <div className="po_btns">
              <button>Reject</button>
              <button>Approve</button>
            </div>
          </div>
          <div className="po_item">
            <h1>{exampleOrder.name}</h1>

            <div className="po_item_info">
              <p>
                <FiPhone /> {exampleOrder.phone}
              </p>
              <p>
                <MdOutlineMailOutline /> {exampleOrder.email}
              </p>
            </div>

            <p>
              <MdOutlineLocationOn /> {exampleOrder.address}
            </p>

            <div className="po_file">
              <p onClick={openPreview} style={{ cursor: "pointer" }}>
                <IoImageOutline />
                upload po.png
                <span>Preview</span>
              </p>
              <span>{exampleOrder.file.size}</span>
            </div>

            <div className="po_btns">
              <button>Reject</button>
              <button>Approve</button>
            </div>
          </div>
          <div className="po_item">
            <h1>{exampleOrder.name}</h1>

            <div className="po_item_info">
              <p>
                <FiPhone /> {exampleOrder.phone}
              </p>
              <p>
                <MdOutlineMailOutline /> {exampleOrder.email}
              </p>
            </div>

            <p>
              <MdOutlineLocationOn /> {exampleOrder.address}
            </p>

            <div className="po_file">
              <p onClick={openPreview} style={{ cursor: "pointer" }}>
                <IoImageOutline />
                upload po.png
                <span>Preview</span>
              </p>
              <span>{exampleOrder.file.size}</span>
            </div>

            <div className="po_btns">
              <button>Reject</button>
              <button>Approve</button>
            </div>
          </div>
        </div>

        {/* ===================== PREVIEW MODAL ===================== */}
        {showPreview && previewData && (
          <div className="preview_modal">
            <div className="preview_box" ref={pdfRef}>
              <h2>Purchase Order Preview</h2>

              <div className="preview_info">
                <p>
                  <strong>Merchant:</strong> {previewData.name}
                </p>
                <p>
                  <strong>Email:</strong> {previewData.email}
                </p>
                <p>
                  <strong>Phone:</strong> {previewData.phone}
                </p>
                <p>
                  <strong>Address:</strong> {previewData.address}
                </p>
              </div>

              <div className="preview_file">
                {previewData.file.type === "image" ? (
                  <img
                    src={previewData.file.url}
                    alt="po"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "10px",
                      marginTop: "15px",
                    }}
                  />
                ) : (
                  <a
                    href={previewData.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file_link"
                  >
                    Open File
                  </a>
                )}
              </div>

              <div className="preview_actions">
                <button
                  className="close_btn"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </button>
                {/* 
                <button className="download_btn" onClick={generatePDF}>
                  Download PDF
                </button> */}
              </div>
            </div>
          </div>
        )}
        {/* ========================================================= */}
      </div>
    </div>
  );
};

export default PurchaseOrders;
