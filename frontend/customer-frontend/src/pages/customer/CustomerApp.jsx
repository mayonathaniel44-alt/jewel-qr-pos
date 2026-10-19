import { useMemo, useState } from "react";
import CustomerLayout from "../../layouts/CustomerLayout.jsx";
import CustomerSidebar from "../../components/layout/CustomerSidebar.jsx";
import WelcomePage from "./WelcomePage.jsx";
import MenuPage from "./MenuPage.jsx";
import CartPage from "./CartPage.jsx";
import ProductDetailsPage from "./ProductDetailsPage.jsx";
import OrderCompletePage from "./OrderCompletePage.jsx";
import OrderStatusPage from "./OrderStatusPage.jsx";
import RunningTabPage from "./RunningTabPage.jsx";
import chicken from "../../assets/chicken.png";
import egg from "../../assets/egg.png";
import kaldereta from "../../assets/kaldereta.png";
import pasta from "../../assets/pasta.png";

const initialMenu = [
  { id: 1, name: "Tender Beef, Rich Kaldereta Sauce", price: 320, image: kaldereta, available: true, category: "Best Sellers" },
  { id: 2, name: "Chicken Cravings Solved", price: 200, image: chicken, available: true, category: "Meals" },
  { id: 3, name: "Rich Morning Classic", price: 150, image: egg, available: true, category: "Meals" },
  { id: 4, name: "Sweet Style Pasta", price: 320, image: pasta, available: true, category: "Meals" },
  { id: 5, name: "Egg", price: 150, image: egg, available: true, category: "Snacks" },
  { id: 6, name: "Fries", price: 250, image: pasta, available: true, category: "Snacks" },
  { id: 7, name: "Coca Cola - S", price: 250, image: egg, available: true, category: "Drinks" },
];

export default function CustomerApp() {
  const [customerPage, setCustomerPage] = useState("Welcome");
  const [tableNo] = useState(() => new URLSearchParams(window.location.search).get("table") || "1");
  const [menu] = useState(initialMenu);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("#1031");
  const [selectedItem, setSelectedItem] = useState(initialMenu[0]);
  const [qty, setQty] = useState(1);
  const [addons, setAddons] = useState([]);
  const [note, setNote] = useState("");
  const [trackStep, setTrackStep] = useState(2);

  const filteredMenu = useMemo(() => menu.filter(item => item.available &&
    (category === "All" || category === "Best Sellers" ? category === "All" || item.id === 1 : item.category === category) &&
    `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase())), [menu, category, search]);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty + (item.addonCost || 0) * item.qty, 0);

  function addToCart(item) {
    const key = `${item.id}-${(item.addons || []).join(",")}-${item.note || ""}`;
    setCart(old => {
      const found = old.find(x => x.cartKey === key);
      return found ? old.map(x => x.cartKey === key ? { ...x, qty: x.qty + 1 } : x)
        : [...old, { ...item, cartKey: key, qty: 1 }];
    });
  }
  function changeQty(id, amount) {
    setCart(old => old.map(item => item.id === id ? { ...item, qty: item.qty + amount } : item).filter(item => item.qty > 0));
  }
  function openProduct(item) { setSelectedItem(item); setQty(1); setAddons([]); setNote(""); setCustomerPage("Add to Cart"); }
  function addSelected() {
    const addonCost = addons.reduce((sum, item) => sum + (item === "Extra cheese" ? 25 : 15), 0);
    const item = { ...selectedItem, addonCost, addons, note };
    setCart(old => [...old, { ...item, cartKey: `${item.id}-${Date.now()}`, qty }]);
    setCustomerPage("Place Order");
  }
  function placeOrder() {
    if (!cart.length) { setCustomerPage("Menu"); return; }
    setSelectedOrder(`#${Math.floor(1000 + Math.random() * 8999)}`);
    setCustomerPage("Order Complete");
  }

  const shared = { customerPage, setCustomerPage, tableNo, menu, filteredMenu, search, setSearch,
    category, setCategory, cart, cartTotal, addToCart, changeQty, placeOrder, selectedOrder,
    selectedItem, openProduct, qty, setQty, addons, setAddons, note, setNote, addSelected,
    trackStep, setTrackStep };

  return <CustomerLayout>
    <CustomerSidebar activePage={customerPage} setActivePage={setCustomerPage} cartCount={cart.reduce((sum, item) => sum + item.qty, 0)} />
    {customerPage === "Welcome" && <WelcomePage {...shared} />}
    {customerPage === "Menu" && <MenuPage {...shared} />}
    {customerPage === "Add to Cart" && <ProductDetailsPage {...shared} />}
    {customerPage === "Place Order" && <CartPage {...shared} />}
    {customerPage === "Order Complete" && <OrderCompletePage {...shared} />}
    {customerPage === "Track Order" && <OrderStatusPage {...shared} />}
    {customerPage === "Running Tab" && <RunningTabPage {...shared} />}
  </CustomerLayout>;
}
