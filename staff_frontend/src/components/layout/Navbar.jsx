function Navbar({ navigate = () => {} }) {
  return (
    <nav className="navbar">
      <button
        type="button"
        className="brand"
        onClick={() => navigate("menu")}
      >
        Egg Business
      </button>

      <div className="nav-links">
        <button onClick={() => navigate("menu")}>Menu</button>
        <button onClick={() => navigate("cart")}>Cart</button>
        <button onClick={() => navigate("order-status")}>
          Order Status
        </button>
      </div>
    </nav>
  );
}

export default Navbar;