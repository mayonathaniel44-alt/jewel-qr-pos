import { useMemo, useState } from "react";
import {
  ChartColumnIncreasing,
  Banknote,
  ShoppingBag,
  TrendingUp,
  Download,
  CalendarDays,
  CreditCard,
  Wallet,
  UtensilsCrossed,
} from "lucide-react";
import "./Reports.css";

const sampleSales = [
  { date: "2026-10-13", label: "Mon", sales: 4250, orders: 18 },
  { date: "2026-10-14", label: "Tue", sales: 5180, orders: 22 },
  { date: "2026-10-15", label: "Wed", sales: 3860, orders: 16 },
  { date: "2026-10-16", label: "Thu", sales: 6240, orders: 27 },
  { date: "2026-10-17", label: "Fri", sales: 7820, orders: 34 },
  { date: "2026-10-18", label: "Sat", sales: 9650, orders: 42 },
  { date: "2026-10-19", label: "Sun", sales: 7340, orders: 31 },
];

const samplePayments = [
  { method: "Cash", amount: 18450, percentage: 48, color: "cash" },
  { method: "GCash", amount: 12780, percentage: 33, color: "gcash" },
  { method: "Card", amount: 7310, percentage: 19, color: "card" },
];

const samplePopularItems = [
  { name: "Classic Burger", category: "Main Course", sold: 86, revenue: 17114 },
  { name: "Iced Spanish Latte", category: "Beverages", sold: 74, revenue: 11840 },
  { name: "Chicken Alfredo", category: "Pasta", sold: 62, revenue: 15438 },
  { name: "French Fries", category: "Sides", sold: 58, revenue: 6380 },
  { name: "Chocolate Cake", category: "Desserts", sold: 41, revenue: 7380 },
];

const peso = (amount) =>
  `₱${Number(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function Reports() {
  const [period, setPeriod] = useState("7days");
  const [startDate, setStartDate] = useState("2026-10-13");
  const [endDate, setEndDate] = useState("2026-10-19");

  const filteredSales = useMemo(() => {
    if (period === "custom") {
      return sampleSales.filter(
        (day) => day.date >= startDate && day.date <= endDate
      );
    }

    if (period === "today") {
      return sampleSales.filter((day) => day.date === "2026-10-19");
    }

    if (period === "30days") {
      return sampleSales;
    }

    return sampleSales.slice(-7);
  }, [period, startDate, endDate]);

  const totals = useMemo(() => {
    const sales = filteredSales.reduce((sum, day) => sum + day.sales, 0);
    const orders = filteredSales.reduce((sum, day) => sum + day.orders, 0);
    return {
      sales,
      orders,
      average: orders ? sales / orders : 0,
      days: filteredSales.length,
    };
  }, [filteredSales]);

  const maxSales = Math.max(...filteredSales.map((day) => day.sales), 1);

  function exportCsv() {
    const headers = ["Date", "Day", "Sales (PHP)", "Orders", "Average Order Value"];
    const rows = filteredSales.map((day) => [
      day.date,
      day.label,
      day.sales.toFixed(2),
      day.orders,
      (day.orders ? day.sales / day.orders : 0).toFixed(2),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "jewel-sales-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="reports-page">
      <div className="reports-heading">
        <div>
          <span className="reports-eyebrow">BUSINESS INTELLIGENCE</span>
          <h1>Reports Management</h1>
          <p>Monitor sales performance, orders, and restaurant transactions.</p>
        </div>

        <button className="reports-export-button" onClick={exportCsv}>
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="reports-demo-notice">
        <span />
        Demo report — all figures and menu rankings below are sample data, not live business records.
      </div>

      <section className="reports-filter-panel">
        <div className="reports-filter-title">
          <CalendarDays size={18} />
          <strong>Report Period</strong>
        </div>

        <div className="reports-filter-controls">
          <div className="reports-period-buttons">
            {[
              { value: "today", label: "Today" },
              { value: "7days", label: "Last 7 Days" },
              { value: "30days", label: "Last 30 Days" },
              { value: "custom", label: "Custom Range" },
            ].map((item) => (
              <button
                key={item.value}
                className={period === item.value ? "active" : ""}
                onClick={() => setPeriod(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {period === "custom" && (
            <div className="reports-date-inputs">
              <label>
                From
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </label>
              <label>
                To
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </label>
            </div>
          )}
        </div>
      </section>

      <div className="reports-summary-grid">
        <article className="reports-stat-card sales">
          <div className="reports-stat-top">
            <span>Total Sales</span>
            <span className="reports-stat-icon"><Banknote size={20} /></span>
          </div>
          <strong>{peso(totals.sales)}</strong>
          <span className="reports-stat-detail">For the selected period</span>
        </article>

        <article className="reports-stat-card orders">
          <div className="reports-stat-top">
            <span>Total Orders</span>
            <span className="reports-stat-icon"><ShoppingBag size={20} /></span>
          </div>
          <strong>{totals.orders.toLocaleString()}</strong>
          <span className="reports-stat-detail">Orders in sample report</span>
        </article>

        <article className="reports-stat-card average">
          <div className="reports-stat-top">
            <span>Average Order Value</span>
            <span className="reports-stat-icon"><TrendingUp size={20} /></span>
          </div>
          <strong>{peso(totals.average)}</strong>
          <span className="reports-stat-detail">Sales divided by orders</span>
        </article>

        <article className="reports-stat-card days">
          <div className="reports-stat-top">
            <span>Days Included</span>
            <span className="reports-stat-icon"><CalendarDays size={20} /></span>
          </div>
          <strong>{totals.days}</strong>
          <span className="reports-stat-detail">Days with sample records</span>
        </article>
      </div>

      <div className="reports-main-grid">
        <section className="reports-panel reports-sales-panel">
          <div className="reports-panel-heading">
            <div>
              <h2>Sales Overview</h2>
              <p>Daily sales for the selected period</p>
            </div>
            <span className="reports-heading-icon"><ChartColumnIncreasing size={20} /></span>
          </div>

          {filteredSales.length > 0 ? (
            <>
              <div className="reports-chart-summary">
                <strong>{peso(totals.sales)}</strong>
                <span>Total recorded sales</span>
              </div>

              <div className="reports-bar-chart">
                {filteredSales.map((day) => (
                  <div className="reports-bar-column" key={day.date}>
                    <div className="reports-bar-value">{peso(day.sales)}</div>
                    <div className="reports-bar-track">
                      <div
                        className="reports-bar"
                        style={{ height: `${Math.max((day.sales / maxSales) * 100, 3)}%` }}
                        title={`${day.date}: ${peso(day.sales)}`}
                      />
                    </div>
                    <span className="reports-bar-label">{day.label}</span>
                  </div>
                ))}
              </div>
              <div className="reports-chart-legend">
                <span />
                Daily sales (PHP)
              </div>
            </>
          ) : (
            <div className="reports-no-data">
              <ChartColumnIncreasing size={30} />
              <strong>No data for this date range</strong>
              <span>Choose another period to view sample sales.</span>
            </div>
          )}
        </section>

        <section className="reports-panel reports-payment-panel">
          <div className="reports-panel-heading">
            <div>
              <h2>Payment Methods</h2>
              <p>Sample payment distribution</p>
            </div>
            <span className="reports-heading-icon"><CreditCard size={20} /></span>
          </div>

          <div className="reports-payment-total">
            <span>Recorded payment value</span>
            <strong>{peso(samplePayments.reduce((sum, p) => sum + p.amount, 0))}</strong>
          </div>

          <div className="reports-payment-list">
            {samplePayments.map((payment) => (
              <div className="reports-payment-item" key={payment.method}>
                <div className="reports-payment-row">
                  <span className={`reports-payment-symbol ${payment.color}`}>
                    {payment.method === "Cash" ? <Banknote size={17} /> :
                      payment.method === "GCash" ? <Wallet size={17} /> :
                        <CreditCard size={17} />}
                  </span>
                  <div className="reports-payment-name">
                    <strong>{payment.method}</strong>
                    <span>{payment.percentage}% of sample payments</span>
                  </div>
                  <strong className="reports-payment-amount">{peso(payment.amount)}</strong>
                </div>
                <div className="reports-progress-track">
                  <div
                    className={`reports-progress-fill ${payment.color}`}
                    style={{ width: `${payment.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="reports-payment-footnote">
            <Wallet size={15} />
            Payment totals are independent sample figures.
          </div>
        </section>
      </div>

      <section className="reports-panel reports-menu-panel">
        <div className="reports-panel-heading">
          <div>
            <h2>Popular Menu Items</h2>
            <p>Sample items ranked by quantity sold</p>
          </div>
          <span className="reports-heading-icon"><UtensilsCrossed size={20} /></span>
        </div>

        <div className="reports-table-wrap">
          <table className="reports-table">
            <thead>
              <tr>
                <th>#</th>
                <th>MENU ITEM</th>
                <th>CATEGORY</th>
                <th>QUANTITY SOLD</th>
                <th>REVENUE</th>
              </tr>
            </thead>
            <tbody>
              {samplePopularItems.map((item, index) => (
                <tr key={item.name}>
                  <td>
                    <span className={`reports-rank ${index === 0 ? "top" : ""}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="reports-menu-name">{item.name}</td>
                  <td><span className="reports-category">{item.category}</span></td>
                  <td>{item.sold}</td>
                  <td className="reports-revenue">{peso(item.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="reports-footer-note">
        Reports will reflect actual restaurant performance after sales, orders, and payment data are connected to the backend.
      </div>
    </div>
  );
}
