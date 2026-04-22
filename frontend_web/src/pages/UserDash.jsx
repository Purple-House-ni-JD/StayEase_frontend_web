import { useState } from "react";
import { C } from "../constants";
import { ROOMS, BKS } from "../data";
import { Badge } from "../components/UI";
import Shell from "../components/Shell";
import RoomCard from "../components/RoomCard";

const navItems = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "browse", icon: "🔍", label: "Browse Rooms" },
  { id: "bookings", icon: "📋", label: "My Bookings" },
  { id: "profile", icon: "👤", label: "Profile" },
];

const CATS = ["All", "Standard", "Deluxe", "Suite", "Family"];

/* ── HOME TAB ── */
const HomeTab = ({ setTab }) => {
  const [cat, setCat] = useState("All");
  const rooms = cat === "All" ? ROOMS : ROOMS.filter((r) => r.type === cat);

  return (
    <div className="fi">
      <div style={{ marginBottom: 24 }}>
        <h1
          className="serif"
          style={{ color: C.primary, fontSize: "1.9rem", fontWeight: 600 }}
        >
          Good morning, Julian
        </h1>
        <p
          className="sans"
          style={{ color: C.gray, marginTop: 4, fontSize: ".88rem" }}
        >
          Find your perfect stay today.
        </p>
      </div>

      {/* Search bar */}
      <div
        style={{
          background: C.neutral,
          borderRadius: 12,
          padding: "18px 24px",
          marginBottom: 26,
          boxShadow: "0 2px 12px rgba(10,29,55,.07)",
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 13,
              top: "50%",
              transform: "translateY(-50%)",
              color: C.gray,
            }}
          >
            🔍
          </span>
          <input
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              border: `1.5px solid ${C.grayL}`,
              borderRadius: 50,
              fontFamily: "DM Sans,sans-serif",
              fontSize: ".85rem",
              outline: "none",
            }}
            placeholder="Search destinations..."
          />
        </div>
        <button
          style={{
            background: C.primary,
            color: C.secondary,
            border: "none",
            borderRadius: 20,
            padding: "9px 16px",
            fontFamily: "DM Sans,sans-serif",
            fontSize: ".78rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          📅 Oct 12–15
        </button>
        <button
          style={{
            background: C.grayXL,
            color: C.primary,
            border: `1.5px solid ${C.grayL}`,
            borderRadius: 20,
            padding: "9px 16px",
            fontFamily: "DM Sans,sans-serif",
            fontSize: ".78rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          👥 2 Guests
        </button>
      </div>

      {/* Featured banner */}
      <div
        style={{
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          height: 250,
          marginBottom: 28,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80"
          alt="featured"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right,rgba(10,29,55,.82) 40%,transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <span
            className="sans"
            style={{
              background: C.secondary,
              color: C.primary,
              fontSize: ".62rem",
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: 4,
              width: "fit-content",
              marginBottom: 8,
            }}
          >
            FEATURED
          </span>
          <h2
            className="serif"
            style={{
              color: C.neutral,
              fontSize: "1.7rem",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Grand Ocean Villa
          </h2>
          <p
            className="sans"
            style={{
              color: "rgba(255,255,255,.6)",
              fontSize: ".8rem",
              marginBottom: 14,
            }}
          >
            Malibu, California
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              className="serif"
              style={{ color: C.tertiary, fontSize: "1.4rem", fontWeight: 700 }}
            >
              ₱850
              <span
                className="sans"
                style={{ fontSize: ".72rem", color: "rgba(255,255,255,.55)" }}
              >
                /night
              </span>
            </span>
            <button
              className="btn-g"
              style={{ padding: "9px 22px", fontSize: ".78rem" }}
              onClick={() => setTab("browse")}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <h3
          className="serif"
          style={{ color: C.primary, fontSize: "1.3rem", fontWeight: 600 }}
        >
          Available Rooms
        </h3>
        <span
          className="sans ul"
          style={{
            color: C.secondary,
            fontSize: ".8rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => setTab("browse")}
        >
          VIEW ALL
        </span>
      </div>

      <div
        style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}
      >
        {CATS.map((c) => (
          <button
            key={c}
            className={`ct${cat === c ? " on" : ""}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: 22,
        }}
      >
        {rooms.slice(0, 4).map((r) => (
          <RoomCard key={r.id} room={r} onBook={() => setTab("browse")} />
        ))}
      </div>
    </div>
  );
};

/* ── BROWSE TAB ── */
const BrowseTab = () => {
  const [cat, setCat] = useState("All");
  const rooms = cat === "All" ? ROOMS : ROOMS.filter((r) => r.type === cat);
  return (
    <div className="fi">
      <div style={{ marginBottom: 22 }}>
        <h2
          className="serif"
          style={{ color: C.primary, fontSize: "1.6rem", fontWeight: 600 }}
        >
          Browse Rooms
        </h2>
        <p
          className="sans"
          style={{ color: C.gray, fontSize: ".85rem", marginTop: 4 }}
        >
          All available rooms and suites
        </p>
      </div>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}
      >
        {CATS.map((c) => (
          <button
            key={c}
            className={`ct${cat === c ? " on" : ""}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 24,
        }}
      >
        {rooms.map((r) => (
          <RoomCard key={r.id} room={r} onBook={() => {}} />
        ))}
      </div>
    </div>
  );
};

/* ── BOOKINGS TAB ── */
const BookingsTab = () => {
  const myBks = BKS.slice(0, 4);
  return (
    <div className="fi">
      <div style={{ marginBottom: 22 }}>
        <h2
          className="serif"
          style={{ color: C.primary, fontSize: "1.6rem", fontWeight: 600 }}
        >
          My Bookings
        </h2>
      </div>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}
      >
        {["All", "Active", "Pending", "Cancelled"].map((f) => (
          <button key={f} className={`ct${f === "All" ? " on" : ""}`}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {myBks.map((b, idx) => (
          <div
            key={b.ref}
            className="lift"
            style={{
              background: C.neutral,
              borderRadius: 12,
              padding: "20px 24px",
              display: "flex",
              gap: 16,
              alignItems: "center",
              boxShadow: "0 2px 10px rgba(10,29,55,.07)",
            }}
          >
            <div
              style={{
                width: 80,
                height: 64,
                borderRadius: 8,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={ROOMS[idx % ROOMS.length].img}
                alt="room"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 5,
                }}
              >
                <div>
                  <h4
                    className="serif"
                    style={{
                      color: C.primary,
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {b.room}
                  </h4>
                  <div
                    className="sans"
                    style={{ color: C.gray, fontSize: ".74rem" }}
                  >
                    Ref: {b.ref}
                  </div>
                </div>
                <Badge s={b.status} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  className="sans"
                  style={{ color: C.gray, fontSize: ".78rem" }}
                >
                  📅 {b.checkIn} → {b.checkOut}
                </span>
                <span
                  className="serif"
                  style={{
                    color: C.secondary,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                  }}
                >
                  ₱{b.amt.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── PROFILE TAB ── */
const ProfileTab = ({ setPage }) => (
  <div className="fi" style={{ maxWidth: 580 }}>
    <div
      style={{
        background: C.primary,
        borderRadius: 14,
        padding: "28px 32px",
        marginBottom: 18,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: "1px solid rgba(197,160,89,.08)",
        }}
      />
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: `linear-gradient(135deg,${C.secondary},${C.tertiary})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 12px",
          border: "3px solid rgba(197,160,89,.3)",
        }}
      >
        <span
          className="serif"
          style={{ color: C.primary, fontSize: "1.6rem", fontWeight: 700 }}
        >
          JT
        </span>
      </div>
      <div
        className="serif"
        style={{
          color: C.neutral,
          fontSize: "1.4rem",
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        JULIAN THORNE
      </div>
      <div
        className="sans"
        style={{
          color: "rgba(255,255,255,.45)",
          fontSize: ".8rem",
          marginBottom: 12,
        }}
      >
        julian.thorne@stayease.com
      </div>
      <span className="bdg b-g">★ GOLD MEMBER</span>
    </div>
    <div
      style={{
        background: C.neutral,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(10,29,55,.07)",
      }}
    >
      {[
        ["👤", "Edit Profile"],
        ["📋", "Booking History"],
        ["💳", "Payment Methods"],
        ["🔔", "Notifications"],
        ["❓", "Help & Support"],
        ["🚪", "Log Out"],
      ].map(([ic, l], i) => (
        <div
          key={l}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: i < 5 ? `1px solid ${C.grayL}` : "none",
            cursor: "pointer",
            transition: "background .15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.grayXL)}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.neutral)}
          onClick={() => l === "Log Out" && setPage("landing")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: "1rem", width: 20, textAlign: "center" }}>
              {ic}
            </span>
            <span
              className="sans"
              style={{
                color: l === "Log Out" ? C.red : C.primary,
                fontSize: ".88rem",
                fontWeight: l === "Log Out" ? 600 : 400,
              }}
            >
              {l}
            </span>
          </div>
          {l !== "Log Out" && <span style={{ color: C.gray }}>›</span>}
        </div>
      ))}
    </div>
    <div
      className="sans"
      style={{
        textAlign: "center",
        color: C.gray,
        fontSize: ".7rem",
        marginTop: 18,
      }}
    >
      STAYEASE LUXURY CONCIERGE · Version 2.4.1 (Premium Edition)
    </div>
  </div>
);

/* ── MAIN COMPONENT ── */
const UserDash = ({ setPage }) => {
  const [tab, setTab] = useState("home");

  return (
    <Shell
      nav={navItems}
      tab={tab}
      setTab={setTab}
      setPage={setPage}
      name="Julian Thorne"
      role="guest"
      init="JT"
    >
      {tab === "home" && <HomeTab setTab={setTab} />}
      {tab === "browse" && <BrowseTab />}
      {tab === "bookings" && <BookingsTab />}
      {tab === "profile" && <ProfileTab setPage={setPage} />}
    </Shell>
  );
};

export default UserDash;
