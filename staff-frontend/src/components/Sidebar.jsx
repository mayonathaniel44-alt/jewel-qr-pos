
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  Armchair,
  CreditCard,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  UserRound,
  Coffee,
  X,
} from "lucide-react";

import "./Sidebar.css";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: ClipboardList,
    expandable: true,
  },
  {
    label: "Tables",
    path: "/tables",
    icon: Armchair,
    expandable: true,
  },
  {
    label: "Menu",
    path: "/menu",
    icon: Utensils,
    expandable: true,
  },
  {
    label: "Payments",
    path: "/payments",
    icon: CreditCard,
    expandable: true,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: ChartNoAxesCombined,
    expandable: true,
  },
];

export default function Sidebar({ open = true, onClose }) {
  const navigate = useNavigate();

  function handleLogout() {
    // Connect this to your authentication logout flow later.
    navigate("/login");
  }

  return (
    <>
      {open && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Coffee size={36} strokeWidth={2.2} />
          </div>

          <div className="brand-text">
            <span className="brand-name">Jewel</span>
            <span className="brand-subtitle">
              CAFÉ & RESTAURANT
            </span>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <div className="sidebar-section-label">
          MAIN MENU
        </div>

        <nav className="sidebar-navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon className="sidebar-link-icon" size={21} />

                <span className="sidebar-link-label">
                  {item.label}
                </span>

                {item.expandable && (
                  <span className="sidebar-chevron">›</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-divider" />

        <nav className="sidebar-navigation sidebar-secondary">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Settings size={21} className="sidebar-link-icon" />
            <span className="sidebar-link-label">Settings</span>
            <span className="sidebar-chevron">›</span>
          </NavLink>
        </nav>

        <div className="sidebar-tagline">
          <span>Good Food</span>
          <span>Good Mood ♡</span>
        </div>

        <div className="sidebar-footer">
          <div className="admin-avatar">
            <UserRound size={23} />
          </div>

          <div className="admin-info">
            <span className="admin-name">Admin</span>
            <span className="admin-role">Administrator</span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={19} />
          </button>
        </div>
      </aside>
    </>
  );
}
