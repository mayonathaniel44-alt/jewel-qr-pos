import {
  Banknote,
  ShoppingBag,
  Armchair,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChefHat,
  UtensilsCrossed,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import "./Dashboard.css";

const summaryCards = [
  {
    title: "Today's Sales",
    value: "₱0.00",
    detail: "Sales recorded today",
    icon: Banknote,
    color: "pink",
    trend: null,
  },
  {
    title: "Total Orders",
    value: "0",
    detail: "Orders placed today",
    icon: ShoppingBag,
    color: "purple",
    trend: null,
  },
  {
    title: "Available Tables",
    value: "0 / 0",
    detail: "Tables currently available",
    icon: Armchair,
    color: "blue",
    trend: null,
  },
  {
    title: "Pending Orders",
    value: "0",
    detail: "Orders needing attention",
    icon: Clock,
    color: "orange",
    trend: null,
  },
];

const orderStatuses = [
  { label: "Pending", count: 0, className: "pending" },
  { label: "Preparing", count: 0, className: "preparing" },
  { label: "Ready to Serve", count: 0, className: "ready" },
  { label: "Completed", count: 0, className: "completed" },
];

export default function Dashboard() {
  const today = new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-welcome-label">ADMIN OVERVIEW</span>
          <h2>Welcome back, Admin!</h2>
          <p>
            Monitor restaurant activity, active orders, table occupancy,
            and sales from your dashboard.
          </p>
        </div>

        <div className="dashboard-today">
          <span>Today</span>
          <strong>{today}</strong>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Business Overview</h2>
            <p>Here's what's happening at your restaurant today.</p>
          </div>
        </div>

        <div className="dashboard-summary-grid">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <article className="dashboard-summary-card" key={card.title}>
                <div className={`summary-icon ${card.color}`}>
                  <Icon size={22} />
                </div>

                <div className="summary-card-content">
                  <span className="summary-card-title">{card.title}</span>
                  <strong className="summary-card-value">{card.value}</strong>
                  <span className="summary-card-detail">{card.detail}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dashboard-lower-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div className="panel-heading-icon">
              <ShoppingBag size={19} />
            </div>
            <div>
              <h3>Order Overview</h3>
              <p>Track today's order progress</p>
            </div>
          </div>

          <div className="order-status-list">
            {orderStatuses.map((status) => (
              <div className="order-status-row" key={status.label}>
                <div className="order-status-label">
                  <span className={`status-dot ${status.className}`} />
                  <span>{status.label}</span>
                </div>
                <strong>{status.count}</strong>
              </div>
            ))}
          </div>

          <div className="dashboard-empty-note">
            <Clock size={17} />
            <span>Order activity will appear here.</span>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div className="panel-heading-icon">
              <Armchair size={19} />
            </div>
            <div>
              <h3>Table Status</h3>
              <p>Keep track of your dining area</p>
            </div>
          </div>

          <div className="table-status-content">
            <div className="table-status-illustration">
              <Armchair size={35} />
            </div>
            <strong>No table data yet</strong>
            <p>
              Table availability and occupancy information will be shown
              here when connected to your table records.
            </p>
          </div>
        </article>

        <article className="dashboard-panel dashboard-activity-panel">
          <div className="dashboard-panel-heading">
            <div className="panel-heading-icon">
              <TrendingUp size={19} />
            </div>
            <div>
              <h3>Sales Activity</h3>
              <p>Restaurant sales performance</p>
            </div>
          </div>

          <div className="sales-placeholder">
            <div className="sales-placeholder-icon">
              <Banknote size={28} />
            </div>
            <strong>₱0.00</strong>
            <span>No sales recorded today</span>
            <div className="sales-placeholder-caption">
              Sales totals will update when payment records are connected.
            </div>
          </div>
        </article>

        <article className="dashboard-panel dashboard-activity-panel">
          <div className="dashboard-panel-heading">
            <div className="panel-heading-icon">
              <UtensilsCrossed size={19} />
            </div>
            <div>
              <h3>Popular Menu Items</h3>
              <p>Frequently ordered dishes</p>
            </div>
          </div>

          <div className="popular-empty">
            <ChefHat size={30} />
            <strong>No menu statistics yet</strong>
            <span>
              Popular items will appear after order data is available.
            </span>
          </div>
        </article>
      </section>

      <footer className="dashboard-footer">
        <span>Jewel Café &amp; Restaurant</span>
        <span>Dashboard overview</span>
      </footer>
    </div>
  );
}
