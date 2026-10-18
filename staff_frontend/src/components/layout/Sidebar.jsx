function Sidebar({ navigate = () => {} }) {
  const links = [
    { label: "Dashboard", page: "admin" },
    { label: "Menu Management", page: "admin-menu" },
    { label: "Table QR Management", page: "admin-tables" },
    { label: "Cashier", page: "cashier" },
    { label: "Kitchen", page: "kitchen" },
  ];

  return (
    <aside className="sidebar">
      <h2>Staff Panel</h2>

      {links.map((link) => (
        <button
          key={link.page}
          type="button"
          className="sidebar-link"
          onClick={() => navigate(link.page)}
        >
          {link.label}
        </button>
      ))}
    </aside>
  );
}

export default Sidebar;