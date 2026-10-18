import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Eye,
  EyeOff,
  X,
  UtensilsCrossed,
  RefreshCw,
  Image as ImageIcon,
  Trash2,
  Archive,
  RotateCcw,
} from "lucide-react";
import "./Menu.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const EMPTY_FORM = {
  name: "",
  categoryId: "",
  description: "",
  price: "",
  imageUrl: "",
  isAvailable: true,
};

function peso(value) {
  return `₱${Number(value || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Request failed (${response.status})`);
  }

  return result;
}

export default function Menu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [recyclingBinOpen, setRecyclingBinOpen] = useState(false);
  const [archivedItems, setArchivedItems] = useState([]);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [archiveError, setArchiveError] = useState("");
  const [archiveNotice, setArchiveNotice] = useState("");
  const [restoringId, setRestoringId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [categoryResult, itemResult] = await Promise.all([
        apiRequest("/menu/categories"),
        apiRequest("/menu/items?includeUnavailable=true"),
      ]);

      setCategories(categoryResult.data || []);
      setItems(itemResult.data || []);
    } catch (err) {
      setError(
        `${err.message}. Check that the backend is running and the database is available.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadArchivedItems = useCallback(async () => {
    setArchiveLoading(true);
    setArchiveError("");

    try {
      const result = await apiRequest("/menu/items/archived");
      setArchivedItems(result.data || []);
    } catch (err) {
      setArchiveError(err.message || "Could not load archived menu items.");
    } finally {
      setArchiveLoading(false);
    }
  }, []);

  async function openRecyclingBin() {
    setRecyclingBinOpen(true);
    setArchiveNotice("");
    await loadArchivedItems();
  }

  async function restoreArchivedItem(item) {
    setRestoringId(item.id);
    setArchiveError("");
    setArchiveNotice("");

    try {
      await apiRequest(`/menu/items/${item.id}/restore`, {
        method: "PATCH",
      });

      setArchiveNotice(`${item.name} was restored successfully.`);
      await loadArchivedItems();
      await loadData();
    } catch (err) {
      setArchiveError(err.message || "Could not restore this menu item.");
    } finally {
      setRestoringId(null);
    }
  }

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        (item.description || "").toLowerCase().includes(query) ||
        (item.category_name || "").toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" || item.category_id === categoryFilter;

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && item.is_available) ||
        (availabilityFilter === "unavailable" && !item.is_available);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [items, search, categoryFilter, availabilityFilter]);

  function openCreateModal() {
    setEditingItem(null);
    setForm({
      ...EMPTY_FORM,
      categoryId: categories[0]?.id || "",
    });
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setForm({
      name: item.name || "",
      categoryId: item.category_id || "",
      description: item.description || "",
      price: String(item.price ?? ""),
      imageUrl: item.image_url || "",
      isAvailable: Boolean(item.is_available),
    });
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function closeModal() {
    if (!saving) setModalOpen(false);
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        name: form.name.trim(),
        categoryId: form.categoryId,
        description: form.description.trim(),
        price: Number(form.price),
        imageUrl: form.imageUrl.trim(),
        isAvailable: form.isAvailable,
      };

      const result = await apiRequest(
        editingItem
          ? `/menu/items/${editingItem.id}`
          : "/menu/items",
        {
          method: editingItem ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      setNotice(result.message || "Menu item saved.");
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to save the menu item.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(item) {
    setError("");
    setNotice("");

    try {
      const result = await apiRequest(
        `/menu/items/${item.id}/availability`,
        {
          method: "PATCH",
          body: JSON.stringify({ isAvailable: !item.is_available }),
        }
      );

      setItems((previous) =>
        previous.map((current) =>
          current.id === item.id ? result.data : current
        )
      );

      setNotice(result.message || "Availability updated.");
    } catch (err) {
      setError(err.message || "Unable to update availability.");
    }
  }

  function removeMenuItem(item) {
    setError("");
    setNotice("");
    setItemToRemove(item);
  }

  async function confirmRemoveMenuItem() {
    if (!itemToRemove || removing) return;

    setRemoving(true);
    setError("");

    try {
      const result = await apiRequest(`/menu/items/${itemToRemove.id}`, {
        method: "DELETE",
      });

      setItems((previous) =>
        previous.filter((current) => current.id !== itemToRemove.id)
      );
      setNotice(result.message || "Menu item removed successfully.");
      setItemToRemove(null);
    } catch (err) {
      setError(err.message || "Unable to remove the menu item.");
    } finally {
      setRemoving(false);
    }
  }

  const availableCount = items.filter((item) => item.is_available).length;
  const unavailableCount = items.length - availableCount;

  return (
    <main className="menu-page">
      <header className="menu-page-header">
        <div>
          <p className="menu-eyebrow">JEWEL CAFE & RESTAURANT</p>
          <h1>Menu Management</h1>
          <p className="menu-subtitle">
            Manage your food items, prices, categories, and availability.
          </p>
        </div>

        <button className="menu-primary-button" onClick={openCreateModal}>
          <Plus size={18} />
          Add Menu Item
        </button>
      </header>

      {notice && (
        <div className="menu-alert menu-alert-success" role="status">
          {notice}
          <button
            className="menu-alert-close"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {error && (
        <div className="menu-alert menu-alert-error" role="alert">
          <span>{error}</span>
          <button
            className="menu-alert-close"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <section className="menu-stats">
        <article className="menu-stat-card">
          <span className="menu-stat-icon"><UtensilsCrossed size={20} /></span>
          <div>
            <p>Total Menu Items</p>
            <strong>{items.length}</strong>
          </div>
        </article>

        <article className="menu-stat-card">
          <span className="menu-stat-icon menu-stat-green"><Eye size={20} /></span>
          <div>
            <p>Available</p>
            <strong>{availableCount}</strong>
          </div>
        </article>

        <article className="menu-stat-card">
          <span className="menu-stat-icon menu-stat-muted"><EyeOff size={20} /></span>
          <div>
            <p>Unavailable</p>
            <strong>{unavailableCount}</strong>
          </div>
        </article>
      </section>

      <section className="menu-toolbar">
        <label className="menu-search">
          <Search size={19} />
          <input
            type="search"
            placeholder="Search food, description, or category..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by availability"
          value={availabilityFilter}
          onChange={(event) => setAvailabilityFilter(event.target.value)}
        >
          <option value="all">All availability</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <button
          className="menu-icon-button"
          onClick={loadData}
          title="Refresh menu"
          aria-label="Refresh menu"
          disabled={loading}
        >
          <RefreshCw size={18} />
        </button>
      </section>

      <div className="menu-results-heading menu-results-title">
        <div className="menu-results-label">
          <h2>Menu Items</h2>
          <span>{visibleItems.length} item{visibleItems.length !== 1 ? "s" : ""}</span>
        </div>

        <button
          type="button"
          className="recycling-bin-trigger"
          onClick={openRecyclingBin}
        >
          <Archive size={17} />
          <span>Recycling Bin</span>
        </button>
      </div>

      {loading ? (
        <div className="menu-state">
          <RefreshCw className="menu-spin" size={28} />
          <p>Loading menu items...</p>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="menu-state">
          <UtensilsCrossed size={34} />
          <h3>{items.length === 0 ? "Your menu is empty" : "No items found"}</h3>
          <p>
            {items.length === 0
              ? "Add your first menu item to start building your restaurant menu."
              : "Try another search or change your filters."}
          </p>
          {items.length === 0 && (
            <button className="menu-primary-button" onClick={openCreateModal}>
              <Plus size={18} />
              Add First Item
            </button>
          )}
        </div>
      ) : (
        <section className="menu-card-grid">
          {visibleItems.map((item) => (
            <article className="menu-item-card" key={item.id}>
              <div className="menu-item-image">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      event.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="menu-image-fallback"
                  style={{ display: item.image_url ? "none" : "flex" }}
                >
                  <ImageIcon size={34} />
                  <span>No image</span>
                </div>

                <span
                  className={`menu-availability-badge ${
                    item.is_available ? "is-available" : "is-unavailable"
                  }`}
                >
                  {item.is_available ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="menu-item-content">
                <span className="menu-category-label">
                  {item.category_name || "Uncategorized"}
                </span>
                <h3>{item.name}</h3>
                <p className="menu-item-description">
                  {item.description || "No description added."}
                </p>

                <div className="menu-item-price">{peso(item.price)}</div>

                <div className="menu-item-actions">
                  <button
                    className="menu-edit-button"
                    onClick={() => openEditModal(item)}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                  <button
                    className={`menu-availability-button ${
                      item.is_available ? "make-unavailable" : "make-available"
                    }`}
                    onClick={() => toggleAvailability(item)}
                  >
                    {item.is_available ? <EyeOff size={15} /> : <Eye size={15} />}
                    {item.is_available ? "Disable" : "Enable"}
                  </button>
                  <button
                    className="menu-remove-button"
                    onClick={() => removeMenuItem(item)}
                    title={`Remove ${item.name}`}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {modalOpen && (
        <div
          className="menu-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="menu-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-modal-title"
          >
            <header className="menu-modal-header">
              <div>
                <h2 id="menu-modal-title">
                  {editingItem ? "Edit Menu Item" : "Add Menu Item"}
                </h2>
                <p>Enter the item details below.</p>
              </div>
              <button
                className="menu-icon-button"
                onClick={closeModal}
                aria-label="Close form"
                disabled={saving}
              >
                <X size={20} />
              </button>
            </header>

            <form className="menu-form" onSubmit={handleSubmit}>
              <label>
                Item Name <span>*</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  maxLength={150}
                  required
                  placeholder="e.g. Classic Burger"
                />
              </label>

              <label>
                Category <span>*</span>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={updateField}
                  required
                  disabled={categories.length === 0}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <small>Create an active category in the database first.</small>
                )}
              </label>

              <label>
                Price (₱) <span>*</span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  max="99999999.99"
                  step="0.01"
                  value={form.price}
                  onChange={updateField}
                  required
                  placeholder="180.00"
                />
              </label>

              <label>
                Image URL
                <input
                  name="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={updateField}
                  maxLength={2000}
                  placeholder="https://example.com/food.jpg"
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  maxLength={5000}
                  rows={3}
                  placeholder="Describe the food item..."
                />
              </label>

              <label className="menu-checkbox-label">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={updateField}
                />
                Available for ordering
              </label>

              <footer className="menu-modal-actions">
                <button
                  type="button"
                  className="menu-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="menu-primary-button"
                  disabled={saving || categories.length === 0}
                >
                  {saving ? "Saving..." : editingItem ? "Save Changes" : "Add Item"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
      {recyclingBinOpen && (
        <div
          className="recycling-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && restoringId === null) {
              setRecyclingBinOpen(false);
            }
          }}
        >
          <section
            className="recycling-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recycling-title"
          >
            <header className="recycling-header">
              <div className="recycling-heading-icon">
                <Archive size={22} />
              </div>

              <div className="recycling-heading-copy">
                <p className="recycling-eyebrow">MENU MANAGEMENT</p>
                <h2 id="recycling-title">Recycling Bin</h2>
                <p>Restore menu items that were previously removed.</p>
              </div>

              <button
                type="button"
                className="recycling-close"
                onClick={() => setRecyclingBinOpen(false)}
                disabled={restoringId !== null}
                aria-label="Close Recycling Bin"
              >
                <X size={20} />
              </button>
            </header>

            {archiveError && (
              <div className="recycling-message recycling-error" role="alert">
                {archiveError}
              </div>
            )}

            {archiveNotice && (
              <div className="recycling-message recycling-success" role="status">
                {archiveNotice}
              </div>
            )}

            <div className="recycling-content">
              {archiveLoading ? (
                <div className="recycling-empty">
                  <RefreshCw className="menu-spin" size={25} />
                  <p>Loading archived items...</p>
                </div>
              ) : archivedItems.length === 0 ? (
                <div className="recycling-empty">
                  <Archive size={32} />
                  <h3>Your Recycling Bin is empty</h3>
                  <p>Removed menu items will appear here.</p>
                </div>
              ) : (
                <div className="recycling-list">
                  {archivedItems.map((item) => (
                    <article className="recycling-item" key={item.id}>
                      <div className="recycling-item-image">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} />
                        ) : (
                          <UtensilsCrossed size={22} />
                        )}
                      </div>

                      <div className="recycling-item-details">
                        <h3>{item.name}</h3>
                        <p>{item.category_name || "Uncategorized"}</p>
                        <strong>{peso(item.price)}</strong>
                      </div>

                      <button
                        type="button"
                        className="recycling-restore-button"
                        onClick={() => restoreArchivedItem(item)}
                        disabled={restoringId !== null}
                      >
                        <RotateCcw size={15} />
                        {restoringId === item.id ? "Restoring..." : "Restore"}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <footer className="recycling-footer">
              <span>
                {archivedItems.length} archived item
                {archivedItems.length !== 1 ? "s" : ""}
              </span>
              <button
                type="button"
                onClick={() => setRecyclingBinOpen(false)}
                disabled={restoringId !== null}
              >
                Done
              </button>
            </footer>
          </section>
        </div>
      )}

      {itemToRemove && (
        <div
          className="remove-confirm-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !removing) {
              setItemToRemove(null);
            }
          }}
        >
          <section
            className="remove-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-confirm-title"
          >
            <button
              type="button"
              className="remove-confirm-close"
              onClick={() => setItemToRemove(null)}
              disabled={removing}
              aria-label="Close confirmation"
            >
              <X size={19} />
            </button>

            <div className="remove-confirm-icon">
              <Trash2 size={25} />
            </div>

            <p className="remove-confirm-eyebrow">MENU MANAGEMENT</p>
            <h2 id="remove-confirm-title">Remove menu item?</h2>
            <p className="remove-confirm-description">
              You are about to remove
              <strong> {itemToRemove.name} </strong>
              from the active menu. Customers will no longer see this item.
            </p>

            <div className="remove-confirm-note">
              <span className="remove-confirm-note-dot" />
              This item will be hidden, not permanently deleted.
            </div>

            <div className="remove-confirm-actions">
              <button
                type="button"
                className="remove-confirm-cancel"
                onClick={() => setItemToRemove(null)}
                disabled={removing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="remove-confirm-submit"
                onClick={confirmRemoveMenuItem}
                disabled={removing}
              >
                <Trash2 size={16} />
                {removing ? "Removing..." : "Remove Item"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
