import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faFileInvoiceDollar,
  faIdCard,
  faCartFlatbed,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { formatRupiah } from "../utils/formatCurrency";

function SummaryCards() {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    transactionToday: 0,
    totalUser: 0,
    totalSales: 0,
    test: 0,
  });

  useEffect(() => {
    fetch("http://localhost:4000/api/transactions/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error("Failed to fetch summary:", err));
  }, []);

  const colorHexMap = {
    primary: "#0d6efd",
    warning: "#ffc107",
    success: "#198754",
    info: "#0dcaf0",
  };

  const cards = [
    {
      title: "Purchases Total",
      value: formatRupiah(summary.totalPurchases),
      icon: faWallet,
      color: "primary",
    },
    {
      title: "Sales Total",
      value: formatRupiah(summary.totalSales),
      icon: faCartFlatbed,
      color: "warning",
    },
    {
      title: "Today Transaction",
      value: Number(summary.transactionToday),
      icon: faFileInvoiceDollar,
      color: "success",
    },
    {
      title: "Total User",
      value: Number(summary.totalUser),
      icon: faIdCard,
      color: "info",
    }
  ];

  return (
    <div className="row">
      {cards.map((card, idx) => (
        <div className="col-xl-3 col-md-6 mb-4" key={idx}>
          <div className="card shadow-sm h-100 py-2 border-0 position-relative overflow-hidden">
            <div
              className={`bg-${card.color} position-absolute`}
              style={{ left: 0, top: 0, width: "4px", height: "100%" }}
            ></div>

            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div
                    className={`fw-medium text-${card.color} text-uppercase mb-1`}
                    style={{ fontSize: "12px" }}
                  >
                    {card.title}
                  </div>
                  <div
                    className="mb-0 fw-bold text-secondary"
                    style={{ fontSize: "18px" }}
                  >
                    {card.value}
                  </div>
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={card.icon}
                    size="2x"
                    className="ms-3"
                    style={{ color: colorHexMap[card.color] }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
