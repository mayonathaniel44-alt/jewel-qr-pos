
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, Bell, CalendarDays, ChevronDown } from "lucide-react";

import Sidebar from "../components/Sidebar";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/orders": "Orders",
  "/tables": "Tables",
  "/menu": "Menu Management",
  "/payments": "Payments",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="admin-layout">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="admin-main">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={23} />
          </button>

          <div className="topbar-heading">
            <span className="topbar-eyebrow">
              Jewel Café & Restaurant
            </span>
            <h1>{title}</h1>
          </div>

          <div className="topbar-actions">
            <div className="topbar-date">
              <CalendarDays size={18} />
              <span>
                {new Date().toLocaleDateString("en-PH", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <button
              className="notification-button"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={20} />
            </button>

            <button className="topbar-admin">
              <span className="topbar-avatar">A</span>
              <span>Admin</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
