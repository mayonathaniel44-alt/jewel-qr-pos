import { useMemo, useState } from "react";
import {
  Search,
  ClipboardList,
  Clock3,
  ChefHat,
  CheckCircle2,
  PackageCheck,
  Eye,
  X,
  ChevronDown,
  RefreshCw,
  UtensilsCrossed,
} from "lucide-react";
import "./Orders.css";

const initialOrders = [
  {
    id: "ORD-1001",
    table: "Table 01",
    time: "10:05 AM",
    items: [
      { name: "Iced Spanish Latte", quantity: 2, price: 145 },
      { name: "Clubhouse Sandwich", quantity: 1, price: 220 },
    ],
    status: "Pending",
    payment: "Unpaid",
    notes: "Less ice",
  },
  {
    id: "ORD-1002",
    table: "Table 03",
    time: "10:12 AM",
    items: [
      { name: "Caramel Macchiato", quantity: 1, price: 165 },
      { name: "Carbonara", quantity: 2, price: 245 },
    ],
    status: "Preparing",
    payment: "Unpaid",
    notes: "No additional requests",
  },
  {
    id: "ORD-1003",
    table: "Table 05",
    time: "10:18 AM",
    items: [
      { name: "Cappuccino", quantity: 2, price: 135 },
      { name: "Cheesecake", quantity: 1, price: 180 },
    ],
    status: "Ready to Serve",
    payment: "Paid",
    notes: "Serve together",
  },
  {
    id: "ORD-1004",
    table: "Table 02",
    time: "10:23 AM",
    items: [
      { name: "Americano", quantity: 1, price: 110 },
      { name: "Chicken Alfredo", quantity: 1, price: 260 },
    ],
    status: "Completed",
    payment: "Paid",
    notes: "No additional requests",
  },
  {
    id: "ORD-1005",
    table: "Table 07",
    time: "10:31 AM",
    items: [
      { name: "Matcha Latte", quantity: 2, price: 160 },
      { name: "French Fries", quantity: 1, price: 120 },
    ],
    status: "Pending",
    payment: "Unpaid",
    notes: "One drink with oat milk",
  },
];

const statuses = ["Pending", "Preparing", "Ready to Serve", "Completed"];

function peso(amount) {
  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function orderTotal(order) {
  return order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

function nextStatus(status) {
  const index = statuses.indexOf(status);
  return statuses[Math.min(index + 1, statuses.length - 1)];
}

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Orders");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const counts = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === "Pending").length,
      preparing: orders.filter((o) => o.status === "Preparing").length,
      ready: orders.filter((o) => o.status === "Ready to Serve").length,
      completed: orders.filter((o) => o.status === "Completed").length,
    }),
    [orders]
  );

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.table.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );

    const matchesFilter =
      filter === "All Orders" || order.status === filter;

    return matchesSearch && matchesFilter;
  });

  function updateStatus(orderId, status) {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    setSelectedOrder((current) =>
      current && current.id === orderId
        ? { ...current, status }
        : current
    );
  }

  const summaryCards = [
    {
      label: "Total Orders",
      value: counts.total,
      icon: ClipboardList,
      type: "total",
      description: "All orders",
    },
    {
      label: "Pending",
      value: counts.pending,
      icon: Clock3,
      type: "pending",
      description: "Awaiting preparation",
    },
    {
      label: "Preparing",
      value: counts.preparing,
      icon: ChefHat,
      type: "preparing",
      description: "Being prepared",
    },
    {
      label: "Ready to Serve",
      value: counts.ready,
      icon: PackageCheck,
      type: "ready",
      description: "Awaiting delivery",
    },
    {
      label: "Completed",
      value: counts.completed,
      icon: CheckCircle2,
      type: "completed",
      description: "Finished orders",
    },
  ];

  return (
    <div className="orders-page">
      <div className="orders-heading">
        <div>
          <span className="orders-eyebrow">ORDER OPERATIONS</span>
          <h1>Order Management</h1>
          <p>Manage incoming QR orders and track their preparation status.</p>
        </div>

        <button
          className="orders-refresh"
          onClick={() => {
            setSearch("");
            setFilter("All Orders");
          }}
          title="Clear search and filters"
        >
          <RefreshCw size={16} />
          Reset filters
        </button>
      </div>

      <div className="orders-summary">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <button
              key={card.type}
              className={`order-stat-card ${card.type} ${
                filter === card.label ||
                (card.type === "total" && filter === "All Orders")
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setFilter(card.type === "total" ? "All Orders" : card.label)
              }
            >
              <div className="order-stat-top">
                <span>{card.label}</span>
                <span className="order-stat-icon">
                  <Icon size={19} />
                </span>
              </div>
              <strong>{card.value}</strong>
              <span className="order-stat-description">{card.description}</span>
            </button>
          );
        })}
      </div>

      <section className="orders-panel">
        <div className="orders-panel-heading">
          <div>
            <h2>Incoming Orders</h2>
            <p>Review orders and update their progress.</p>
          </div>
          <span className="orders-count">
            {filteredOrders.length} orders
          </span>
        </div>

        <div className="orders-toolbar">
          <div className="orders-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order, table, or item..."
              aria-label="Search orders"
            />
            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <label className="orders-filter">
            <span>Status:</span>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option>All Orders</option>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
        </div>

        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ORDER</th>
                <th>TABLE</th>
                <th>ITEMS</th>
                <th>TIME</th>
                <th>TOTAL</th>
                <th>PAYMENT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="order-id">{order.id}</span>
                    <span className="order-subtext">
                      QR order
                    </span>
                  </td>
                  <td>
                    <span className="table-number">{order.table}</span>
                  </td>
                  <td>
                    <div className="order-item-list">
                      {order.items.map((item) => (
                        <span key={item.name}>
                          {item.quantity}× {item.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="order-time">{order.time}</td>
                  <td className="order-total">{peso(orderTotal(order))}</td>
                  <td>
                    <span
                      className={`payment-badge ${
                        order.payment === "Paid" ? "paid" : "unpaid"
                      }`}
                    >
                      {order.payment}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`order-status ${order.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      <span className="status-dot" />
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="order-actions">
                      <button
                        className="order-view-button"
                        onClick={() => setSelectedOrder(order)}
                        title="View order details"
                        aria-label={`View ${order.id}`}
                      >
                        <Eye size={16} />
                      </button>

                      {order.status !== "Completed" && (
                        <button
                          className="order-next-button"
                          onClick={() =>
                            updateStatus(order.id, nextStatus(order.status))
                          }
                          title={`Move to ${nextStatus(order.status)}`}
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="orders-empty">
              <ClipboardList size={34} />
              <strong>No orders found</strong>
              <p>Try changing your search or status filter.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("All Orders");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <div className="orders-table-footer">
          Showing {filteredOrders.length} of {orders.length} sample orders
        </div>
      </section>

      <div className="orders-note">
        <UtensilsCrossed size={17} />
        <span>
          <strong>Demo mode:</strong> These are sample orders. Status changes
          currently apply only in this page and are not saved to your backend.
        </span>
      </div>

      {selectedOrder && (
        <div
          className="order-modal-backdrop"
          onClick={() => setSelectedOrder(null)}
        >
          <section
            className="order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="order-modal-header">
              <div>
                <span className="orders-eyebrow">ORDER DETAILS</span>
                <h2 id="order-modal-title">{selectedOrder.id}</h2>
                <p>{selectedOrder.table} · {selectedOrder.time}</p>
              </div>
              <button
                className="order-modal-close"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="order-modal-section">
              <h3>Items ordered</h3>
              {selectedOrder.items.map((item) => (
                <div className="order-detail-item" key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.quantity} × {peso(item.price)}</span>
                  </div>
                  <strong>{peso(item.quantity * item.price)}</strong>
                </div>
              ))}
              <div className="order-detail-total">
                <span>Total amount</span>
                <strong>{peso(orderTotal(selectedOrder))}</strong>
              </div>
            </div>

            <div className="order-modal-info">
              <div>
                <span>Payment</span>
                <strong>{selectedOrder.payment}</strong>
              </div>
              <div>
                <span>Order status</span>
                <strong>{selectedOrder.status}</strong>
              </div>
              <div>
                <span>Special instructions</span>
                <strong>{selectedOrder.notes}</strong>
              </div>
            </div>

            {selectedOrder.status !== "Completed" && (
              <button
                className="order-modal-primary"
                onClick={() =>
                  updateStatus(
                    selectedOrder.id,
                    nextStatus(selectedOrder.status)
                  )
                }
              >
                Update to {nextStatus(selectedOrder.status)}
              </button>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
