
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Tables from "./pages/Tables";
import Menu from "./pages/Menu";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
