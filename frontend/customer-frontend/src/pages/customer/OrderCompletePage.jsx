export default function OrderCompletePage({ selectedOrder, tableNo, setCustomerPage }) {
  return <section className="jc-screen jc-complete">
    <div className="jc-success">✓</div><h2>Order Received!</h2>
    <p>Thank you! Your order has<br/>been sent to restaurant.</p>
    <div className="jc-ticket"><b>Order {selectedOrder}</b><strong>Table {tableNo}</strong><small>Estimated time</small><small>15-30 mins</small></div>
    <button className="jc-primary" onClick={() => setCustomerPage("Track Order")}>Track Order</button>
    <button className="jc-text-button" onClick={() => setCustomerPage("Menu")}>Back to menu</button>
  </section>;
}