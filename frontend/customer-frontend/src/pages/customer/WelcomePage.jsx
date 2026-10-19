import logo from "../../assets/jewel-logo.png";
import pasta from "../../assets/pasta.png";
import egg from "../../assets/egg.png";
import chicken from "../../assets/chicken.png";
import kaldereta from "../../assets/kaldereta.png";

export default function WelcomePage({ tableNo, setCustomerPage }) {
  return <section className="jc-screen jc-welcome">
    <div className="jc-welcome-art"><img src={logo} alt="Jewel Café & Restaurant" /></div>
    <div className="jc-welcome-copy"><h1>Welcome!</h1><p>You are now ordering from</p><div className="jc-table-name">Table {tableNo}</div></div>
    <div className="jc-welcome-menu"><img className="jc-small-logo" src={logo} alt="Jewel Café & Restaurant"/><b>JEWEL CAFÉ & RESTAURANT</b>
      <div className="jc-food-preview"><img src={pasta} alt="Pasta"/><img src={kaldereta} alt="Kaldereta"/><img src={chicken} alt="Chicken"/><img src={egg} alt="Egg"/></div>
    </div>
    <button className="jc-pill-button" onClick={() => setCustomerPage("Menu")}>View Menu</button>
  </section>;
}