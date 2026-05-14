import { useState, useEffect, useRef } from "react";
import { C } from "../constants";
import { Badge } from "../components/UI";
import Shell from "../components/Shell";
import { roomsService } from "../api/rooms";
import { bookingsService } from "../api/bookings";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const usersService = {
  list: async () => {
    try {
      const res = await api.get("/users/admin/list/");
      return res.data || res;
    } catch (error) {
      console.warn("User endpoint missing. Returning empty array.");
      return [];
    }
  },
  delete: (id) => api.delete(`/users/admin/${id}/delete/`),
};

const navItems = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "walkin", icon: "🚶", label: "Walk-in Booking" },
  { id: "rooms", icon: "🛏️", label: "Room Management" },
  { id: "reservations", icon: "📋", label: "Reservations" },
  { id: "reports", icon: "📈", label: "Sales Reports" },
  { id: "users", icon: "👥", label: "User Management" },
];

/* ── REUSABLE CALENDAR WIDGET ── */
const CalendarWidget = ({
  bookings = [],
  selectedRoomIds = [],
  totalRooms = 1,
}) => {
  const [currDate, setCurrDate] = useState(new Date());
  // --- NEW: State to hold details of the clicked day ---
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);

  const year = currDate.getFullYear();
  const month = currDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const activeBookings = bookings.filter(
    (b) =>
      b.status === "pending" ||
      b.status === "confirmed" ||
      b.status === "completed",
  );

  const getDayBookings = (day) => {
    const dStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00`;
    const checkDate = new Date(dStr);

    return activeBookings.filter((b) => {
      const ci = new Date(b.check_in + "T00:00:00");
      const co = new Date(b.check_out + "T00:00:00");
      if (checkDate >= ci && checkDate < co) {
        if (selectedRoomIds.length > 0) {
          const bookedRoomIds = b.booking_rooms?.map((br) => br.room?.id) || [];
          return selectedRoomIds.some((id) => bookedRoomIds.includes(id));
        }
        return true;
      }
      return false;
    });
  };

  const handleDayClick = (day) => {
    const dayBookings = getDayBookings(day);
    setSelectedDayDetails({
      dayString: `${monthNames[month]} ${day}, ${year}`,
      bookings: dayBookings,
    });
  };

  return (
    <div
      style={{
        background: C.neutral,
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h3
          className="serif"
          style={{
            fontSize: "1.1rem",
            color: C.primary,
            fontWeight: 600,
            margin: 0,
          }}
        >
          {selectedRoomIds.length > 0
            ? "Room Availability"
            : "Global Availability"}
        </h3>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => {
              setCurrDate(new Date(year, month - 1, 1));
              setSelectedDayDetails(null);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: C.gray,
            }}
          >
            ←
          </button>
          <span
            className="sans"
            style={{
              fontWeight: 700,
              fontSize: ".9rem",
              minWidth: 100,
              textAlign: "center",
            }}
          >
            {monthNames[month]} {year}
          </span>
          <button
            onClick={() => {
              setCurrDate(new Date(year, month + 1, 1));
              setSelectedDayDetails(null);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: C.gray,
            }}
          >
            →
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="sans"
            style={{ fontSize: ".7rem", fontWeight: 700, color: C.gray }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
        }}
      >
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayBookings = getDayBookings(day);

          let status = "free";
          if (selectedRoomIds.length > 0 && dayBookings.length > 0)
            status = "conflict";
          else if (selectedRoomIds.length === 0) {
            const roomsBookedToday = dayBookings.reduce(
              (sum, b) => sum + (b.booking_rooms?.length || 1),
              0,
            );
            if (roomsBookedToday >= totalRooms && totalRooms > 0)
              status = "full";
            else if (roomsBookedToday > 0) status = "partial";
          }

          let bg = "transparent";
          let color = C.text;
          if (status === "conflict" || status === "full") {
            bg = "#FEE2E2";
            color = C.red;
          } else if (status === "partial") {
            bg = "#FEF3C7";
            color = "#92400E";
          } else if (status === "free") {
            bg = "#DCFCE7";
            color = "#166534";
          }

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)} // <-- Make clickable
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 36,
                borderRadius: 8,
                background: bg,
                color: color,
                fontSize: ".85rem",
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid transparent",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.border = `1px solid ${C.gray}`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.border = `1px solid transparent`)
              }
            >
              {day}
            </div>
          );
        })}
      </div>

      {selectedRoomIds.length === 0 && (
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 16,
            justifyContent: "center",
            fontSize: ".75rem",
            fontWeight: 600,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: "#DCFCE7",
              }}
            ></div>{" "}
            Free
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: "#FEF3C7",
              }}
            ></div>{" "}
            Partial
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: "#FEE2E2",
              }}
            ></div>{" "}
            Full
          </span>
        </div>
      )}

      {/* --- NEW: SELECTED DAY DETAILS --- */}
      {selectedDayDetails && (
        <div
          style={{
            marginTop: 24,
            padding: "16px",
            background: C.grayXL,
            borderRadius: 8,
            border: `1px solid ${C.grayL}`,
          }}
        >
          <h4
            className="serif"
            style={{ fontSize: "1rem", color: C.primary, marginBottom: 12 }}
          >
            Bookings for {selectedDayDetails.dayString}
          </h4>
          {selectedDayDetails.bookings.length === 0 ? (
            <p
              className="sans"
              style={{ color: C.gray, fontSize: ".85rem", margin: 0 }}
            >
              No rooms are booked on this date.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedDayDetails.bookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: "#fff",
                    padding: "10px 14px",
                    borderRadius: 6,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span
                      className="serif"
                      style={{
                        fontWeight: 600,
                        color: C.primary,
                        fontSize: ".95rem",
                      }}
                    >
                      {b.booking_ref}
                    </span>
                    <Badge s={b.status} />
                  </div>
                  <div
                    className="sans"
                    style={{
                      fontSize: ".8rem",
                      color: C.secondary,
                      fontWeight: 600,
                    }}
                  >
                    Guest: {b.user_email || "Walk-in Guest"}
                  </div>
                  <div
                    className="sans"
                    style={{ fontSize: ".75rem", color: C.gray }}
                  >
                    <strong>Rooms:</strong>{" "}
                    {b.booking_rooms?.length > 0
                      ? b.booking_rooms.map((br) => br.room?.name).join(", ")
                      : "Unassigned"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ── ROOM MODAL ── */
const RoomModal = ({
  room,
  onClose,
  refreshData,
  amenities = [],
  policies = [],
}) => {
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
    amenity_ids: room?.amenities?.map((a) => a.id) || [],
    policy_ids: room?.policies?.map((p) => p.id) || [],
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

  const handleAmenityToggle = (amenityId) => {
    setFormData((prev) => {
      const updatedIds = prev.amenity_ids.includes(amenityId)
        ? prev.amenity_ids.filter((id) => id !== amenityId)
        : [...prev.amenity_ids, amenityId];
      return { ...prev, amenity_ids: updatedIds };
    });
  };

  const handlePolicyToggle = (policyId) => {
    setFormData((prev) => {
      const updatedIds = prev.policy_ids.includes(policyId)
        ? prev.policy_ids.filter((id) => id !== policyId)
        : [...prev.policy_ids, policyId];
      return { ...prev, policy_ids: updatedIds };
    });
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
        amenity_ids: formData.amenity_ids,
        policy_ids: formData.policy_ids,
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

          {amenities.length > 0 && (
            <div>
              <label className="lbl">Amenities</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {amenities.map((a) => (
                  <label
                    key={a.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      background: formData.amenity_ids.includes(a.id)
                        ? C.primary
                        : C.grayL,
                      color: formData.amenity_ids.includes(a.id)
                        ? "white"
                        : C.text,
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: ".85rem",
                      fontWeight: 500,
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenity_ids.includes(a.id)}
                      onChange={() => handleAmenityToggle(a.id)}
                      style={{ cursor: "pointer" }}
                    />
                    {a.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {policies.length > 0 && (
            <div>
              <label className="lbl">Policies</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {policies.map((p) => (
                  <label
                    key={p.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      background: formData.policy_ids.includes(p.id)
                        ? C.secondary
                        : C.grayL,
                      color: formData.policy_ids.includes(p.id)
                        ? C.neutral
                        : C.text,
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: ".85rem",
                      fontWeight: 500,
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.policy_ids.includes(p.id)}
                      onChange={() => handlePolicyToggle(p.id)}
                      style={{ cursor: "pointer" }}
                    />
                    {p.title}
                  </label>
                ))}
              </div>
            </div>
          )}

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
      <div
        style={{
          marginBottom: 26,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
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
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24,
          marginBottom: 28,
          alignItems: "start",
        }}
      >
        {/* Left Side: Stats */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
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

        {/* Right Side: Global Calendar Map */}
        <CalendarWidget bookings={bookings} totalRooms={rooms.length} />
      </div>

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
              {/* --- NEW: ADDED ROOM(S) HEADER --- */}
              <tr>
                {[
                  "Ref ID",
                  "Room(s)",
                  "Guests",
                  "Check-in",
                  "Amount",
                  "Status",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
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
                  {/* --- NEW: RENDER ROOM NAMES --- */}
                  <td>
                    <span
                      className="sans"
                      style={{
                        fontSize: ".75rem",
                        color: C.primary,
                        fontWeight: 500,
                      }}
                    >
                      {b.booking_rooms?.length > 0
                        ? b.booking_rooms.map((br) => br.room?.name).join(", ")
                        : "N/A"}
                    </span>
                  </td>
                  <td>{b.guest_count}</td>
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
                    colSpan="6"
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

/* ── WALK-IN BOOKING TAB ── */
const WalkinTab = ({ rooms, bookings, refreshData, setTab }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeRooms = rooms.filter((r) => r.availability_status);
  const ci = new Date(checkIn);
  const co = new Date(checkOut);
  const nights =
    ci && co && co > ci ? Math.ceil((co - ci) / (1000 * 60 * 60 * 24)) : 0;
  const selectedRoomObjects = activeRooms.filter((r) =>
    selectedRooms.includes(r.id),
  );
  const totalPrice =
    nights > 0
      ? selectedRoomObjects.reduce(
          (sum, r) => sum + parseFloat(r.price_per_night || 0),
          0,
        ) * nights
      : 0;
  const today = new Date().toISOString().split("T")[0];

  const handleRoomToggle = (roomId) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId],
    );
  };

  const handleBooking = async () => {
    setError(null);
    if (!checkIn || !checkOut)
      return setError("Please select valid check-in and check-out dates.");
    if (nights <= 0)
      return setError("Check-out date must be after check-in date.");
    if (selectedRooms.length === 0)
      return setError("Please select at least one room.");

    // --- FRONTEND DATE CONFLICT VALIDATION ---
    const activeBookings = bookings.filter((b) =>
      ["pending", "confirmed", "completed"].includes(b.status),
    );
    const hasConflict = selectedRooms.some((roomId) => {
      return activeBookings.some((b) => {
        const roomIdsInBooking =
          b.booking_rooms?.map((br) => br.room?.id) || [];
        if (!roomIdsInBooking.includes(roomId)) return false;

        const bCI = new Date(b.check_in + "T00:00:00");
        const bCO = new Date(b.check_out + "T00:00:00");
        const reqCI = new Date(checkIn + "T00:00:00");
        const reqCO = new Date(checkOut + "T00:00:00");

        return reqCI < bCO && reqCO > bCI;
      });
    });

    if (hasConflict) {
      return setError(
        "One or more selected rooms are already booked for the selected dates!",
      );
    }

    setLoading(true);
    try {
      const payload = {
        room_ids: selectedRooms,
        check_in: checkIn,
        check_out: checkOut,
        guest_count: parseInt(guests, 10),
        payment_method: paymentMethod,
        guest_details: {
          type: "walk-in",
          guest_name: guestName || "Walk-in Guest",
        },
      };

      await api.post("/bookings/guest/create/", payload);

      alert("Walk-in booking created successfully!");
      refreshData();
      setTab("reservations");
    } catch (err) {
      console.error("Walk-in error:", err);
      const data = err?.response?.data || err;
      let errorMsg = "Failed to secure reservation. Please try again.";
      if (data?.room_ids && Array.isArray(data.room_ids))
        errorMsg = data.room_ids[0].replace(/[\[\]']/g, "");
      else if (data?.detail) errorMsg = data.detail;
      else if (typeof data === "object")
        errorMsg = Object.values(data).flat().join(" | ");
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fi">
      <div style={{ marginBottom: 22 }}>
        <h2
          className="serif"
          style={{ color: C.primary, fontSize: "1.6rem", fontWeight: 600 }}
        >
          Walk-in Booking
        </h2>
        <p
          className="sans"
          style={{ color: C.gray, fontSize: ".85rem", marginTop: 4 }}
        >
          Process a manual booking and use the calendar to prevent
          double-bookings.
        </p>
      </div>

      {error && (
        <div
          className="sans"
          style={{
            background: "#FEE2E2",
            color: "#991B1B",
            padding: "14px 18px",
            borderRadius: 8,
            fontSize: ".85rem",
            marginBottom: 20,
            border: "1px solid #FCA5A5",
          }}
        >
          <strong>Error: </strong> {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN: BOOKING DETAILS & CALENDAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              background: C.neutral,
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              className="serif"
              style={{
                fontSize: "1.1rem",
                marginBottom: 16,
                color: C.primary,
                fontWeight: 600,
              }}
            >
              Booking Details
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="lbl">Guest Name (Optional)</label>
                <input
                  type="text"
                  className="inp"
                  placeholder="e.g. John Doe"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label className="lbl">Check-In Date</label>
                  <input
                    type="date"
                    className="inp"
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="lbl">Check-Out Date</label>
                  <input
                    type="date"
                    className="inp"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label className="lbl">Total Guests</label>
                  <input
                    type="number"
                    min="1"
                    className="inp"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </div>
                <div>
                  <label className="lbl">Payment Method</label>
                  <select
                    className="inp"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="gcash">GCash</option>
                    <option value="maya">Maya</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  marginTop: 12,
                  padding: "16px",
                  background: C.grayXL,
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span
                    className="sans"
                    style={{ color: C.gray, fontSize: ".9rem" }}
                  >
                    Duration
                  </span>
                  <span
                    className="serif"
                    style={{ color: C.primary, fontWeight: 600 }}
                  >
                    {nights} Night(s)
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    className="sans"
                    style={{ color: C.gray, fontSize: ".9rem" }}
                  >
                    Estimated Total
                  </span>
                  <span
                    className="serif"
                    style={{
                      color: C.secondary,
                      fontWeight: 700,
                      fontSize: "1.2rem",
                    }}
                  >
                    ₱{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                className="btn-p"
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: 8,
                  fontSize: "1rem",
                }}
                onClick={handleBooking}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Walk-in Booking"}
              </button>
            </div>
          </div>

          {/* DYNAMIC CALENDAR */}
          <CalendarWidget
            bookings={bookings}
            selectedRoomIds={selectedRooms}
            totalRooms={rooms.length}
          />
        </div>

        {/* RIGHT COLUMN: ROOM SELECTION */}
        <div
          style={{
            background: C.neutral,
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div>
              <h3
                className="serif"
                style={{
                  fontSize: "1.1rem",
                  color: C.primary,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Assign Rooms
              </h3>
              <p
                className="sans"
                style={{ fontSize: ".75rem", color: C.gray, marginTop: 4 }}
              >
                Select a room to see its availability on the calendar.
              </p>
            </div>
            <span
              className="sans"
              style={{ fontSize: ".8rem", color: C.secondary, fontWeight: 600 }}
            >
              {selectedRooms.length} Selected
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              maxHeight: "700px",
              overflowY: "auto",
              paddingRight: 5,
            }}
          >
            {activeRooms.length === 0 ? (
              <p
                className="sans"
                style={{
                  color: C.gray,
                  fontSize: ".85rem",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No active rooms available in the system.
              </p>
            ) : (
              activeRooms.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleRoomToggle(r.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px",
                    border: `1px solid ${selectedRooms.includes(r.id) ? C.secondary : C.grayL}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    background: selectedRooms.includes(r.id)
                      ? "rgba(197,160,89,.05)"
                      : "transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(r.id)}
                    onChange={() => {}}
                    style={{
                      accentColor: C.secondary,
                      marginRight: 14,
                      transform: "scale(1.2)",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      className="serif"
                      style={{
                        color: C.primary,
                        fontWeight: 600,
                        fontSize: ".95rem",
                      }}
                    >
                      {r.name}
                    </div>
                    <div
                      className="sans"
                      style={{
                        color: C.gray,
                        fontSize: ".75rem",
                        textTransform: "uppercase",
                        letterSpacing: ".05em",
                      }}
                    >
                      {r.category.replace("_", " ")} • Max {r.max_guest} Guests
                    </div>
                  </div>
                  <div
                    className="serif"
                    style={{ color: C.primary, fontWeight: 700 }}
                  >
                    ₱{parseFloat(r.price_per_night || 0).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusUpdate = async (id, newStatus) => {
    // Added a confirmation prompt so admins don't accidentally click the wrong button
    if (
      window.confirm(
        `Are you sure you want to change this booking to ${newStatus.toUpperCase()}?`,
      )
    ) {
      try {
        await bookingsService.updateStatus(id, newStatus);
        refreshData();
      } catch (err) {
        alert("Failed to update status.");
      }
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchStatus =
      statusFilter === "all" ||
      String(b.status || "").toLowerCase() === statusFilter;
    let matchMonth = true;
    let matchYear = true;

    if (b.check_in) {
      const dateObj = new Date(b.check_in);
      if (monthFilter !== "all")
        matchMonth = dateObj.getMonth().toString() === monthFilter;
      if (yearFilter !== "all")
        matchYear = dateObj.getFullYear().toString() === yearFilter;
    }

    const matchSearch =
      searchQuery === "" ||
      String(b.booking_ref || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(b.user_email || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchStatus && matchMonth && matchYear && matchSearch;
  });

  return (
    <div className="fi">
      <div
        style={{
          marginBottom: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h2
            className="serif"
            style={{ color: C.primary, fontSize: "1.6rem", fontWeight: 600 }}
          >
            Reservation Management
          </h2>
          <p
            className="sans"
            style={{ color: C.gray, fontSize: ".85rem", marginTop: 4 }}
          >
            Filter and update guest bookings
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            type="text"
            className="inp"
            placeholder="Search by ref or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "8px 16px", minWidth: 200 }}
          />
          <select
            className="inp"
            style={{ padding: "8px 16px", minWidth: 120 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="inp"
            style={{ padding: "8px 16px", minWidth: 120 }}
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="all">All Months</option>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
          </select>

          <select
            className="inp"
            style={{ padding: "8px 16px", minWidth: 100 }}
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="all">All Years</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>

      {/* --- NEW: STATUS LEGEND --- */}
      <div
        style={{
          background: C.neutral,
          padding: "16px 24px",
          borderRadius: 12,
          marginBottom: 22,
          boxShadow: "0 2px 12px rgba(10,29,55,.03)",
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span className="serif" style={{ fontWeight: 600, color: C.primary }}>
          Status Legend:
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge s="pending" />
          <span className="sans" style={{ fontSize: ".75rem", color: C.gray }}>
            Guest can still cancel
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge s="confirmed" />
          <span className="sans" style={{ fontSize: ".75rem", color: C.gray }}>
            Guest cannot cancel (within 24h of check-in)
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge s="completed" />
          <span className="sans" style={{ fontSize: ".75rem", color: C.gray }}>
            Guest has checked out
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge s="cancelled" />
          <span className="sans" style={{ fontSize: ".75rem", color: C.gray }}>
            Booking was cancelled
          </span>
        </div>
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
                {[
                  "Ref ID",
                  "Room(s)",
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
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: C.gray,
                    }}
                  >
                    No reservations match your filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
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
                    <td>
                      <span
                        className="sans"
                        style={{
                          fontSize: ".75rem",
                          color: C.primary,
                          fontWeight: 500,
                        }}
                      >
                        {b.booking_rooms?.length > 0
                          ? b.booking_rooms
                              .map((br) => br.room?.name)
                              .join(", ")
                          : "N/A"}
                      </span>
                    </td>
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

                    {/* --- NEW: ACTION BUTTONS --- */}
                    <td>
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(b.id, "confirmed")
                              }
                              style={{
                                background: "#DCFCE7",
                                color: "#166534",
                                border: "none",
                                padding: "6px 12px",
                                fontSize: ".65rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                borderRadius: 6,
                              }}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(b.id, "cancelled")
                              }
                              style={{
                                background: "#FEE2E2",
                                color: C.red,
                                border: "none",
                                padding: "6px 12px",
                                fontSize: ".65rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                borderRadius: 6,
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(b.id, "completed")
                              }
                              style={{
                                background: "#DBEAFE",
                                color: "#1E3A8A",
                                border: "none",
                                padding: "6px 12px",
                                fontSize: ".65rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                borderRadius: 6,
                              }}
                            >
                              Checkout
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(b.id, "cancelled")
                              }
                              style={{
                                background: "#FEE2E2",
                                color: C.red,
                                border: "none",
                                padding: "6px 12px",
                                fontSize: ".65rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                borderRadius: 6,
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {(b.status === "completed" ||
                          b.status === "cancelled") && (
                          <span
                            className="sans"
                            style={{
                              fontSize: ".7rem",
                              color: C.grayL,
                              padding: "6px 0",
                            }}
                          >
                            Terminal State
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ── REPORTS TAB (FORMAL DOCUMENT PDF) ── */
const ReportsTab = ({ bookings = [] }) => {
  const [reportMonthFilter, setReportMonthFilter] = useState("all");
  const [reportYearFilter, setReportYearFilter] = useState("all");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const filteredByDate = bookings.filter((b) => {
    if (!b.check_in) return true;
    const dateObj = new Date(b.check_in);
    if (
      reportMonthFilter !== "all" &&
      dateObj.getMonth().toString() !== reportMonthFilter
    )
      return false;
    if (
      reportYearFilter !== "all" &&
      dateObj.getFullYear().toString() !== reportYearFilter
    )
      return false;
    return true;
  });

  const completed = filteredByDate.filter((b) => {
    const s = String(b.status || "").toLowerCase();
    return s === "completed" || s === "confirmed";
  });

  const cancelled = filteredByDate.filter(
    (b) => String(b.status || "").toLowerCase() === "cancelled",
  );
  const pending = filteredByDate.filter(
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

  // --- NEW: Formal Document Generation ---
  // --- NEW: Formal Document Generation ---
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // 1. Header Section
    doc.setFontSize(22);
    doc.setTextColor(10, 29, 55); // Dark Blue
    doc.text("StayEase Sales Report", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-PH")}`, 14, 30);

    const filterText = `Filters Applied: ${reportMonthFilter !== "all" ? monthNames[parseInt(reportMonthFilter)] : "All Months"} ${reportYearFilter !== "all" ? reportYearFilter : "All Years"}`;
    doc.text(filterText, 14, 35);

    // 2. KPI Summary Table
    doc.setFontSize(14);
    doc.setTextColor(10, 29, 55);
    doc.text("Key Performance Indicators", 14, 48);

    autoTable(doc, {
      startY: 52,
      head: [["Net Revenue", "Avg. Booking Value", "Lost Revenue (Cancelled)"]],
      body: [
        [
          `PHP ${totalRev.toLocaleString()}`,
          `PHP ${avgBooking.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
          `PHP ${lostRev.toLocaleString()}`,
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [10, 29, 55], textColor: 255, halign: "center" },
      bodyStyles: { halign: "center", fontSize: 12, fontStyle: "bold" },
      margin: { bottom: 10 },
    });

    // 3. Status Breakdown Table
    doc.setFontSize(14);
    doc.text("Booking Status Breakdown", 14, doc.lastAutoTable.finalY + 15);

    const totalBookings = filteredByDate.length;
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Status", "Total Count", "Percentage"]],
      body: [
        [
          "Completed / Confirmed",
          completed.length,
          `${totalBookings ? Math.round((completed.length / totalBookings) * 100) : 0}%`,
        ],
        [
          "Pending",
          pending.length,
          `${totalBookings ? Math.round((pending.length / totalBookings) * 100) : 0}%`,
        ],
        [
          "Cancelled",
          cancelled.length,
          `${totalBookings ? Math.round((cancelled.length / totalBookings) * 100) : 0}%`,
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [10, 29, 55], textColor: 255 },
      margin: { bottom: 10 },
    });

    // 4. Detailed Reservations Table
    doc.setFontSize(14);
    doc.text("Detailed Reservations Log", 14, doc.lastAutoTable.finalY + 15);

    const tableData = filteredByDate.map((b) => [
      b.booking_ref,
      b.user_email || "Walk-in Guest",
      b.booking_rooms?.length > 0
        ? b.booking_rooms.map((br) => br.room?.name).join(", ")
        : "N/A",
      b.check_in,
      b.check_out,
      `PHP ${parseFloat(b.total_price || 0).toLocaleString()}`,
      b.status.charAt(0).toUpperCase() + b.status.slice(1),
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [
        [
          "Ref ID",
          "Guest",
          "Room(s)",
          "Check-in",
          "Check-out",
          "Amount",
          "Status",
        ],
      ],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [197, 160, 89], textColor: 255 }, // Gold color
      styles: { fontSize: 8, cellPadding: 4 },
      columnStyles: {
        5: { halign: "right" }, // Align money to the right
      },
    });

    // Save the formal document!
    doc.save(`StayEase_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="fi">
      <div
        style={{
          marginBottom: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
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
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <select
            className="inp"
            style={{ padding: "8px 16px", minWidth: 120 }}
            value={reportMonthFilter}
            onChange={(e) => setReportMonthFilter(e.target.value)}
          >
            <option value="all">All Months</option>
            {monthNames.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="inp"
            style={{ padding: "8px 16px", minWidth: 100 }}
            value={reportYearFilter}
            onChange={(e) => setReportYearFilter(e.target.value)}
          >
            <option value="all">All Years</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
          <button
            className="btn-g"
            onClick={handleExportPDF}
            style={{ padding: "10px 20px" }}
          >
            Export PDF Document
          </button>
        </div>
      </div>

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

/* ── USER MANAGEMENT TAB ── */
const UsersTab = ({ usersList, refreshData }) => {
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const filteredUsers = usersList.filter((u) => {
    if (userSearchQuery === "") return true;
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    return (
      fullName.includes(userSearchQuery.toLowerCase()) ||
      String(u.email || "")
        .toLowerCase()
        .includes(userSearchQuery.toLowerCase())
    );
  });

  const handleDeleteUser = async (id) => {
    if (
      window.confirm("Are you sure you want to completely delete this user?")
    ) {
      try {
        await usersService.delete(id);
        refreshData();
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div className="fi">
      <div style={{ marginBottom: 22 }}>
        <div style={{ marginBottom: 16 }}>
          <h2
            className="serif"
            style={{ color: C.primary, fontSize: "1.6rem", fontWeight: 600 }}
          >
            User Management
          </h2>
          <p
            className="sans"
            style={{ color: C.gray, fontSize: ".85rem", marginTop: 4 }}
          >
            View and manage registered guest accounts
          </p>
        </div>
        <input
          type="text"
          className="inp"
          placeholder="Search by name or email..."
          value={userSearchQuery}
          onChange={(e) => setUserSearchQuery(e.target.value)}
          style={{ padding: "8px 16px", minWidth: 200 }}
        />
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
                {["Name", "Email", "Phone Number", "Role", "Actions"].map(
                  (h) => (
                    <th key={h}>{h}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: C.gray,
                    }}
                  >
                    {userSearchQuery
                      ? "No users match your search."
                      : "No users found."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <span
                        className="serif"
                        style={{ color: C.primary, fontWeight: 600 }}
                      >
                        {u.first_name} {u.last_name}
                      </span>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone_number || "N/A"}</td>
                    <td>
                      <span
                        style={{
                          background:
                            u.is_staff || u.is_superuser
                              ? "#FEF3C7"
                              : "#F3F4F6",
                          color:
                            u.is_staff || u.is_superuser
                              ? "#92400E"
                              : "#374151",
                          fontSize: ".65rem",
                          fontWeight: 700,
                          padding: "3px 9px",
                          borderRadius: 4,
                          textTransform: "uppercase",
                        }}
                      >
                        {u.is_superuser ? "Admin" : "Guest"}
                      </span>
                    </td>
                    <td>
                      {!u.is_superuser && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          style={{
                            background: "#FEE2E2",
                            color: C.red,
                            border: "none",
                            padding: "6px 12px",
                            fontSize: ".7rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            borderRadius: 4,
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ── MAIN COMPONENT ── */
const AdminDash = ({ setPage }) => {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [roomsData, bookingsData, usersData, amenitiesData, policiesData] =
        await Promise.all([
          roomsService.list(),
          bookingsService.list(),
          usersService.list(),
          roomsService.getAmenities
            ? roomsService.getAmenities()
            : { results: [] },
          roomsService.getPolicies
            ? roomsService.getPolicies()
            : { results: [] },
        ]);
      setRooms(roomsData.results || roomsData);
      setBookings(bookingsData.results || bookingsData);
      setUsersList(usersData.results || usersData || []);
      setAmenities(amenitiesData.results || amenitiesData || []);
      setPolicies(policiesData.results || policiesData || []);
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
          amenities={amenities}
          policies={policies}
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
        {tab === "walkin" && (
          <WalkinTab
            rooms={rooms}
            bookings={bookings}
            refreshData={fetchDashboardData}
            setTab={setTab}
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
        {tab === "users" && (
          <UsersTab usersList={usersList} refreshData={fetchDashboardData} />
        )}
      </Shell>
    </>
  );
};

export default AdminDash;
