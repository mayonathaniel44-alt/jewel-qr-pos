const money = (n) => `₱ ${Number(n).toLocaleString("en-PH")}`;

export default function ProductDetailsPage({ selectedItem, setCustomerPage, qty, setQty, addons, setAddons, note, setNote, addSelected }) {
  const toggle = (value, checked) => setAddons((old) => checked ? [...old, value] : old.filter((x) => x !== value));
  return <section className="jc-screen jc-product">
    <button className="jc-back" onClick={() => setCustomerPage("Menu")}>←</button>
    <div className="jc-product-hero"><img src={selectedItem?.image} alt={selectedItem?.name || "Menu item"}/></div>
    <div className="jc-product-details"><div className="jc-title-price"><h2>{selectedItem?.name}</h2><strong>{money(selectedItem?.price || 0)}</strong></div>
      <p className="jc-description">Rich, delicious toppings</p><h4>Add-ons</h4>
      {["Extra cheese", "Coke"].map((a) => <label className="jc-addon" key={a}><input type="checkbox" checked={addons.includes(a)} onChange={(e) => toggle(a, e.target.checked)}/>{a}</label>)}
      <h4>Quantity</h4><div className="jc-qty"><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><b>{qty}</b><button onClick={() => setQty(qty + 1)}>＋</button></div>
      <h4>Special Instruction</h4><input className="jc-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="note"/>
      <button className="jc-primary jc-add-button" onClick={addSelected}>Add to cart</button>
    </div>
  </section>;
}