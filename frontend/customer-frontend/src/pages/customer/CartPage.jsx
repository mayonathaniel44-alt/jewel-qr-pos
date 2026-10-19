import logo from "../../assets/jewel-logo.png";
const money = (n) => `₱ ${Number(n).toLocaleString("en-PH")}`;

export default function CartPage({ cart, tableNo, cartTotal, setCustomerPage, changeQty, placeOrder }) {
  return <section className="jc-screen jc-cart">
    <header className="jc-simple-header"><button className="jc-back" onClick={() => setCustomerPage("Menu")}>←</button><img src={logo} alt="Jewel"/></header>
    <h2 className="jc-center-title">My Cart</h2><p className="jc-center-table">Table {tableNo}</p>
    <div className="jc-cart-list">{cart.map((item) => <article className="jc-cart-item" key={item.id}>
      <img src={item.image} alt={item.name}/><div className="jc-cart-info"><b>{item.name}</b><span>{money(item.price)}</span><div className="jc-qty-small"><button onClick={() => changeQty(item.id, -1)}>−</button>{item.qty}<button onClick={() => changeQty(item.id, 1)}>＋</button></div></div><button className="jc-remove" onClick={() => changeQty(item.id, -item.qty)}>×</button>
    </article>)}
    {!cart.length && <p className="jc-empty">Your cart is empty. Add items from the menu.</p>}</div>
    <div className="jc-totals"><div><span>Subtotal</span><span>{money(cartTotal)}</span></div><div><span>Service charge</span><span>{money(cart.length ? 5 : 0)}</span></div><div className="jc-total"><b>Total</b><b>{money(cartTotal + (cart.length ? 5 : 0))}</b></div></div>
    <button className="jc-primary jc-place-order" disabled={!cart.length} onClick={placeOrder}>Place Order</button><button className="jc-text-button" onClick={() => setCustomerPage("Menu")}>Add more items</button>
  </section>;
}