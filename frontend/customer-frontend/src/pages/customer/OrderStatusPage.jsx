export default function OrderStatusPage({ selectedOrder, tableNo, setCustomerPage, trackStep, setTrackStep }) {
  const steps = ["Order received", "Confirmed", "Preparing", "Ready", "Served"];
  return <section className="jc-screen jc-track">
    <button className="jc-back" onClick={() => setCustomerPage("Menu")}>←</button>
    <h2>Order {selectedOrder}</h2><p className="jc-center-table">Table {tableNo}</p>
    <div className="jc-track-list">{steps.map((step, i) => <div className={`jc-track-step ${i <= trackStep ? "done" : ""}`} key={step}><span>{i <= trackStep ? "✓" : "×"}</span><div><b>{step}</b><small>{i < 3 ? ["3:15 pm", "3:17 pm", "3:21 pm"][i] : ""}</small></div></div>)}</div>
    <button className="jc-primary jc-track-button" onClick={() => setTrackStep((s) => Math.min(4, s + 1))}>Refresh Status</button>
    <button className="jc-primary jc-running-button" onClick={() => setCustomerPage("Running Tab")}>View Running Tab</button>
  </section>;
}