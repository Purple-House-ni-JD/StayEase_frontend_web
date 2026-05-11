import { useState, useEffect } from "react";
import { C } from "../constants";
import { Badge } from "../components/UI";
import Shell from "../components/Shell";
import { roomsService } from "../api/rooms";
import { bookingsService } from "../api/bookings";
import { useAuth } from "../context/AuthContext"; // Ensure this file is fixed!

const navItems = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "rooms", icon: "🛏️", label: "Room Management" },
  { id: "reservations", icon: "📋", label: "Reservations" },
  { id: "reports", icon: "📈", label: "Sales Reports" },
];

/* ── ROOM MODAL ── */
const RoomModal = ({ room, onClose, refreshData }) => {
  const isEdit = !!room?.id;
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formData, setFormData] = useState({
    name: room?.name || "",
    category: room?.category || "standard",
    price_per_night: room?.price_per_night || "",
    max_guest: room?.max_guest || 2,
    description: room?.description || "",
    availability_status: room?.availability_status !== false,
    is_featured: room?.is_featured || false,
    image_urls: room?.image_urls || [],
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSelectedFiles(files);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        description:
          formData.description && formData.description.trim() !== ""
            ? formData.description
            : "No description provided.",
        price_per_night: parseFloat(formData.price_per_night) || 0.0,
        max_guest: parseInt(formData.max_guest, 10) || 2,
        availability_status: formData.availability_status,
        is_featured: formData.is_featured,
      };

      if (!isEdit) {
        payload.rating = 0.0;
      }

      let roomResponse = null;
      if (isEdit) {
        roomResponse = await roomsService.update(room.id, payload);
      } else {
        roomResponse = await roomsService.create(payload);
      }

      const roomId = isEdit ? room.id : roomResponse.id;
      if (selectedFiles.length > 0) {
        setUploadingImage(true);
        await roomsService.uploadImages(roomId, selectedFiles);
      }

      refreshData();
      onClose();
    } catch (error) {
      console.error("Error saving room:", error);
      let errorMsg = "Failed to save room.";
      if (error?.detail) errorMsg = error.detail;
      else if (typeof error === "object") errorMsg = JSON.stringify(error);
      alert(`Backend Error: ${errorMsg}`);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div
      className="mbg"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: C.neutral,
          borderRadius: 14,
          padding: "32px",
          width: 480,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <h3
            className="serif"
            style={{ color: C.primary, fontSize: "1.4rem", fontWeight: 600 }}
          >
            {isEdit ? "Edit Room" : "Add New Room"}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: C.gray,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <div>
            <label className="lbl">Room Name</label>
            <input
              name="name"
              className="inp"
              placeholder="e.g. Grand Imperial Suite"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div>
              <label className="lbl">Category</label>
              <select
                name="category"
                className="inp"
                value={formData.category}
                onChange={handleChange}
              >
                {/* FIXED: Values are now completely lowercase to match Django's backend tuple */}
                {[
                  { val: "standard", label: "Standard" },
                  { val: "deluxe", label: "Deluxe" },
                  { val: "superior", label: "Superior" },
                  { val: "junior_suite", label: "Junior Suite" },
                  { val: "executive_suite", label: "Executive Suite" },
                  { val: "family", label: "Family" },
                ].map((t) => (
                  <option key={t.val} value={t.val}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl">Price per Night (₱)</label>
              <input
                name="price_per_night"
                type="number"
                className="inp"
                placeholder="0.00"
                value={formData.price_per_night}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
            <div>
              <label className="lbl">Max Guests (Capacity)</label>
              <input
                name="max_guest"
                type="number"
                className="inp"
                placeholder="2"
                value={formData.max_guest}
                onChange={handleChange}
              />
            </div>

            {/* <-- NEW: Image Uploader & Preview Grid --> */}
            <div
              style={{
                background: C.grayXL,
                padding: 16,
                borderRadius: 12,
                border: `1px dashed ${C.grayL}`,
              }}
            >
              <label
                className="lbl"
                style={{ marginBottom: 8, display: "block" }}
              >
                Room Photos
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadingImage}
                style={{ marginBottom: 12 }}
              />
              {uploadingImage && (
                <span
                  className="sans"
                  style={{
                    color: C.secondary,
                    fontSize: ".8rem",
                    fontWeight: 600,
                  }}
                >
                  Uploading images to backend...
                </span>
              )}

              {selectedFiles.length > 0 && (
                <div
                  style={{
                    marginBottom: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <span
                    className="sans"
                    style={{ fontSize: ".85rem", color: C.gray }}
                  >
                    Selected files:
                  </span>
                  {selectedFiles.map((file, idx) => (
                    <span
                      key={idx}
                      className="sans"
                      style={{ fontSize: ".85rem", color: C.text }}
                    >
                      • {file.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Image Previews */}
              {formData.image_urls?.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    overflowX: "auto",
                    paddingBottom: 8,
                  }}
                >
                  {formData.image_urls.map((img, idx) => {
                    const url = img.image_url || img;
                    return (
                      <div
                        key={idx}
                        style={{ position: "relative", flexShrink: 0 }}
                      >
                        <img
                          src={url}
                          alt="Room Preview"
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: `1px solid ${C.grayL}`,
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData((prev) => ({
                              ...prev,
                              image_urls: prev.image_urls.filter(
                                (_, i) => i !== idx,
                              ),
                            }));
                          }}
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            background: C.red,
                            color: "#fff",
                            borderRadius: "50%",
                            border: "none",
                            cursor: "pointer",
                            width: 22,
                            height: 22,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: ".7rem",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="lbl">Description</label>
            <textarea
              name="description"
              className="inp"
              placeholder="Describe the room..."
              value={formData.description}
              onChange={handleChange}
              style={{ resize: "vertical", minHeight: "80px" }}
            />
          </div>

          {/* Toggles */}
          <div style={{ display: "flex", gap: 20, marginTop: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                name="availability_status"
                id="availability_status"
                checked={formData.availability_status}
                onChange={handleChange}
                style={{ accentColor: C.primary, width: 16, height: 16 }}
              />
              <label
                htmlFor="availability_status"
                className="sans"
                style={{ color: C.primary, fontSize: ".9rem", fontWeight: 500 }}
              >
                Available
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                name="is_featured"
                id="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                style={{ accentColor: C.primary, width: 16, height: 16 }}
              />
              <label
                htmlFor="is_featured"
                className="sans"
                style={{ color: C.primary, fontSize: ".9rem", fontWeight: 500 }}
              >
                Featured Room
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button
              className="btn-p"
              style={{ flex: 1, padding: "12px" }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Room"}
            </button>
            <button
              className="btn-o"
              style={{ flex: 1, padding: "12px" }}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── OVERVIEW TAB ── */
const OverviewTab = ({ setTab, setModal, rooms, bookings }) => {
  const totalRevenue = bookings
    .filter((b) => b.status === "completed" || b.status === "confirmed")
    .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="fi">
      <div style={{ marginBottom: 26 }}>
        <h1
          className="serif"
          style={{ color: C.primary, fontSize: "1.8rem", fontWeight: 600 }}
        >
          Dashboard Overview
        </h1>
        <p
          className="sans"
          style={{ color: C.gray, fontSize: ".85rem", marginTop: 4 }}
        >
          {new Date().toLocaleDateString("en-PH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
          gap: 18,
          marginBottom: 28,
        }}
      >
        <div className="sc n">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              className="sans"
              style={{
                color: C.gray,
                fontSize: ".68rem",
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}
            >
              Total Reservations
            </span>
            <span style={{ fontSize: "1.1rem" }}>📋</span>
          </div>
          <div
            className="serif"
            style={{
              color: C.primary,
              fontSize: "1.9rem",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {bookings.length}
          </div>
        </div>
        <div className="sc g">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              className="sans"
              style={{
                color: C.gray,
                fontSize: ".68rem",
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}
            >
              Est. Revenue
            </span>
            <span style={{ fontSize: "1.1rem" }}>💰</span>
          </div>
          <div
            className="serif"
            style={{
              color: C.primary,
              fontSize: "1.9rem",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            ₱{totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className="sc v">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              className="sans"
              style={{
                color: C.gray,
                fontSize: ".68rem",
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}
            >
              Total Rooms
            </span>
            <span style={{ fontSize: "1.1rem" }}>🏨</span>
          </div>
          <div
            className="serif"
            style={{
              color: C.primary,
              fontSize: "1.9rem",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {rooms.length}
          </div>
        </div>
        <div className="sc a">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              className="sans"
              style={{
                color: C.gray,
                fontSize: ".68rem",
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}
            >
              Pending
            </span>
            <span style={{ fontSize: "1.1rem" }}>⏳</span>
          </div>
          <div
            className="serif"
            style={{
              color: C.primary,
              fontSize: "1.9rem",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {pendingBookings}
          </div>
        </div>
      </div>

      {/* Recent reservations table */}
      <div
        style={{
          background: C.neutral,
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(10,29,55,.07)",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${C.grayL}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            className="serif"
            style={{ color: C.primary, fontSize: "1.1rem", fontWeight: 600 }}
          >
            Latest Reservations
          </h3>
          <span
            className="sans ul"
            style={{
              color: C.secondary,
              fontSize: ".78rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => setTab("reservations")}
          >
            View All →
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                {["Reference ID", "Guests", "Check-in", "Amount", "Status"].map(
                  (h) => (
                    <th key={h}>{h}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id}>
                  <td>
                    <span
                      className="sans"
                      style={{
                        color: C.secondary,
                        fontWeight: 700,
                        fontSize: ".8rem",
                      }}
                    >
                      {b.booking_ref}
                    </span>
                  </td>
                  <td>{b.guest_count} Guests</td>
                  <td>{b.check_in}</td>
                  <td>
                    <span
                      className="serif"
                      style={{ color: C.primary, fontWeight: 700 }}
                    >
                      ₱{parseFloat(b.total_price || 0).toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <Badge s={b.status} />
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No recent bookings
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ── ROOMS TAB ── */
const RoomsTab = ({ setModal, rooms, refreshData }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await roomsService.delete(id);
        refreshData();
      } catch (err) {
        alert("Failed to delete room.");
      }
    }
  };

  return (
    <div className="fi">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 22,
        }}
      >
        <div>
          <h2
            className="serif"
            style={{ color: C.primary, fontSize: "1.6rem", fontWeight: 600 }}
          >
            Room Management
          </h2>
          <p
            className="sans"
            style={{ color: C.gray, fontSize: ".85rem", marginTop: 4 }}
          >
            Create, edit, and manage all room listings
          </p>
        </div>
        <button
          className="btn-g"
          style={{ padding: "11px 24px" }}
          onClick={() => setModal("add")}
        >
          + Add New Room
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 22,
        }}
      >
        {rooms.length === 0 ? (
          <p style={{ color: C.gray, fontFamily: "sans-serif" }}>
            No rooms found. Add one above!
          </p>
        ) : (
          rooms.map((r) => (
            <div
              key={r.id}
              style={{
                background: C.neutral,
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(10,29,55,.07)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: 160,
                  backgroundColor: C.grayXL,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* FIXED DB FIELD: image_urls */}
                {r.image_urls?.length > 0 ? (
                  <img
                    src={r.image_urls[0].image_url || r.image_urls[0]}
                    alt={r.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      color: C.gray,
                      fontFamily: "sans-serif",
                      fontSize: "0.8rem",
                    }}
                  >
                    No Image Provided
                  </span>
                )}
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  {/* FIXED DB FIELD: availability_status */}
                  <span
                    style={{
                      background: r.availability_status ? "#DCFCE7" : "#FEE2E2",
                      color: r.availability_status ? "#166534" : C.red,
                      fontSize: ".62rem",
                      fontWeight: 700,
                      padding: "3px 9px",
                      borderRadius: 4,
                      fontFamily: "DM Sans,sans-serif",
                      textTransform: "uppercase",
                    }}
                  >
                    {r.availability_status ? "Active" : "Inactive"}
                  </span>
                </div>
                <div style={{ position: "absolute", bottom: 10, left: 12 }}>
                  {/* FIXED DB FIELD: category */}
                  <span
                    className="sans"
                    style={{
                      background: "rgba(10,29,55,.8)",
                      color: C.secondary,
                      fontSize: ".62rem",
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      padding: "3px 9px",
                      borderRadius: 4,
                    }}
                  >
                    {r.category || "Standard"}
                  </span>
                </div>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <h4
                    className="serif"
                    style={{
                      color: C.primary,
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {r.name}
                  </h4>
                  <span
                    className="serif"
                    style={{ color: C.secondary, fontWeight: 700 }}
                  >
                    ₱{parseFloat(r.price_per_night || 0).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    style={{
                      flex: 1,
                      background: C.primary,
                      color: C.secondary,
                      border: "none",
                      padding: "9px",
                      borderRadius: 8,
                      fontFamily: "DM Sans,sans-serif",
                      fontSize: ".72rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    onClick={() => setModal(r)}
                  >
                    EDIT
                  </button>
                  <button
                    style={{
                      width: 36,
                      background: "#FEE2E2",
                      color: C.red,
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: ".85rem",
                    }}
                    onClick={() => handleDelete(r.id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
/* ── RESERVATIONS TAB ── */
const ReservationsTab = ({ bookings, refreshData }) => {
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await bookingsService.updateStatus(id, newStatus);
      refreshData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="fi">
      <div style={{ marginBottom: 22 }}>
        <h2
          className="serif"
          style={{ color: C.primary, fontSize: "1.6rem", fontWeight: 600 }}
        >
          Reservation Management
        </h2>
      </div>

      <div
        style={{
          background: C.neutral,
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(10,29,55,.07)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                {/* Removed "Guest ID" from headers */}
                {[
                  "Ref ID",
                  "Guests",
                  "Check-in",
                  "Check-out",
                  "Amount",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <span
                      className="sans"
                      style={{
                        color: C.secondary,
                        fontWeight: 700,
                        fontSize: ".78rem",
                      }}
                    >
                      {b.booking_ref}
                    </span>
                  </td>
                  {/* Removed user_id column */}
                  <td>{b.guest_count}</td>
                  <td>{b.check_in}</td>
                  <td>{b.check_out}</td>
                  <td>
                    <span
                      className="serif"
                      style={{ color: C.primary, fontWeight: 700 }}
                    >
                      ₱{parseFloat(b.total_price || 0).toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <Badge s={b.status} />
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 5 }}>
                      {b.status === "pending" && (
                        <button
                          onClick={() => handleStatusUpdate(b.id, "confirmed")}
                          style={{
                            background: "#DCFCE7",
                            color: "#166534",
                            border: "none",
                            padding: "4px 9px",
                            fontSize: ".65rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            borderRadius: 4,
                          }}
                        >
                          ✓
                        </button>
                      )}
                      {b.status !== "cancelled" && (
                        <button
                          onClick={() => handleStatusUpdate(b.id, "cancelled")}
                          style={{
                            background: "#FEE2E2",
                            color: C.red,
                            border: "none",
                            padding: "4px 9px",
                            fontSize: ".65rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            borderRadius: 4,
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ── REPORTS TAB ── */
const ReportsTab = ({ bookings = [] }) => {
  // Force all statuses to lowercase so React catches them regardless of how Django formats them
  const completed = bookings.filter((b) => {
    const s = String(b.status || "").toLowerCase();
    return s === "completed" || s === "confirmed";
  });

  const cancelled = bookings.filter(
    (b) => String(b.status || "").toLowerCase() === "cancelled",
  );
  const pending = bookings.filter(
    (b) => String(b.status || "").toLowerCase() === "pending",
  );

  const totalRev = completed.reduce(
    (acc, b) => acc + parseFloat(b.total_price || 0),
    0,
  );
  const lostRev = cancelled.reduce(
    (acc, b) => acc + parseFloat(b.total_price || 0),
    0,
  );
  const avgBooking = completed.length ? totalRev / completed.length : 0;

  return (
    <div className="fi">
      <div style={{ marginBottom: 22 }}>
        <h2
          className="serif"
          style={{ color: C.primary, fontSize: "1.6rem", fontWeight: 600 }}
        >
          Sales Reports
        </h2>
        <p
          className="sans"
          style={{ color: C.gray, fontSize: ".85rem", marginTop: 4 }}
        >
          Real-time revenue and booking analytics
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 18,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            background: C.neutral,
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(10,29,55,.05)",
            borderLeft: `4px solid #166534`,
          }}
        >
          <div
            className="sans"
            style={{
              color: C.gray,
              fontSize: ".75rem",
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Net Revenue
          </div>
          <div
            className="serif"
            style={{ color: C.primary, fontSize: "2rem", fontWeight: 700 }}
          >
            ₱{totalRev.toLocaleString()}
          </div>
        </div>
        <div
          style={{
            background: C.neutral,
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(10,29,55,.05)",
            borderLeft: `4px solid ${C.secondary}`,
          }}
        >
          <div
            className="sans"
            style={{
              color: C.gray,
              fontSize: ".75rem",
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Avg. Booking Value
          </div>
          <div
            className="serif"
            style={{ color: C.primary, fontSize: "2rem", fontWeight: 700 }}
          >
            ₱
            {avgBooking.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div
          style={{
            background: C.neutral,
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(10,29,55,.05)",
            borderLeft: `4px solid ${C.red}`,
          }}
        >
          <div
            className="sans"
            style={{
              color: C.gray,
              fontSize: ".75rem",
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Lost Revenue (Cancelled)
          </div>
          <div
            className="serif"
            style={{ color: C.primary, fontSize: "2rem", fontWeight: 700 }}
          >
            ₱{lostRev.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Visual Data Breakdown */}
      <div
        style={{
          background: C.neutral,
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 2px 10px rgba(10,29,55,.05)",
        }}
      >
        <h3
          className="serif"
          style={{
            color: C.primary,
            fontSize: "1.2rem",
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Booking Status Breakdown
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              label: "Completed / Confirmed",
              count: completed.length,
              color: "#166534",
            },
            { label: "Pending", count: pending.length, color: "#9A3412" },
            { label: "Cancelled", count: cancelled.length, color: C.red },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <div
                style={{
                  width: 180,
                  fontSize: ".9rem",
                  fontWeight: 500,
                  color: C.primary,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  flex: 1,
                  background: C.grayL,
                  height: 12,
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${bookings.length ? (stat.count / bookings.length) * 100 : 0}%`,
                    height: "100%",
                    background: stat.color,
                    borderRadius: 6,
                    transition: "width 0.5s ease-out",
                  }}
                />
              </div>
              <div
                style={{
                  width: 40,
                  textAlign: "right",
                  fontSize: ".95rem",
                  fontWeight: 700,
                  color: C.primary,
                }}
              >
                {stat.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── MAIN COMPONENT ── */
const AdminDash = ({ setPage }) => {
  const { user } = useAuth(); // Hooks into global context
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [roomsData, bookingsData] = await Promise.all([
        roomsService.list(),
        bookingsService.list(), // <--- CHANGED FROM getAll() TO list()
      ]);
      setRooms(roomsData.results || roomsData);
      setBookings(bookingsData.results || bookingsData);
    } catch (error) {
      console.error("Error loading admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div
        style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}
      >
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <>
      {modal && (
        <RoomModal
          room={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          refreshData={fetchDashboardData}
        />
      )}
      <Shell
        nav={navItems}
        tab={tab}
        setTab={setTab}
        setPage={setPage}
        name={user?.full_name || "Adminstrator"}
        role="admin"
        init={user?.full_name?.charAt(0) || "A"}
      >
        {tab === "overview" && (
          <OverviewTab
            setTab={setTab}
            setModal={setModal}
            rooms={rooms}
            bookings={bookings}
          />
        )}
        {tab === "rooms" && (
          <RoomsTab
            setModal={setModal}
            rooms={rooms}
            refreshData={fetchDashboardData}
          />
        )}
        {tab === "reservations" && (
          <ReservationsTab
            bookings={bookings}
            refreshData={fetchDashboardData}
          />
        )}
        {tab === "reports" && <ReportsTab bookings={bookings} />}
      </Shell>
    </>
  );
};

export default AdminDash;
