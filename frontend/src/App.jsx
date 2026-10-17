import { useMemo, useState } from "react";
import "./App.css";
import logo from "./assets/jewel-logo.png";
import pasta from "./assets/pasta.png";
import egg from "./assets/egg.png";
import chicken from "./assets/chicken.png";
import kaldereta from "./assets/kaldereta.png";

const initialMenu = [
  { id: 1, name: "Classic Style Pasta", price: 110, image: pasta, available: true, category: "Pasta" },
  { id: 2, name: "Egg", price: 99, image: egg, available: true, category: "Breakfast" },
  { id: 3, name: "Chicken", price: 300, image: chicken, available: true, category: "Meals" },
  { id: 4, name: "Kaldereta", price: 460, image: kaldereta, available: false, category: "Meals" },
];
const initialOrders = [
  { id: "#1069", table: 1, time: "3:19 pm", items: [{ name: "Chicken Burger", qty: 1, price: 320 }], status: "Pending" },
  { id: "#1456", table: 1, time: "3:17 pm", items: [{ name: "Classic Style Pasta", qty: 2, price: 110 }], status: "Pending" },
  { id: "#1031", table: 2, time: "3:12 pm", items: [{ name: "Egg", qty: 1, price: 99 }], status: "Preparing" },
];
const navItems = [
  ["Dashboard", "⌂"], ["Orders", "☰"], ["Tables", "▦"], ["Menu", "☷"], ["Payments", "▤"], ["Reports", "▥"],
];
const money = (n) => `₱ ${Number(n).toLocaleString("en-PH")}`;

function App() {
  const [page, setPage] = useState("Dashboard");
  const [menu, setMenu] = useState(initialMenu);
  const [orders, setOrders] = useState(initialOrders);
  const [customerMode, setCustomerMode] = useState(false);
  const [customerPage, setCustomerPage] = useState("Welcome");
  const [tableNo, setTableNo] = useState(1);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState("#1069");
  const [paidOrders, setPaidOrders] = useState([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const filteredMenu = useMemo(() => menu.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) && (category === "All" || item.category === category) && item.available), [menu, search, category]);

  const goCustomer = () => { setCustomerMode(true); setCustomerPage("Welcome"); };
  const goStaff = () => { setCustomerMode(false); setPage("Dashboard"); };
  const addToCart = (item) => setCart((old) => {
    const found = old.find((x) => x.id === item.id);
    return found ? old.map((x) => x.id === item.id ? { ...x, qty: x.qty + 1 } : x) : [...old, { ...item, qty: 1 }];
  });
  const changeQty = (id, amount) => setCart((old) => old.map((x) => x.id === id ? { ...x, qty: x.qty + amount } : x).filter((x) => x.qty > 0));
  const placeOrder = () => {
    if (!cart.length) return;
    const order = { id: `#${Math.floor(1000 + Math.random() * 8999)}`, table: tableNo, time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), items: cart.map(({ name, qty, price }) => ({ name, qty, price })), status: "Pending" };
    setOrders((old) => [order, ...old]); setSelectedOrder(order.id); setCart([]); setCustomerPage("Order Complete");
  };

  if (customerMode) return <CustomerApp {...{ customerPage, setCustomerPage, tableNo, setTableNo, menu, filteredMenu, search, setSearch, category, setCategory, cart, cartTotal, addToCart, changeQty, placeOrder, selectedOrder, setCustomerMode, goStaff }} />;

  return (
    <div className="staff-shell">
      <aside className="sidebar">
        <img className="sidebar-logo" src={logo} alt="Jewel Café and Restaurant" />
        <nav className="side-nav">
          {navItems.map(([label, icon]) => <button key={label} className={`nav-button ${page === label ? "active" : ""}`} onClick={() => setPage(label)}><span className="nav-icon">{icon}</span>{label}</button>)}
        </nav>
        <div className="side-bottom"><button className={`nav-button ${page === "Settings" ? "active" : ""}`} onClick={() => setPage("Settings")}><span className="nav-icon">⚙</span>Settings</button><button className="nav-button" onClick={goCustomer}><span className="nav-icon">⇥</span>Customer View</button><button className="nav-button" onClick={goCustomer}><span className="nav-icon">↪</span>Log out</button></div>
      </aside>
      <main className="staff-main">
        {page === "Dashboard" && <Dashboard orders={orders} menu={menu} />}
        {page === "Orders" && <OrdersPage orders={orders} setOrders={setOrders} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />}
        {page === "Tables" && <TablesPage orders={orders} setTableNo={setTableNo} setCustomerMode={setCustomerMode} setCustomerPage={setCustomerPage} />}
        {page === "Menu" && <MenuPage menu={menu} setMenu={setMenu} />}
        {page === "Payments" && <PaymentsPage orders={orders} paidOrders={paidOrders} setPaidOrders={setPaidOrders} />}
        {page === "Reports" && <ReportsPage orders={orders} paidOrders={paidOrders} />}
        {page === "Settings" && <SettingsPage />}
      </main>
    </div>
  );
}

function Dashboard({ orders, menu }) {
  const pending = orders.filter((x) => x.status === "Pending").length;
  const sales = orders.filter((x) => x.status === "Completed").reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty * i.price, 0), 0);
  return <section className="admin-page dashboard-page"><h1>Dashboard</h1><div className="stats-grid"><div className="stat-card gray"><strong>12</strong><span>Active tables</span></div><div className="stat-card gray-dark"><strong>{pending}</strong><span>Pending Orders</span></div><div className="stat-card pink-stat"><strong>{money(sales || 15)}</strong><span>Today's Sale</span></div><div className="stat-card coral-stat"><strong>{orders.length + 10}</strong><span>Total Orders</span></div></div><div className="bottom-line" /></section>;
}

function OrdersPage({ orders, setOrders, selectedOrder, setSelectedOrder }) {
  const selected = orders.find((o) => o.id === selectedOrder) || orders[0];
  const total = selected ? selected.items.reduce((s, i) => s + i.qty * i.price, 0) : 0;
  const update = (status) => setOrders((old) => old.map((o) => o.id === selected?.id ? { ...o, status } : o));
  return <section className="admin-page"><h1>Incoming Orders</h1><div className="orders-layout"><div className="order-list">{orders.map((o) => <button key={o.id} onClick={() => setSelectedOrder(o.id)} className={`order-preview ${selectedOrder === o.id ? "selected" : ""}`}><div className="order-preview-top"><b>Order {o.id}</b><span>{o.time}</span></div><b>Table {o.table}</b><p>{o.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p><div className="order-preview-bottom"><span>{money(o.items.reduce((s, i) => s + i.qty * i.price, 0))}</span><span className={`status ${o.status.toLowerCase()}`}>{o.status}</span></div></button>)}</div><div className="order-detail"><h2>Order {selected?.id || "—"}</h2><h3>Table {selected?.table || "—"}</h3>{selected?.items.map((i, idx) => <div className="detail-row" key={idx}><span>{i.qty}x {i.name}</span><span>{money(i.qty * i.price)}</span></div>)}<hr/><div className="detail-row"><b>Subtotal</b><b>{money(total)}</b></div><div className="detail-row"><b>Total</b><b>{money(total)}</b></div><p className="muted">Payment Status: {selected?.status === "Completed" ? "Paid" : "Unpaid"}</p><button className="primary-button full" onClick={() => update("Preparing")}>Send to Kitchen</button><div className="button-pair"><button className="soft-button" onClick={() => update("Ready")}>Mark Ready</button><button className="soft-button" onClick={() => update("Completed")}>Complete</button></div></div></div></section>;
}

function TablesPage({ orders, setTableNo, setCustomerMode, setCustomerPage }) {
  const tables = Array.from({ length: 9 }, (_, i) => { const no = i + 1; const order = orders.find((o) => o.table === no && o.status !== "Completed"); return { no, order }; });
  return <section className="admin-page"><h1>Active Tables</h1><div className="tables-grid">{tables.map(({ no, order }) => <button className="table-card" key={no} onClick={() => { setTableNo(no); setCustomerMode(true); setCustomerPage("Menu"); }}><b>Table {no}</b><strong>{order ? money(order.items.reduce((s, i) => s + i.qty * i.price, 0)) : money(0)}</strong><span>{order ? `${order.items.length} order item(s)` : "0 orders"}</span><em className={order ? order.status.toLowerCase() : "available"}>{order ? order.status : "Available"}</em></button>)}</div><div className="bottom-line" /></section>;
}

function MenuPage({ menu, setMenu }) {
  const toggle = (id) => setMenu((old) => old.map((x) => x.id === id ? { ...x, available: !x.available } : x));
  return <section className="admin-page"><h1>Menu Management</h1><div className="management-list">{menu.map((item) => <div className="menu-management-card" key={item.id}><img src={item.image} alt={item.name}/><div className="menu-item-text"><b>{item.name}</b><span>{money(item.price)}</span></div><strong className={item.available ? "available-text" : "unavailable-text"}>{item.available ? "Available" : "Unavailable"}</strong><button className={`toggle ${item.available ? "on" : ""}`} onClick={() => toggle(item.id)} aria-label={`Toggle ${item.name}`}><span /></button></div>)}</div></section>;
}

function PaymentsPage({ orders, paidOrders, setPaidOrders }) {
  const unpaid = orders.filter((o) => o.status !== "Completed" && !paidOrders.includes(o.id));
  const complete = (id) => setPaidOrders((old) => [...old, id]);
  const all = [...unpaid, ...orders.filter((o) => paidOrders.includes(o.id))];
  return <section className="admin-page"><h1>Payment</h1><div className="payments-grid">{(all.length ? all : [{ id: "—", table: 1, items: [], status: "Completed" }]).map((o) => { const total = o.items.reduce((s, i) => s + i.qty * i.price, 0); const isPaid = paidOrders.includes(o.id); return <div className="payment-card" key={o.id}><h2>Table {o.table}</h2><b>Total amount</b><strong className="payment-total">{money(total)}</strong><b>Payment Method</b><div className="payment-options"><label><input type="radio" name={`pay-${o.id}`} defaultChecked/> Cash</label><label><input type="radio" name={`pay-${o.id}`}/> GCash</label><label><input type="radio" name={`pay-${o.id}`}/> Card</label></div><div className="detail-row"><span>Amount Paid</span><span>{money(total)}</span></div><div className="detail-row"><span>Change</span><span>{money(0)}</span></div><button className="primary-button full" disabled={isPaid} onClick={() => complete(o.id)}>{isPaid ? "Payment Complete" : "Complete payment"}</button></div>; })}</div></section>;
}

function ReportsPage({ orders, paidOrders }) { return <section className="admin-page"><h1>Reports</h1><div className="report-cards"><div className="stat-card gray"><strong>{orders.length}</strong><span>Total Orders</span></div><div className="stat-card pink-stat"><strong>{paidOrders.length}</strong><span>Paid Orders</span></div><div className="stat-card coral-stat"><strong>{money(orders.filter((o) => paidOrders.includes(o.id)).reduce((s, o) => s + o.items.reduce((t, i) => t + i.qty * i.price, 0), 0))}</strong><span>Total Sales</span></div></div><p className="muted">Order and payment summary for Jewel Café &amp; Restaurant.</p></section>; }
function SettingsPage() { return <section className="admin-page"><h1>Settings</h1><div className="settings-card"><h2>Jewel Café &amp; Restaurant</h2><label>Restaurant name<input defaultValue="Jewel Café & Restaurant"/></label><label>Currency<input defaultValue="PHP (₱)"/></label><label>Order notifications<select defaultValue="on"><option value="on">Enabled</option><option value="off">Disabled</option></select></label><button className="primary-button" onClick={() => alert("Settings saved.")}>Save Settings</button></div></section>; }

function CustomerApp(props) {
  const { customerPage, setCustomerPage, tableNo, setTableNo, menu, filteredMenu, search, setSearch, category, setCategory, cart, cartTotal, addToCart, changeQty, placeOrder, selectedOrder, goStaff } = props;
  const [selectedItem, setSelectedItem] = useState(menu[0]);
  const [trackStep, setTrackStep] = useState(1);
  const [qty, setQty] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const showPage = (p) => setCustomerPage(p);
  const addSelected = () => { for (let i = 0; i < qty; i++) addToCart(selectedItem); setQty(1); showPage("Menu"); };
  return <div className="customer-shell"><div className="customer-top"><button className="back-button" onClick={() => customerPage === "Welcome" ? goStaff() : showPage("Menu")}>‹</button><img src={logo} alt="Jewel"/><button className="cart-top" onClick={() => showPage("Running Tab")}>🛒 <span>{cart.reduce((s, i) => s + i.qty, 0)}</span></button></div>
    {customerPage === "Welcome" && <div className="welcome-screen"><img className="customer-logo-large" src={logo} alt="Jewel Café"/><h1>Welcome!</h1><p>You are now ordering from</p><h2>Table {tableNo}</h2><img className="welcome-food" src={pasta} alt="Food"/><div className="mini-food-row"><img src={egg} alt="Egg"/><img src={chicken} alt="Chicken"/><img src={kaldereta} alt="Kaldereta"/></div><button className="primary-button" onClick={() => showPage("Menu")}>View Menu</button></div>}
    {customerPage === "Menu" && <div className="customer-menu-page"><h1>Jewel</h1><p className="customer-subtitle">Scan. Order. Enjoy.</p><input className="search-input" placeholder="Search Menu" value={search} onChange={(e) => setSearch(e.target.value)}/><div className="category-row">{["All", "Pasta", "Breakfast", "Meals"].map((c) => <button className={category === c ? "selected" : ""} key={c} onClick={() => setCategory(c)}>{c}</button>)}</div><h2>Best Sellers</h2><div className="customer-food-list">{filteredMenu.map((item) => <button className="customer-food-card" key={item.id} onClick={() => { setSelectedItem(item); setQty(1); showPage("Add to Cart"); }}><img src={item.image} alt={item.name}/><span><b>{item.name}</b><small>{item.category}</small><strong>{money(item.price)}</strong></span><em>＋</em></button>)}</div><button className="primary-button full" onClick={() => showPage("Running Tab")}>View Running Tab ({cart.length})</button></div>}
    {customerPage === "Add to Cart" && <div className="add-item-page"><img className="food-detail-image" src={selectedItem.image} alt={selectedItem.name}/><h1>{selectedItem.name}</h1><strong>{money(selectedItem.price)}</strong><p>Freshly prepared and served with care.</p><div className="qty-control"><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><b>{qty}</b><button onClick={() => setQty(qty + 1)}>＋</button></div><label className="special-label">Special instruction<input placeholder="Add a note"/></label><button className="primary-button full" onClick={addSelected}>Add to cart · {money(selectedItem.price * qty)}</button></div>}
    {customerPage === "Running Tab" && <div className="running-tab-page"><h1>Running Tab</h1><p className="center">Table {tableNo}</p>{cart.length === 0 ? <p className="empty-cart">Your cart is empty.</p> : cart.map((item) => <div className="cart-line" key={item.id}><span>{item.name}<small>{money(item.price)} each</small></span><div className="qty-small"><button onClick={() => changeQty(item.id, -1)}>−</button><b>{item.qty}</b><button onClick={() => changeQty(item.id, 1)}>＋</button></div><strong>{money(item.qty * item.price)}</strong></div>)}<div className="cart-total"><span>Total</span><b>{money(cartTotal)}</b></div><button className="primary-button full" disabled={!cart.length} onClick={() => showPage("Place Order")}>Request Bill / Place Order</button><button className="text-button" onClick={() => showPage("Menu")}>＋ Add more items</button></div>}
    {customerPage === "Place Order" && <div className="place-order-page"><h1>Place Order</h1><p>Table {tableNo}</p>{cart.map((item) => <div className="cart-line" key={item.id}><span>{item.qty} × {item.name}</span><strong>{money(item.qty * item.price)}</strong></div>)}<div className="cart-total"><span>Total</span><b>{money(cartTotal)}</b></div><button className="primary-button full" disabled={!cart.length} onClick={placeOrder}>Place Order</button><button className="text-button" onClick={() => showPage("Running Tab")}>Back to running tab</button></div>}
    {customerPage === "Order Complete" && <div className="order-complete-page"><div className="success-check">✓</div><h1>Order Received!</h1><p>Thank you! Your order has been sent to the kitchen.</p><div className="order-ticket"><b>Order {selectedOrder}</b><strong>Table {tableNo}</strong><small>Please wait while we prepare your food.</small></div><button className="primary-button full" onClick={() => { setTrackStep(1); showPage("Track Order"); }}>Track Order</button><button className="text-button" onClick={() => showPage("Menu")}>Back to menu</button></div>}
    {customerPage === "Track Order" && <div className="track-order-page"><h1>Order {selectedOrder}</h1><p>Table {tableNo}</p><div className="tracking-list">{["Order Received", "Confirmed", "Preparing", "Ready", "Served"].map((s, i) => <div className={`tracking-step ${i <= trackStep ? "done" : ""}`} key={s}><span>{i < trackStep ? "✓" : i + 1}</span><b>{s}</b></div>)}</div><button className="primary-button full" onClick={() => setTrackStep((s) => Math.min(4, s + 1))}>Refresh Status</button><button className="text-button" onClick={() => showPage("Running Tab")}>View Running Tab</button></div>}
    <button className="customer-exit" onClick={goStaff}>Staff view</button>
  </div>;
}

export default App;
