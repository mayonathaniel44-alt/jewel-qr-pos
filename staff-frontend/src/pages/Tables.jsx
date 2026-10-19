import { useMemo, useState } from "react";
import {
  Search,
  Armchair,
  Users,
  CheckCircle2,
  Clock3,
  Sparkles,
  Wrench,
  Eye,
  X,
  QrCode,
  RefreshCw,
  Plus,
} from "lucide-react";
import "./Tables.css";

const initialTables = [
  { id: 1, name: "Table 01", capacity: 2, status: "Occupied", area: "Indoor", order: "ORD-1001" },
  { id: 2, name: "Table 02", capacity: 2, status: "Available", area: "Indoor", order: null },
  { id: 3, name: "Table 03", capacity: 4, status: "Occupied", area: "Indoor", order: "ORD-1002" },
  { id: 4, name: "Table 04", capacity: 4, status: "Reserved", area: "Indoor", order: null },
  { id: 5, name: "Table 05", capacity: 2, status: "Dirty", area: "Indoor", order: null },
  { id: 6, name: "Table 06", capacity: 6, status: "Available", area: "Indoor", order: null },
  { id: 7, name: "Table 07", capacity: 4, status: "Occupied", area: "Outdoor", order: "ORD-1005" },
  { id: 8, name: "Table 08", capacity: 4, status: "Clean", area: "Outdoor", order: null },
  { id: 9, name: "Table 09", capacity: 2, status: "Inspected", area: "Outdoor", order: null },
  { id: 10, name: "Table 10", capacity: 6, status: "Out of Order", area: "Outdoor", order: null },
  { id: 11, name: "Table 11", capacity: 4, status: "Available", area: "Indoor", order: null },
  { id: 12, name: "Table 12", capacity: 2, status: "Reserved", area: "Outdoor", order: null },
];

const tableStatuses = [
  "Available",
  "Reserved",
  "Occupied",
  "Dirty",
  "Clean",
  "Inspected",
  "Out of Order",
];

function statusClass(status) {
  return status.toLowerCase().replaceAll(" ", "-");
}

export default function Tables() {
  const [tables, setTables] = useState(initialTables);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Tables");
  const [area, setArea] = useState("All Areas");
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAddTable, setShowAddTable] = useState(false);
  const [newCapacity, setNewCapacity] = useState("4");
  const [newArea, setNewArea] = useState("Indoor");

  const counts = useMemo(() => ({
    total: tables.length,
    available: tables.filter((t) => t.status === "Available").length,
    occupied: tables.filter((t) => t.status === "Occupied").length,
    reserved: tables.filter((t) => t.status === "Reserved").length,
    cleaning: tables.filter((t) => ["Dirty", "Clean"].includes(t.status)).length,
  }), [tables]);

  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.name.toLowerCase().includes(search.toLowerCase()) ||
      table.area.toLowerCase().includes(search.toLowerCase()) ||
      String(table.id).includes(search);

    const matchesStatus = filter === "All Tables" || table.status === filter;
    const matchesArea = area === "All Areas" || table.area === area;

    return matchesSearch && matchesStatus && matchesArea;
  });

  function updateStatus(id, status) {
    setTables((current) =>
      current.map((table) => {
        if (table.id !== id) return table;
        return {
          ...table,
          status,
          order: status === "Occupied" ? table.order : null,
        };
      })
    );

    setSelectedTable((current) =>
      current && current.id === id
        ? {
            ...current,
            status,
            order: status === "Occupied" ? current.order : null,
          }
        : current
    );
  }

  function addTable(event) {
    event.preventDefault();

    const nextId = Math.max(0, ...tables.map((table) => table.id)) + 1;
    const table = {
      id: nextId,
      name: `Table ${String(nextId).padStart(2, "0")}`,
      capacity: Number(newCapacity),
      status: "Available",
      area: newArea,
      order: null,
    };

    setTables((current) => [...current, table]);
    setShowAddTable(false);
    setFilter("All Tables");
    setArea("All Areas");
    setSearch("");
  }

  const summary = [
    { label: "Total Tables", value: counts.total, icon: Armchair, type: "total", description: "Registered tables" },
    { label: "Available", value: counts.available, icon: CheckCircle2, type: "available", description: "Ready for guests" },
    { label: "Occupied", value: counts.occupied, icon: Users, type: "occupied", description: "Currently in use" },
    { label: "Reserved", value: counts.reserved, icon: Clock3, type: "reserved", description: "Reserved for guests" },
    { label: "Needs Attention", value: counts.cleaning, icon: Sparkles, type: "cleaning", description: "Cleaning required" },
  ];

  return (
    <div className="tables-page">
      <div className="tables-heading">
        <div>
          <span className="tables-eyebrow">RESTAURANT OPERATIONS</span>
          <h1>Table Management</h1>
          <p>Monitor table availability and manage guest seating.</p>
        </div>

        <div className="tables-heading-actions">
          <button
            className="tables-secondary-button"
            onClick={() => {
              setSearch("");
              setFilter("All Tables");
              setArea("All Areas");
            }}
          >
            <RefreshCw size={15} />
            Reset
          </button>
          <button
            className="tables-primary-button"
            onClick={() => setShowAddTable(true)}
          >
            <Plus size={17} />
            Add Table
          </button>
        </div>
      </div>

      <div className="tables-summary">
        {summary.map((item) => {
          const Icon = item.icon;
          const selected =
            (item.type === "total" && filter === "All Tables") ||
            (item.type === "available" && filter === "Available") ||
            (item.type === "occupied" && filter === "Occupied") ||
            (item.type === "reserved" && filter === "Reserved") ||
            (item.type === "cleaning" && ["Dirty", "Clean"].includes(filter));

          return (
            <button
              key={item.type}
              className={`tables-stat-card ${item.type} ${selected ? "selected" : ""}`}
              onClick={() => {
                if (item.type === "total") setFilter("All Tables");
                else if (item.type === "cleaning") setFilter("Dirty");
                else setFilter(item.label);
              }}
            >
              <div className="tables-stat-top">
                <span>{item.label}</span>
                <span className="tables-stat-icon"><Icon size={19} /></span>
              </div>
              <strong>{item.value}</strong>
              <span className="tables-stat-description">{item.description}</span>
            </button>
          );
        })}
      </div>

      <section className="tables-panel">
        <div className="tables-panel-heading">
          <div>
            <h2>Restaurant Floor</h2>
            <p>Select a table to view its details or change its status.</p>
          </div>
          <span className="tables-count">{filteredTables.length} tables</span>
        </div>

        <div className="tables-legend">
          {[
            ["available", "Available"],
            ["occupied", "Occupied"],
            ["reserved", "Reserved"],
            ["dirty", "Dirty"],
            ["clean", "Clean"],
            ["inspected", "Inspected"],
            ["out-of-order", "Out of Order"],
          ].map(([className, label]) => (
            <button
              key={label}
              className={`tables-legend-item ${filter === label ? "active" : ""}`}
              onClick={() => setFilter(filter === label ? "All Tables" : label)}
            >
              <span className={`tables-legend-dot ${className}`} />
              {label}
            </button>
          ))}
        </div>

        <div className="tables-toolbar">
          <div className="tables-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search table number or area..."
              aria-label="Search tables"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>

          <div className="tables-filters">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option>All Tables</option>
              {tableStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>

            <select
              value={area}
              onChange={(event) => setArea(event.target.value)}
              aria-label="Filter by area"
            >
              <option>All Areas</option>
              <option>Indoor</option>
              <option>Outdoor</option>
            </select>
          </div>
        </div>

        <div className="tables-grid">
          {filteredTables.map((table) => (
            <button
              key={table.id}
              className={`table-card ${statusClass(table.status)}`}
              onClick={() => setSelectedTable(table)}
            >
              <div className="table-card-top">
                <span className="table-card-number">#{String(table.id).padStart(2, "0")}</span>
                <span className={`table-status-badge ${statusClass(table.status)}`}>
                  <span className="table-status-dot" />
                  {table.status}
                </span>
              </div>

              <div className="table-card-illustration">
                <span className="table-chair chair-top" />
                <span className="table-chair chair-bottom" />
                <span className="table-chair chair-left" />
                <span className="table-chair chair-right" />
                <span className="table-round">
                  <Armchair size={25} />
                </span>
              </div>

              <strong className="table-card-name">{table.name}</strong>
              <span className="table-card-meta">
                <Users size={13} />
                {table.capacity} seats
                <span className="table-meta-divider">·</span>
                {table.area}
              </span>

              {table.order && (
                <span className="table-order-ref">{table.order}</span>
              )}

              <span className="table-card-open">
                <Eye size={13} /> View details
              </span>
            </button>
          ))}

          {filteredTables.length === 0 && (
            <div className="tables-empty">
              <Armchair size={34} />
              <strong>No tables found</strong>
              <p>Try a different search or filter.</p>
              <button onClick={() => {
                setSearch("");
                setFilter("All Tables");
                setArea("All Areas");
              }}>Clear filters</button>
            </div>
          )}
        </div>

        <div className="tables-panel-footer">
          Showing {filteredTables.length} of {tables.length} sample tables
        </div>
      </section>

      <div className="tables-note">
        <QrCode size={18} />
        <span>
          <strong>QR table setup:</strong> Each table should eventually have its own unique QR code linked to the customer menu. QR generation and backend synchronization are not connected yet.
        </span>
      </div>

      {selectedTable && (
        <div className="table-modal-backdrop" onClick={() => setSelectedTable(null)}>
          <section
            className="table-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="table-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="table-modal-header">
              <div>
                <span className="tables-eyebrow">TABLE DETAILS</span>
                <h2 id="table-modal-title">{selectedTable.name}</h2>
                <p>{selectedTable.area} area · {selectedTable.capacity} seats</p>
              </div>
              <button
                className="table-modal-close"
                onClick={() => setSelectedTable(null)}
                aria-label="Close table details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="table-modal-info">
              <div>
                <span>Table ID</span>
                <strong>#{String(selectedTable.id).padStart(2, "0")}</strong>
              </div>
              <div>
                <span>Current status</span>
                <strong className={`table-modal-status ${statusClass(selectedTable.status)}`}>
                  {selectedTable.status}
                </strong>
              </div>
              <div>
                <span>Active order</span>
                <strong>{selectedTable.order || "No linked order"}</strong>
              </div>
            </div>

            <label className="table-status-label" htmlFor="table-status-select">
              Update table status
            </label>
            <select
              id="table-status-select"
              className="table-status-select"
              value={selectedTable.status}
              onChange={(event) => updateStatus(selectedTable.id, event.target.value)}
            >
              {tableStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>

            <p className="table-modal-warning">
              Status changes currently affect only this demo page. In the connected system, occupied tables should be synchronized with orders, and cleaning statuses with housekeeping.
            </p>

            <button className="tables-primary-button table-modal-done" onClick={() => setSelectedTable(null)}>
              Done
            </button>
          </section>
        </div>
      )}

      {showAddTable && (
        <div className="table-modal-backdrop" onClick={() => setShowAddTable(false)}>
          <form
            className="table-modal"
            onSubmit={addTable}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="table-modal-header">
              <div>
                <span className="tables-eyebrow">TABLE CONFIGURATION</span>
                <h2>Add a Table</h2>
                <p>Create a table in the sample floor layout.</p>
              </div>
              <button
                type="button"
                className="table-modal-close"
                onClick={() => setShowAddTable(false)}
                aria-label="Close add table form"
              >
                <X size={20} />
              </button>
            </div>

            <label className="table-status-label" htmlFor="table-capacity">
              Seating capacity
            </label>
            <select
              id="table-capacity"
              className="table-status-select"
              value={newCapacity}
              onChange={(event) => setNewCapacity(event.target.value)}
            >
              <option value="2">2 seats</option>
              <option value="4">4 seats</option>
              <option value="6">6 seats</option>
              <option value="8">8 seats</option>
            </select>

            <label className="table-status-label" htmlFor="table-area">
              Restaurant area
            </label>
            <select
              id="table-area"
              className="table-status-select"
              value={newArea}
              onChange={(event) => setNewArea(event.target.value)}
            >
              <option>Indoor</option>
              <option>Outdoor</option>
            </select>

            <button type="submit" className="tables-primary-button table-modal-done">
              <Plus size={16} /> Create Table
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
