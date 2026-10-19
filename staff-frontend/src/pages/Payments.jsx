import { useMemo, useState } from "react";
import {
  Search,
  CreditCard,
  Banknote,
  Wallet,
  CircleCheck,
  Clock3,
  Eye,
  X,
  ArrowDownToLine,
} from "lucide-react";
import "./Payments.css";

const initialPayments = [
  { id: "PAY-1001", order: "ORD-1001", table: "Table 01", customer: "Customer 01", amount: 580, method: "Cash", status: "Paid", date: "2026-10-19", time: "09:15 AM" },
  { id: "PAY-1002", order: "ORD-1002", table: "Table 03", customer: "Customer 02", amount: 845, method: "GCash", status: "Paid", date: "2026-10-19", time: "09:32 AM" },
  { id: "PAY-1003", order: "ORD-1003", table: "Table 05", customer: "Customer 03", amount: 420, method: "Cash", status: "Pending", date: "2026-10-19", time: "09:48 AM" },
  { id: "PAY-1004", order: "ORD-1004", table: "Table 02", customer: "Customer 04", amount: 1250, method: "Card", status: "Paid", date: "2026-10-19", time: "10:05 AM" },
  { id: "PAY-1005", order: "ORD-1005", table: "Table 07", customer: "Customer 05", amount: 675, method: "GCash", status: "Failed", date: "2026-10-19", time: "10:17 AM" },
  { id: "PAY-1006", order: "ORD-1006", table: "Table 04", customer: "Customer 06", amount: 930, method: "Cash", status: "Pending", date: "2026-10-19", time: "10:25 AM" },
  { id: "PAY-1007", order: "ORD-1007", table: "Table 06", customer: "Customer 07", amount: 350, method: "GCash", status: "Paid", date: "2026-10-19", time: "10:41 AM" },
  { id: "PAY-1008", order: "ORD-1008", table: "Table 08", customer: "Customer 08", amount: 1100, method: "Card", status: "Refunded", date: "2026-10-19", time: "10:56 AM" },
];

const peso = (amount) =>
  `₱${Number(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const paymentStatuses = ["Paid", "Pending", "Failed", "Refunded"];
const paymentMethods = ["Cash", "GCash", "Card"];

function statusClass(status) {
  return status.toLowerCase();
}

export default function Payments() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [methodFilter, setMethodFilter] = useState("All Methods");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const stats = useMemo(() => {
    const paid = payments.filter((p) => p.status === "Paid");
    return {
      collected: paid.reduce((sum, p) => sum + p.amount, 0),
      paidCount: paid.length,
      pending: payments
        .filter((p) => p.status === "Pending")
        .reduce((sum, p) => sum + p.amount, 0),
      pendingCount: payments.filter((p) => p.status === "Pending").length,
      failedCount: payments.filter((p) => p.status === "Failed").length,
      total: payments.length,
    };
  }, [payments]);

  const filteredPayments = payments.filter((payment) => {
    const query = search.toLowerCase();
    const matchesSearch =
      payment.id.toLowerCase().includes(query) ||
      payment.order.toLowerCase().includes(query) ||
      payment.table.toLowerCase().includes(query) ||
      payment.customer.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All Statuses" || payment.status === statusFilter;
    const matchesMethod =
      methodFilter === "All Methods" || payment.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  function updateStatus(id, status) {
    setPayments((current) =>
      current.map((payment) =>
        payment.id === id ? { ...payment, status } : payment
      )
    );
    setSelectedPayment((current) =>
      current && current.id === id ? { ...current, status } : current
    );
  }

  function exportCsv() {
    const headers = [
      "Payment ID",
      "Order ID",
      "Table",
      "Customer",
      "Amount",
      "Method",
      "Status",
      "Date",
      "Time",
    ];

    const rows = filteredPayments.map((p) => [
      p.id,
      p.order,
      p.table,
      p.customer,
      p.amount.toFixed(2),
      p.method,
      p.status,
      p.date,
      p.time,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "jewel-payment-records.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const summaryCards = [
    {
      label: "Total Collected",
      value: peso(stats.collected),
      detail: `${stats.paidCount} successful payments`,
      icon: Banknote,
      type: "collected",
    },
    {
      label: "Pending Payments",
      value: peso(stats.pending),
      detail: `${stats.pendingCount} awaiting payment`,
      icon: Clock3,
      type: "pending",
    },
    {
      label: "Failed Payments",
      value: stats.failedCount,
      detail: "Transactions needing review",
      icon: CreditCard,
      type: "failed",
    },
    {
      label: "Transactions",
      value: stats.total,
      detail: "Sample payment records",
      icon: Wallet,
      type: "transactions",
    },
  ];

  return (
    <div className="payments-page">
      <div className="payments-heading">
        <div>
          <span className="payments-eyebrow">RESTAURANT OPERATIONS</span>
          <h1>Payment Management</h1>
          <p>Review transactions, payment methods, and payment statuses.</p>
        </div>

        <button className="payments-export-button" onClick={exportCsv}>
          <ArrowDownToLine size={16} />
          Export CSV
        </button>
      </div>

      <div className="payments-demo-notice">
        <span className="payments-demo-dot" />
        Demo data — these are sample transactions, not actual customer payments.
      </div>

      <div className="payments-summary">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div className={`payments-stat-card ${card.type}`} key={card.type}>
              <div className="payments-stat-top">
                <span>{card.label}</span>
                <span className="payments-stat-icon">
                  <Icon size={19} />
                </span>
              </div>
              <strong>{card.value}</strong>
              <span className="payments-stat-detail">{card.detail}</span>
            </div>
          );
        })}
      </div>

      <section className="payments-panel">
        <div className="payments-panel-heading">
          <div>
            <h2>Transaction History</h2>
            <p>Search and review restaurant payment records.</p>
          </div>
          <span className="payments-count">
            {filteredPayments.length} records
          </span>
        </div>

        <div className="payments-toolbar">
          <div className="payments-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search payment, order, table..."
              aria-label="Search payments"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>

          <div className="payments-filters">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by payment status"
            >
              <option>All Statuses</option>
              {paymentStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>

            <select
              value={methodFilter}
              onChange={(event) => setMethodFilter(event.target.value)}
              aria-label="Filter by payment method"
            >
              <option>All Methods</option>
              {paymentMethods.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="payments-table-wrap">
          <table className="payments-table">
            <thead>
              <tr>
                <th>PAYMENT / ORDER</th>
                <th>TABLE</th>
                <th>DATE & TIME</th>
                <th>METHOD</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <div className="payments-id">{payment.id}</div>
                    <div className="payments-sub-id">{payment.order}</div>
                  </td>
                  <td>
                    <span className="payments-table-name">{payment.table}</span>
                    <span className="payments-customer">{payment.customer}</span>
                  </td>
                  <td>
                    <span className="payments-date">{payment.date}</span>
                    <span className="payments-customer">{payment.time}</span>
                  </td>
                  <td>
                    <span className={`payments-method ${payment.method.toLowerCase()}`}>
                      {payment.method === "Cash" ? (
                        <Banknote size={15} />
                      ) : payment.method === "GCash" ? (
                        <Wallet size={15} />
                      ) : (
                        <CreditCard size={15} />
                      )}
                      {payment.method}
                    </span>
                  </td>
                  <td className="payments-amount">{peso(payment.amount)}</td>
                  <td>
                    <span className={`payments-status ${statusClass(payment.status)}`}>
                      <span />
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="payments-view-button"
                      onClick={() => setSelectedPayment(payment)}
                      aria-label={`View ${payment.id}`}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="7" className="payments-empty">
                    <CreditCard size={30} />
                    <strong>No transactions found</strong>
                    <span>Try changing your search or filters.</span>
                    <button
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("All Statuses");
                        setMethodFilter("All Methods");
                      }}
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="payments-panel-footer">
          Showing {filteredPayments.length} of {payments.length} sample transactions
        </div>
      </section>

      <div className="payments-info">
        <CircleCheck size={18} />
        <span>
          <strong>Payment processing:</strong> Cash payments can be recorded by
          the cashier. GCash and card payments should only be marked successful
          after confirmation from a trusted payment provider or verified receipt.
          This demo does not process or verify real payments.
        </span>
      </div>

      {selectedPayment && (
        <div
          className="payments-modal-backdrop"
          onClick={() => setSelectedPayment(null)}
        >
          <section
            className="payments-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="payments-modal-heading">
              <div>
                <span className="payments-eyebrow">TRANSACTION DETAILS</span>
                <h2 id="payment-modal-title">{selectedPayment.id}</h2>
                <p>Order {selectedPayment.order}</p>
              </div>
              <button
                className="payments-close-button"
                onClick={() => setSelectedPayment(null)}
                aria-label="Close transaction details"
              >
                <X size={19} />
              </button>
            </div>

            <div className="payments-modal-amount">
              <span>Transaction amount</span>
              <strong>{peso(selectedPayment.amount)}</strong>
              <span className={`payments-status ${statusClass(selectedPayment.status)}`}>
                <span />
                {selectedPayment.status}
              </span>
            </div>

            <div className="payments-detail-list">
              <div><span>Table</span><strong>{selectedPayment.table}</strong></div>
              <div><span>Customer reference</span><strong>{selectedPayment.customer}</strong></div>
              <div><span>Payment method</span><strong>{selectedPayment.method}</strong></div>
              <div><span>Date</span><strong>{selectedPayment.date}</strong></div>
              <div><span>Time</span><strong>{selectedPayment.time}</strong></div>
            </div>

            <label className="payments-status-label" htmlFor="payment-status">
              Demo status adjustment
            </label>
            <select
              id="payment-status"
              className="payments-status-select"
              value={selectedPayment.status}
              onChange={(event) =>
                updateStatus(selectedPayment.id, event.target.value)
              }
            >
              {paymentStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <p className="payments-modal-warning">
              Changing this status only updates the current page's sample data.
              It does not charge, refund, or update a real transaction.
            </p>

            <button
              className="payments-modal-done"
              onClick={() => setSelectedPayment(null)}
            >
              Done
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
