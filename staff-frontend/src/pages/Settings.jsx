import { useEffect, useState } from "react";
import "./Settings.css";

const DEFAULT_SETTINGS = {
  restaurantName: "Jewel Cafe & Restaurant",
  address: "",
  phone: "",
  email: "",
  currency: "PHP",
  taxRate: "12",
  serviceCharge: "0",
  autoAcceptOrders: false,
  allowCustomerNotes: true,
  enableOrderNotifications: true,
  receiptFooter: "Thank you for dining with us!",
  showTaxOnReceipt: true,
  showServiceChargeOnReceipt: true,
  businessHours: "8:00 AM - 10:00 PM",
};

function loadSettings() {
  try {
    const saved = localStorage.getItem("jewel-pos-settings");
    return saved
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function Settings() {
  const [settings, setSettings] = useState(loadSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [message, setMessage] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  function updateSetting(event) {
    const { name, value, type, checked } = event.target;
    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function saveSettings(event) {
    event.preventDefault();

    const tax = Number(settings.taxRate);
    const service = Number(settings.serviceCharge);

    if (
      !settings.restaurantName.trim() ||
      !Number.isFinite(tax) ||
      tax < 0 ||
      tax > 100 ||
      !Number.isFinite(service) ||
      service < 0 ||
      service > 100
    ) {
      setMessage("Check the restaurant name, tax rate, and service charge.");
      return;
    }

    try {
      localStorage.setItem("jewel-pos-settings", JSON.stringify(settings));
      setMessage("Settings saved successfully.");
    } catch {
      setMessage("Unable to save settings in this browser.");
    }
  }

  function resetSettings() {
    setSettings({ ...DEFAULT_SETTINGS });
    localStorage.removeItem("jewel-pos-settings");
    setConfirmReset(false);
    setMessage("Settings restored to defaults.");
  }

  const tabs = [
    { id: "general", label: "General", icon: "🏪" },
    { id: "orders", label: "Orders", icon: "🧾" },
    { id: "billing", label: "Tax & Billing", icon: "₱" },
    { id: "receipt", label: "Receipt", icon: "🖨️" },
  ];

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <div>
          <span className="settings-eyebrow">ADMINISTRATION</span>
          <h1>System Settings</h1>
          <p>Manage your restaurant details and POS preferences.</p>
        </div>
        <button className="settings-save-top" onClick={saveSettings}>
          Save Changes
        </button>
      </div>

      {message && (
        <div className="settings-notice" role="status">
          <span>✓</span> {message}
        </div>
      )}

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <div className="settings-sidebar-title">CONFIGURATION</div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`settings-tab ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="settings-tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="settings-tab-arrow">›</span>
            </button>
          ))}

          <div className="settings-sidebar-note">
            <span className="settings-note-icon">ℹ</span>
            <strong>Configuration</strong>
            <p>Changes are stored in this browser until connected to the backend.</p>
          </div>
        </aside>

        <form className="settings-content" onSubmit={saveSettings}>
          {activeTab === "general" && (
            <>
              <section className="settings-card">
                <div className="settings-card-heading">
                  <div className="settings-card-icon">🏪</div>
                  <div>
                    <h2>Restaurant Information</h2>
                    <p>Basic information displayed throughout your POS.</p>
                  </div>
                </div>

                <div className="settings-form-grid">
                  <label className="settings-field full-width">
                    <span>Restaurant Name <b>*</b></span>
                    <input
                      name="restaurantName"
                      value={settings.restaurantName}
                      onChange={updateSetting}
                      required
                      placeholder="Enter restaurant name"
                    />
                  </label>

                  <label className="settings-field full-width">
                    <span>Business Address</span>
                    <input
                      name="address"
                      value={settings.address}
                      onChange={updateSetting}
                      placeholder="Street, city, province"
                    />
                  </label>

                  <label className="settings-field">
                    <span>Contact Number</span>
                    <input
                      name="phone"
                      type="tel"
                      value={settings.phone}
                      onChange={updateSetting}
                      placeholder="09XX XXX XXXX"
                    />
                  </label>

                  <label className="settings-field">
                    <span>Business Email</span>
                    <input
                      name="email"
                      type="email"
                      value={settings.email}
                      onChange={updateSetting}
                      placeholder="restaurant@example.com"
                    />
                  </label>

                  <label className="settings-field">
                    <span>Currency</span>
                    <select
                      name="currency"
                      value={settings.currency}
                      onChange={updateSetting}
                    >
                      <option value="PHP">PHP — Philippine Peso (₱)</option>
                      <option value="USD">USD — US Dollar ($)</option>
                    </select>
                  </label>

                  <label className="settings-field">
                    <span>Business Hours</span>
                    <input
                      name="businessHours"
                      value={settings.businessHours}
                      onChange={updateSetting}
                      placeholder="8:00 AM - 10:00 PM"
                    />
                  </label>
                </div>
              </section>
            </>
          )}

          {activeTab === "orders" && (
            <section className="settings-card">
              <div className="settings-card-heading">
                <div className="settings-card-icon">🧾</div>
                <div>
                  <h2>Order Preferences</h2>
                  <p>Configure how customer orders are handled.</p>
                </div>
              </div>

              <div className="settings-options">
                <div className="settings-option">
                  <div>
                    <strong>Automatically accept orders</strong>
                    <p>Accept incoming orders without manual staff approval.</p>
                    <span className="settings-warning">
                      Confirm your kitchen workflow before enabling this.
                    </span>
                  </div>
                  <label className="settings-switch">
                    <input
                      type="checkbox"
                      name="autoAcceptOrders"
                      checked={settings.autoAcceptOrders}
                      onChange={updateSetting}
                    />
                    <span className="settings-switch-track" />
                  </label>
                </div>

                <div className="settings-option">
                  <div>
                    <strong>Allow customer order notes</strong>
                    <p>Allow customers to add special instructions to orders.</p>
                  </div>
                  <label className="settings-switch">
                    <input
                      type="checkbox"
                      name="allowCustomerNotes"
                      checked={settings.allowCustomerNotes}
                      onChange={updateSetting}
                    />
                    <span className="settings-switch-track" />
                  </label>
                </div>

                <div className="settings-option">
                  <div>
                    <strong>Order notifications</strong>
                    <p>Enable the preference for notifications about new orders.</p>
                  </div>
                  <label className="settings-switch">
                    <input
                      type="checkbox"
                      name="enableOrderNotifications"
                      checked={settings.enableOrderNotifications}
                      onChange={updateSetting}
                    />
                    <span className="settings-switch-track" />
                  </label>
                </div>
              </div>

              <div className="settings-info-box">
                These switches currently save preferences only. Automatic order
                acceptance and actual notifications require backend integration.
              </div>
            </section>
          )}

          {activeTab === "billing" && (
            <>
              <section className="settings-card">
                <div className="settings-card-heading">
                  <div className="settings-card-icon">₱</div>
                  <div>
                    <h2>Tax & Service Charges</h2>
                    <p>Configure the rates used for billing calculations.</p>
                  </div>
                </div>

                <div className="settings-form-grid">
                  <label className="settings-field">
                    <span>Tax Rate (%)</span>
                    <input
                      type="number"
                      name="taxRate"
                      min="0"
                      max="100"
                      step="0.01"
                      value={settings.taxRate}
                      onChange={updateSetting}
                      required
                    />
                    <small>Default: 12%. Verify the applicable tax rules for your business.</small>
                  </label>

                  <label className="settings-field">
                    <span>Service Charge (%)</span>
                    <input
                      type="number"
                      name="serviceCharge"
                      min="0"
                      max="100"
                      step="0.01"
                      value={settings.serviceCharge}
                      onChange={updateSetting}
                      required
                    />
                    <small>Default: 0%. Set this according to your restaurant policy.</small>
                  </label>
                </div>

                <div className="settings-billing-preview">
                  <span>Example bill subtotal</span>
                  <strong>₱1,000.00</strong>
                  <div>
                    <span>Tax ({settings.taxRate || 0}%)</span>
                    <strong>
                      ₱{(1000 * (Number(settings.taxRate) || 0) / 100).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <div>
                    <span>Service charge ({settings.serviceCharge || 0}%)</span>
                    <strong>
                      ₱{(1000 * (Number(settings.serviceCharge) || 0) / 100).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <p>Illustrative preview only. Actual billing calculations are not yet connected.</p>
                </div>
              </section>
            </>
          )}

          {activeTab === "receipt" && (
            <section className="settings-card">
              <div className="settings-card-heading">
                <div className="settings-card-icon">🖨️</div>
                <div>
                  <h2>Receipt Configuration</h2>
                  <p>Customize receipt information and display preferences.</p>
                </div>
              </div>

              <div className="settings-options">
                <div className="settings-option">
                  <div>
                    <strong>Show tax breakdown</strong>
                    <p>Display tax information on receipts.</p>
                  </div>
                  <label className="settings-switch">
                    <input
                      type="checkbox"
                      name="showTaxOnReceipt"
                      checked={settings.showTaxOnReceipt}
                      onChange={updateSetting}
                    />
                    <span className="settings-switch-track" />
                  </label>
                </div>

                <div className="settings-option">
                  <div>
                    <strong>Show service charge</strong>
                    <p>Display the service charge breakdown on receipts.</p>
                  </div>
                  <label className="settings-switch">
                    <input
                      type="checkbox"
                      name="showServiceChargeOnReceipt"
                      checked={settings.showServiceChargeOnReceipt}
                      onChange={updateSetting}
                    />
                    <span className="settings-switch-track" />
                  </label>
                </div>
              </div>

              <label className="settings-field settings-footer-field">
                <span>Receipt Footer Message</span>
                <textarea
                  name="receiptFooter"
                  value={settings.receiptFooter}
                  onChange={updateSetting}
                  rows="3"
                  maxLength="250"
                  placeholder="Thank you for dining with us!"
                />
                <small>{settings.receiptFooter.length}/250 characters</small>
              </label>

              <div className="settings-receipt-preview">
                <span className="settings-preview-label">RECEIPT PREVIEW</span>
                <div className="settings-paper">
                  <strong>{settings.restaurantName || "Restaurant Name"}</strong>
                  {settings.address && <span>{settings.address}</span>}
                  {settings.phone && <span>{settings.phone}</span>}
                  <div className="settings-paper-line" />
                  <div className="settings-paper-row">
                    <span>Subtotal</span><span>₱1,000.00</span>
                  </div>
                  {settings.showTaxOnReceipt && (
                    <div className="settings-paper-row">
                      <span>Tax ({settings.taxRate}%)</span>
                      <span>₱{(1000 * (Number(settings.taxRate) || 0) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {settings.showServiceChargeOnReceipt && (
                    <div className="settings-paper-row">
                      <span>Service charge</span>
                      <span>₱{(1000 * (Number(settings.serviceCharge) || 0) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="settings-paper-line" />
                  <p>{settings.receiptFooter || "Thank you!"}</p>
                </div>
              </div>
            </section>
          )}

          <div className="settings-bottom-actions">
            <button
              type="button"
              className="settings-reset-button"
              onClick={() => setConfirmReset(true)}
            >
              Restore Defaults
            </button>
            <button type="submit" className="settings-save-button">
              Save Settings
            </button>
          </div>
        </form>
      </div>

      {confirmReset && (
        <div className="settings-modal-backdrop">
          <div className="settings-confirm-modal" role="dialog" aria-modal="true">
            <div className="settings-modal-icon">!</div>
            <h2>Restore default settings?</h2>
            <p>This resets all settings on this browser to their original values.</p>
            <div className="settings-modal-actions">
              <button
                type="button"
                className="settings-cancel-button"
                onClick={() => setConfirmReset(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="settings-confirm-button"
                onClick={resetSettings}
              >
                Restore Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
