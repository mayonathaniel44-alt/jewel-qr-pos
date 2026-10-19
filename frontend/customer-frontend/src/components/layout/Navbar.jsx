import logo from "../../assets/jewel-logo.png";

export default function Navbar({ cartCount = 0, onCartClick }) {
  return (
    <header className="jc-menu-header">
      <img src={logo} alt="Jewel Café & Restaurant" />
      <button className="jc-cart-icon" onClick={onCartClick} aria-label="Open cart">
        🛒{cartCount > 0 && <i>{cartCount}</i>}
      </button>
    </header>
  );
}
