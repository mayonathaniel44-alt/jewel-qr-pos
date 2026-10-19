import logo from "../../assets/jewel-logo.png";
const money = (n) => `₱ ${Number(n).toLocaleString("en-PH")}`;

export default function RunningTabPage({ cart, cartTotal, tableNo, setCustomerPage, changeQty }) {
  return <section className="jc-screen jc-running">
    <header className="jc-simple-header"><button className="jc-back" onClick={() => setCustomerPage("Menu")}>←</button><img src={logo} alt="Jewel"/></header>
    <h2>Running Tab</h2><p className="jc-center-table">Table {tableNo}</p>
    <div className="jc-running-list">{cart.map((item) => <div className="jc-running-row" key={item.id}><span>{item.name}</span><span>{money(item.price * item.qty)}</span></div>)}</div>
    <div className="jc-running-total"><b>Total</b><b>{money(cartTotal)}</b></div>
    <button className="jc-primary jc-bill-button" onClick={() => window.alert("Bill request sent to the staff.")}>Request Bill</button>
    <button className="jc-text-button" onClick={() => setCustomerPage("Menu")}>+ Order more</button>
  </section>;
}