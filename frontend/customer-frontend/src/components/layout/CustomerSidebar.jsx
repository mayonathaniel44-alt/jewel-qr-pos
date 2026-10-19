import { useState } from "react";
import {
  Menu as MenuIcon, X, Home, Utensils, ShoppingCart,
  PackageCheck, ReceiptText, ChevronRight
} from "lucide-react";

const links = [
  { label: "Welcome", icon: Home, page: "Welcome" },
  { label: "Search Menu", icon: Utensils, page: "Menu" },
  { label: "My Cart", icon: ShoppingCart, page: "Place Order" },
  { label: "Track Order", icon: PackageCheck, page: "Track Order" },
  { label: "Running Tab", icon: ReceiptText, page: "Running Tab" },
];

export default function CustomerSidebar({ activePage, setActivePage, cartCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  function navigate(page) {
    setActivePage(page);
    setIsOpen(false);
  }

  return <>
    <button className="jc-sidebar-toggle" type="button" onClick={() => setIsOpen(true)}
      aria-label="Open customer navigation" aria-expanded={isOpen}>
      <MenuIcon size={20} />
    </button>
    {isOpen && <button className="jc-sidebar-backdrop" type="button"
      aria-label="Close navigation" onClick={() => setIsOpen(false)} />}
    <aside className={`jc-sidebar ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
      <div className="jc-sidebar-brand">
        <img src="/src/assets/jewel-logo.png" alt="Jewel Café & Restaurant" />
        <button type="button" onClick={() => setIsOpen(false)} aria-label="Close menu"><X size={20} /></button>
      </div>
      <p className="jc-sidebar-label">CUSTOMER MENU</p>
      <nav className="jc-sidebar-nav" aria-label="Customer navigation">
        {links.map(({ label, icon: Icon, page }) => <button type="button" key={page}
          className={`jc-sidebar-link ${activePage === page ? "active" : ""}`}
          onClick={() => navigate(page)}>
          <Icon size={19} /><span>{label}</span>
          {page === "Place Order" && cartCount > 0 && <i className="jc-sidebar-count">{cartCount}</i>}
          <ChevronRight className="jc-sidebar-chevron" size={17} />
        </button>)}
      </nav>
      <div className="jc-sidebar-footer"><span>Jewel Café & Restaurant</span><small>Good Food, Good Mood ♡</small></div>
    </aside>
  </>;
}
