import { useMemo } from "react";
import Navbar from "../../components/layout/Navbar.jsx";

const money = (n) => `₱ ${Number(n).toLocaleString("en-PH")}`;

export default function MenuPage({ cart, filteredMenu, menu, search, setSearch, category, setCategory, setCustomerPage, openProduct }) {
  const categories = ["All", "Best Sellers", "Meals", "Snacks", "Drinks"];
  const items = useMemo(() => {
    const source = menu.filter((item) => item.available);
    return source.filter((item) => {
      const isBest = category === "Best Sellers" ? item.id === 1 : true;
      const categoryMatch = category === "All" || category === "Best Sellers" || item.category === category;
      return isBest && categoryMatch && `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase());
    });
  }, [menu, category, search]);
  const shown = search || category !== "All" ? items : (items.filter((item) => item.id === 1 || item.id === 2 || item.id === 3));
  return <section className="jc-screen jc-menu">
    <Navbar cartCount={cart.reduce((sum, item) => sum + (item.qty || 1), 0)} onCartClick={() => setCustomerPage("Place Order")} />
    <label className="jc-search"><span>☰</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Menu"/><span>⌕</span></label>
    <div className="jc-categories">{categories.map((c) => <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div>
    <h3 className="jc-section-heading">{category === "All" ? "Best Sellers" : category}</h3>
    <div className="jc-product-list">{(shown.length ? shown : filteredMenu).map((item) => <button className="jc-product-card" key={item.id} onClick={() => openProduct(item)}>
      <img src={item.image} alt={item.name}/><span className="jc-product-copy"><b>{item.name}</b><small>{item.category}</small><strong>{money(item.price)}</strong><em>Add to cart　＋</em></span>
    </button>)}</div>
    {cart.length > 0 && <button className="jc-bottom-cart" onClick={() => setCustomerPage("Place Order")}>View Cart ({cart.reduce((sum, item) => sum + (item.qty || 1), 0)})</button>}
  </section>;
}