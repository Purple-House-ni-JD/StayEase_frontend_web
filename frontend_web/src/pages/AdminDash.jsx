import { useState } from "react";
import { C } from "../constants";
import { ROOMS, BKS } from "../data";
import { Badge } from "../components/UI";
import Shell from "../components/Shell";

const navItems = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "rooms", icon: "🛏️", label: "Room Management" },
  { id: "reservations", icon: "📋", label: "Reservations" },
  { id: "reports", icon: "📈", label: "Sales Reports" },
];

/* ── ROOM MODAL ── */
const RoomModal = ({ room, onClose }) => {
  const isEdit = !!room?.id;
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
              className="inp"
              placeholder="e.g. Grand Imperial Suite"
              defaultValue={room?.name || ""}
            />
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div>
              <label className="lbl">Room Type</label>
              <select className="inp">
                {["Standard", "Deluxe", "Suite", "Villa", "Family"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl">Price per Night (₱)</label>
              <input
                className="inp"
                placeholder="0.00"
                defaultValue={room?.price || ""}
              />
            </div>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div>
              <label className="lbl">Room Size (m²)</label>
              <input className="inp" placeholder="32" />
            </div>
            <div>
              <label className="lbl">Max Guests</label>
              <input className="inp" placeholder="2" />
            </div>
          </div>
          <div>
            <label className="lbl">Description</label>
            <input className="inp" placeholder="Describe the room..." />
          </div>
          <div>
            <label className="lbl">Status</label>
            <select className="inp">
              <option>Active</option>
              <option>Inactive</option>
              <option>Maintenance</option>
            </select>
          </div>
          <div>
            <label className="lbl">Room Images (via Cloudinary)</label>
            <div
              style={{
                border: `2px dashed ${C.grayL}`,
                borderRadius: 8,
                padding: "22px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "1.4rem", marginBottom: 5 }}>☁️</div>
              <div
                className="sans"
                style={{ color: C.gray, fontSize: ".82rem" }}
              >
                Click to upload or drag & drop
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
            <button className="btn-p" style={{ flex: 1, padding: "12px" }}>
              {isEdit ? "Save Changes" : "Add Room"}
            </button>
            <button
              className="btn-o"
              style={{ flex: 1, padding: "12px" }}
              onClick={onClose}
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
const OverviewTab = ({ setTab, setModal }) => (
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
      {[
        {
          l: "Total Reservations",
          v: "44",
          d: "+8 this week",
          cls: "n",
          i: "📋",
        },
        {
          l: "Monthly Revenue",
          v: "₱284,400",
          d: "+12% vs last month",
          cls: "g",
          i: "💰",
        },
        {
          l: "Occupancy Rate",
          v: "76%",
          d: "38 of 50 rooms",
          cls: "v",
          i: "🏨",
        },
        {
          l: "Pending Bookings",
          v: "7",
          d: "Needs attention",
          cls: "a",
          i: "⏳",
        },
      ].map((s) => (
        <div key={s.l} className={`sc ${s.cls}`}>
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
              {s.l}
            </span>
            <span style={{ fontSize: "1.1rem" }}>{s.i}</span>
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
            {s.v}
          </div>
          <div
            className="sans"
            style={{ color: C.secondary, fontSize: ".72rem" }}
          >
            {s.d}
          </div>
        </div>
      ))}
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
              {[
                "Reference",
                "Guest",
                "Room",
                "Check-in",
                "Nights",
                "Amount",
                "Status",
                "Actions",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BKS.slice(0, 4).map((b) => (
              <tr key={b.ref}>
                <td>
                  <span
                    className="sans"
                    style={{
                      color: C.secondary,
                      fontWeight: 700,
                      fontSize: ".8rem",
                    }}
                  >
                    {b.ref}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 600 }}>{b.guest}</span>
                </td>
                <td>{b.room}</td>
                <td>{b.checkIn}</td>
                <td style={{ textAlign: "center" }}>{b.nights}</td>
                <td>
                  <span
                    className="serif"
                    style={{ color: C.primary, fontWeight: 700 }}
                  >
                    ₱{b.amt.toLocaleString()}
                  </span>
                </td>
                <td>
                  <Badge s={b.status} />
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {b.status === "pending" && (
                      <button
                        style={{
                          background: "#DCFCE7",
                          color: "#166534",
                          border: "none",
                          padding: "4px 10px",
                          fontSize: ".65rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          borderRadius: 4,
                          fontFamily: "DM Sans,sans-serif",
                        }}
                      >
                        ✓ Confirm
                      </button>
                    )}
                    <button
                      style={{
                        background: C.grayXL,
                        color: C.gray,
                        border: "none",
                        padding: "4px 10px",
                        fontSize: ".65rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        borderRadius: 4,
                        fontFamily: "DM Sans,sans-serif",
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Bottom row */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div
        style={{
          background: C.neutral,
          borderRadius: 12,
          padding: "22px",
          boxShadow: "0 2px 12px rgba(10,29,55,.07)",
        }}
      >
        <h3
          className="serif"
          style={{
            color: C.primary,
            fontSize: "1.05rem",
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          Room Availability
        </h3>
        {ROOMS.slice(0, 4).map((r) => (
          <div key={r.name} style={{ marginBottom: 15 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span
                className="sans"
                style={{
                  color: C.primary,
                  fontSize: ".82rem",
                  fontWeight: 500,
                }}
              >
                {r.name}
              </span>
              <span
                className="sans"
                style={{ color: C.gray, fontSize: ".74rem" }}
              >
                {r.avail} avail.
              </span>
            </div>
            <div style={{ height: 6, background: C.grayL, borderRadius: 3 }}>
              <div
                style={{
                  height: "100%",
                  width: `${(r.avail / 12) * 100}%`,
                  background: `linear-gradient(90deg,${C.secondary},${C.tertiary})`,
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: C.primary,
          borderRadius: 12,
          padding: "22px",
          boxShadow: "0 2px 12px rgba(10,29,55,.1)",
        }}
      >
        <h3
          className="serif"
          style={{
            color: C.neutral,
            fontSize: "1.05rem",
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          Quick Actions
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["🛏️", "Add New Room", "rooms"],
            ["📊", "View Reports", "reports"],
            ["📋", "Manage Reservations", "reservations"],
          ].map(([ic, l, t]) => (
            <button
              key={l}
              onClick={() => (t === "rooms" ? setModal("add") : setTab(t))}
              style={{
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(197,160,89,.15)",
                color: "rgba(255,255,255,.8)",
                padding: "12px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "DM Sans,sans-serif",
                fontSize: ".85rem",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "background .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(197,160,89,.12)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.06)")
              }
            >
              <span>{ic}</span>
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ── ROOMS TAB ── */
const RoomsTab = ({ setModal }) => (
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
        display: "flex",
        gap: 8,
        marginBottom: 18,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {["All", "Standard", "Deluxe", "Suite", "Family"].map((f, i) => (
        <button key={f} className={`ct${i === 0 ? " on" : ""}`}>
          {f}
        </button>
      ))}
      <div style={{ marginLeft: "auto", position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: C.gray,
            fontSize: ".85rem",
          }}
        >
          🔍
        </span>
        <input
          className="inp"
          placeholder="Search rooms..."
          style={{ width: 210, paddingLeft: 36 }}
        />
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
        gap: 22,
      }}
    >
      {ROOMS.map((r) => (
        <div
          key={r.id}
          style={{
            background: C.neutral,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(10,29,55,.07)",
          }}
        >
          <div style={{ position: "relative", height: 180 }}>
            <img
              src={r.img}
              alt={r.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", top: 10, right: 10 }}>
              <span
                style={{
                  background: "#DCFCE7",
                  color: "#166534",
                  fontSize: ".62rem",
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 4,
                  fontFamily: "DM Sans,sans-serif",
                }}
              >
                ACTIVE
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
                {r.type}
              </span>
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <h4
                className="serif"
                style={{ color: C.primary, fontSize: "1rem", fontWeight: 600 }}
              >
                {r.name}
              </h4>
              <span
                className="serif"
                style={{ color: C.secondary, fontWeight: 700 }}
              >
                ₱{r.price.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <span
                className="sans"
                style={{ color: C.gray, fontSize: ".74rem" }}
              >
                {r.avail} of 10 available
              </span>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: i < r.avail ? "#16A34A" : C.grayL,
                    }}
                  />
                ))}
              </div>
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
                  letterSpacing: ".06em",
                }}
                onClick={() => setModal(r)}
              >
                EDIT
              </button>
              <button
                style={{
                  flex: 1,
                  background: C.grayXL,
                  color: C.gray,
                  border: `1.5px solid ${C.grayL}`,
                  padding: "9px",
                  borderRadius: 8,
                  fontFamily: "DM Sans,sans-serif",
                  fontSize: ".72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                MANAGE
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
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ── RESERVATIONS TAB ── */
const ReservationsTab = () => {
  const [bFilter, setBFilter] = useState("All");
  const filteredBks =
    bFilter === "All"
      ? BKS
      : BKS.filter((b) => b.status === bFilter.toLowerCase());

  return (
    <div className="fi">
      <div style={{ marginBottom: 22 }}>
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
          Track and manage all guest reservations
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 22,
        }}
      >
        {[
          ["All", BKS.length, C.primary],
          [
            "Active",
            BKS.filter((b) => b.status === "active").length,
            "#1D4ED8",
          ],
          [
            "Pending",
            BKS.filter((b) => b.status === "pending").length,
            "#D97706",
          ],
          [
            "Cancelled",
            BKS.filter((b) => b.status === "cancelled").length,
            C.red,
          ],
        ].map(([l, v, cl]) => (
          <div
            key={l}
            style={{
              background: C.neutral,
              borderRadius: 10,
              padding: "14px 18px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(10,29,55,.06)",
              borderTop: `3px solid ${cl}`,
              cursor: "pointer",
            }}
            onClick={() => setBFilter(l)}
          >
            <div
              className="sans"
              style={{ color: cl, fontSize: "1.4rem", fontWeight: 700 }}
            >
              {v}
            </div>
            <div
              className="sans"
              style={{
                color: C.gray,
                fontSize: ".7rem",
                textTransform: "uppercase",
                letterSpacing: ".08em",
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {["All", "Active", "Pending", "Confirmed", "Cancelled"].map((f) => (
          <button
            key={f}
            className={`ct${bFilter === f ? " on" : ""}`}
            onClick={() => setBFilter(f)}
          >
            {f}
          </button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <input
            className="inp"
            placeholder="Search by ref, guest, room..."
            style={{ width: 260 }}
          />
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
                  "Reference",
                  "Guest",
                  "Room",
                  "Check-in",
                  "Check-out",
                  "Payment",
                  "Amount",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBks.map((b) => (
                <tr key={b.ref}>
                  <td>
                    <span
                      className="sans"
                      style={{
                        color: C.secondary,
                        fontWeight: 700,
                        fontSize: ".78rem",
                      }}
                    >
                      {b.ref}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{b.guest}</span>
                  </td>
                  <td
                    style={{
                      maxWidth: 160,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {b.room}
                  </td>
                  <td>{b.checkIn}</td>
                  <td>{b.checkOut}</td>
                  <td>
                    <span
                      className="sans"
                      style={{ color: C.gray, fontSize: ".78rem" }}
                    >
                      {b.pay}
                    </span>
                  </td>
                  <td>
                    <span
                      className="serif"
                      style={{ color: C.primary, fontWeight: 700 }}
                    >
                      ₱{b.amt.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <Badge s={b.status} />
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 5 }}>
                      {b.status === "pending" && (
                        <button
                          style={{
                            background: "#DCFCE7",
                            color: "#166534",
                            border: "none",
                            padding: "4px 9px",
                            fontSize: ".65rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            borderRadius: 4,
                            fontFamily: "DM Sans,sans-serif",
                          }}
                        >
                          ✓
                        </button>
                      )}
                      <button
                        style={{
                          background: "#DBEAFE",
                          color: "#1E40AF",
                          border: "none",
                          padding: "4px 9px",
                          fontSize: ".65rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          borderRadius: 4,
                          fontFamily: "DM Sans,sans-serif",
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        style={{
                          background: "#FEE2E2",
                          color: C.red,
                          border: "none",
                          padding: "4px 9px",
                          fontSize: ".65rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          borderRadius: 4,
                          fontFamily: "DM Sans,sans-serif",
                        }}
                      >
                        ✕
                      </button>
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
const ReportsTab = () => (
  <div className="fi">
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 26,
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
          Revenue & occupancy analytics
        </p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <select className="inp" style={{ width: 140 }}>
          {["April 2026", "March 2026", "February 2026"].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <button className="btn-g" style={{ padding: "10px 22px" }}>
          Export PDF
        </button>
      </div>
    </div>

    {/* Revenue cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: 18,
        marginBottom: 26,
      }}
    >
      {[
        { p: "Today", v: "₱21,800", b: 3, pct: "+8%", cls: "n" },
        { p: "This Week", v: "₱148,600", b: 18, pct: "+14%", cls: "g" },
        { p: "This Month", v: "₱284,400", b: 44, pct: "+12%", cls: "v" },
        { p: "This Year", v: "₱1,240,000", b: 186, pct: "+22%", cls: "a" },
      ].map((r) => (
        <div key={r.p} className={`sc ${r.cls}`}>
          <div
            className="sans"
            style={{
              color: C.gray,
              fontSize: ".68rem",
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {r.p}
          </div>
          <div
            className="serif"
            style={{
              color: C.primary,
              fontSize: "1.8rem",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {r.v}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div>
              <div
                className="sans"
                style={{ color: C.gray, fontSize: ".65rem" }}
              >
                Bookings
              </div>
              <div
                className="sans"
                style={{ color: C.primary, fontWeight: 700 }}
              >
                {r.b}
              </div>
            </div>
            <div>
              <div
                className="sans"
                style={{ color: C.gray, fontSize: ".65rem" }}
              >
                vs last period
              </div>
              <div
                className="sans"
                style={{ color: "#16A34A", fontWeight: 700 }}
              >
                {r.pct}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Bar chart */}
    <div
      style={{
        background: C.neutral,
        borderRadius: 12,
        padding: "24px",
        boxShadow: "0 2px 12px rgba(10,29,55,.07)",
        marginBottom: 22,
      }}
    >
      <h3
        className="serif"
        style={{
          color: C.primary,
          fontSize: "1.05rem",
          fontWeight: 600,
          marginBottom: 18,
        }}
      >
        Monthly Revenue Trend
      </h3>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          height: 150,
          padding: "0 8px",
        }}
      >
        {[
          { m: "Nov", h: 55 },
          { m: "Dec", h: 80 },
          { m: "Jan", h: 60 },
          { m: "Feb", h: 72 },
          { m: "Mar", h: 65 },
          { m: "Apr", h: 100 },
        ].map((b) => (
          <div
            key={b.m}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${b.h}%`,
                background:
                  b.m === "Apr"
                    ? `linear-gradient(180deg,${C.tertiary},${C.secondary})`
                    : `linear-gradient(180deg,rgba(197,160,89,.3),rgba(197,160,89,.15))`,
                borderRadius: "4px 4px 0 0",
                transition: "height .5s",
              }}
            />
            <span className="sans" style={{ color: C.gray, fontSize: ".7rem" }}>
              {b.m}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* Top room types */}
      <div
        style={{
          background: C.neutral,
          borderRadius: 12,
          padding: "22px",
          boxShadow: "0 2px 12px rgba(10,29,55,.07)",
        }}
      >
        <h3
          className="serif"
          style={{
            color: C.primary,
            fontSize: "1.05rem",
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          Top Performing Room Types
        </h3>
        {[
          { n: "Executive Suite", v: "₱88,000", b: 10, p: 88 },
          { n: "Junior Suite", v: "₱66,000", b: 12, p: 66 },
          { n: "Deluxe Room", v: "₱57,600", b: 18, p: 57 },
          { n: "Standard Room", v: "₱35,200", b: 16, p: 35 },
        ].map((r) => (
          <div key={r.n} style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span
                className="sans"
                style={{
                  color: C.primary,
                  fontWeight: 500,
                  fontSize: ".84rem",
                }}
              >
                {r.n}
              </span>
              <span
                className="serif"
                style={{
                  color: C.secondary,
                  fontWeight: 700,
                  fontSize: ".9rem",
                }}
              >
                {r.v}
              </span>
            </div>
            <div style={{ height: 6, background: C.grayL, borderRadius: 3 }}>
              <div
                style={{
                  height: "100%",
                  width: `${r.p}%`,
                  background: `linear-gradient(90deg,${C.secondary},${C.tertiary})`,
                  borderRadius: 3,
                }}
              />
            </div>
            <div
              className="sans"
              style={{ color: C.gray, fontSize: ".67rem", marginTop: 3 }}
            >
              {r.b} bookings
            </div>
          </div>
        ))}
      </div>

      {/* Payment breakdown */}
      <div
        style={{
          background: C.neutral,
          borderRadius: 12,
          padding: "22px",
          boxShadow: "0 2px 12px rgba(10,29,55,.07)",
        }}
      >
        <h3
          className="serif"
          style={{
            color: C.primary,
            fontSize: "1.05rem",
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          Payment Method Breakdown
        </h3>
        {[
          { m: "Credit / Debit Card", p: 45, b: 20, cl: C.primary },
          { m: "GCash", p: 30, b: 13, cl: "#1E40AF" },
          { m: "Maya", p: 15, b: 7, cl: "#16A34A" },
          { m: "Cash on Arrival", p: 10, b: 4, cl: "#D97706" },
        ].map((p) => (
          <div key={p.m} style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span
                className="sans"
                style={{
                  color: C.primary,
                  fontSize: ".84rem",
                  fontWeight: 500,
                }}
              >
                {p.m}
              </span>
              <span
                className="sans"
                style={{ color: C.gray, fontSize: ".76rem" }}
              >
                {p.p}% · {p.b} txns
              </span>
            </div>
            <div style={{ height: 6, background: C.grayL, borderRadius: 3 }}>
              <div
                style={{
                  height: "100%",
                  width: `${p.p}%`,
                  background: p.cl,
                  borderRadius: 3,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        ))}
        <button
          className="btn-p"
          style={{
            width: "100%",
            padding: "11px",
            marginTop: 10,
            fontSize: ".78rem",
          }}
        >
          Download Full Report
        </button>
      </div>
    </div>
  </div>
);

/* ── MAIN COMPONENT ── */
const AdminDash = ({ setPage }) => {
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState(null);

  return (
    <>
      {modal && (
        <RoomModal
          room={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
      <Shell
        nav={navItems}
        tab={tab}
        setTab={setTab}
        setPage={setPage}
        name="Admin User"
        role="admin"
        init="AD"
      >
        {tab === "overview" && (
          <OverviewTab setTab={setTab} setModal={setModal} />
        )}
        {tab === "rooms" && <RoomsTab setModal={setModal} />}
        {tab === "reservations" && <ReservationsTab />}
        {tab === "reports" && <ReportsTab />}
      </Shell>
    </>
  );
};

export default AdminDash;
