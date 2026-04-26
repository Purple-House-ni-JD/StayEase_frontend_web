import { useState, useEffect } from "react";
import {
  Sparkles,
  ShoppingCart,
  ClipboardList,
  User as UserIcon,
  Search,
  X,
  Check,
  CreditCard,
  Smartphone,
  BellRing,
  Trash2,
  Wifi,
  ThermometerSnowflake,
  Coffee,
  Tv,
  LogOut,
} from "lucide-react";
import { C } from "../constants";
import { Badge } from "../components/UI";
import Shell from "../components/Shell";
import RoomCard from "../components/RoomCard";
import { useAuth } from "../context/AuthContext";
import { roomsService } from "../api/rooms";
import { bookingsService } from "../api/bookings";

const navItems = [
  { id: "home", icon: <Sparkles size={18} />, label: "Discover" },
  { id: "cart", icon: <ShoppingCart size={18} />, label: "Reservation Cart" },
  { id: "bookings", icon: <ClipboardList size={18} />, label: "My Stays" },
  { id: "profile", icon: <UserIcon size={18} />, label: "Profile" },
];

const CATS = ["All", "Standard", "Deluxe", "Suite", "Villa", "Family"];

/* ── PREMIUM ROOM DETAILS MODAL ── */
const RoomDetailsModal = ({ room, onClose, inCart, onToggleCart }) => {
  let imageUrl =
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80";
  if (room.image_urls && room.image_urls.length > 0)
    imageUrl = room.image_urls[0].image_url || room.image_urls[0];

  return (
    <div
      className="mbg"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="lift"
        style={{
          background: C.neutral,
          borderRadius: 24,
          width: "100%",
          maxWidth: 540,
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ position: "relative", height: 280 }}>
          <img
            src={imageUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "40%",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
            }}
          />
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              border: "none",
              width: 36,
              height: 36,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.4)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: "32px", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div>
              <span
                className="sans"
                style={{
                  color: C.secondary,
                  fontSize: ".75rem",
                  fontWeight: 700,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                {room.category}
              </span>
              <h2
                className="serif"
                style={{
                  color: C.primary,
                  fontSize: "1.8rem",
                  fontWeight: 600,
                  marginTop: 4,
                  lineHeight: 1.1,
                }}
              >
                {room.name}
              </h2>
            </div>
            <div
              style={{
                textAlign: "right",
                background: C.grayXL,
                padding: "10px 16px",
                borderRadius: 12,
              }}
            >
              <div
                className="serif"
                style={{
                  color: C.primary,
                  fontSize: "1.3rem",
                  fontWeight: 700,
                }}
              >
                ₱{parseFloat(room.price_per_night).toLocaleString()}
              </div>
              <div
                className="sans"
                style={{
                  color: C.gray,
                  fontSize: ".7rem",
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                }}
              >
                per night
              </div>
            </div>
          </div>
          <p
            className="sans"
            style={{
              color: C.gray,
              fontSize: ".95rem",
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            {room.description ||
              "Experience ultimate luxury in our beautifully appointed room, designed to provide unparalleled comfort and relaxation."}
          </p>

          <h4
            className="sans"
            style={{
              color: C.primary,
              fontSize: ".85rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".05em",
              marginBottom: 12,
            }}
          >
            Premium Amenities
          </h4>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            {[
              { label: "High-Speed WiFi", icon: <Wifi size={14} /> },
              {
                label: "Climate Control",
                icon: <ThermometerSnowflake size={14} />,
              },
              { label: "Room Service", icon: <Coffee size={14} /> },
              { label: "Smart TV", icon: <Tv size={14} /> },
            ].map((am) => (
              <span
                key={am.label}
                className="sans"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#F0F4F8",
                  border: "1px solid #D9E2EC",
                  padding: "8px 14px",
                  borderRadius: 50,
                  fontSize: ".75rem",
                  color: "#334E68",
                  fontWeight: 500,
                }}
              >
                {am.icon} {am.label}
              </span>
            ))}
          </div>

          <button
            className={inCart ? "btn-o" : "btn-p"}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: ".95rem",
              borderRadius: 12,
              borderColor: inCart ? C.red : "",
              color: inCart ? C.red : "",
              fontWeight: 600,
              letterSpacing: ".05em",
              transition: "all 0.2s",
            }}
            onClick={() => {
              onToggleCart(room);
              onClose();
            }}
          >
            {inCart ? "Remove from Reservation" : "Reserve This Room"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── SHARED LISTINGS TAB ── */
const RoomListings = ({
  title,
  showSearch,
  limit,
  rooms,
  setModalRoom,
  cart,
  toggleCart,
}) => {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = rooms.filter((r) => {
    const matchCat =
      cat === "All" || r.category?.toLowerCase() === cat.toLowerCase();
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div className="fi">
      <div style={{ marginBottom: showSearch ? 24 : 16 }}>
        <h2
          className="serif"
          style={{ color: C.primary, fontSize: "2rem", fontWeight: 600 }}
        >
          {title}
        </h2>
        <p
          className="sans"
          style={{ color: C.gray, marginTop: 4, fontSize: ".9rem" }}
        >
          Curated stays for the modern traveler.
        </p>
      </div>

      {showSearch && (
        <div
          style={{
            background: C.neutral,
            borderRadius: 16,
            padding: "12px 24px",
            marginBottom: 26,
            boxShadow: "0 4px 20px rgba(10,29,55,.05)",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                color: C.gray,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Search size={20} />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 14px 14px 36px",
                border: "none",
                background: "transparent",
                fontFamily: "DM Sans,sans-serif",
                fontSize: ".95rem",
                outline: "none",
                color: C.primary,
              }}
              placeholder="Search destinations, rooms, or keywords..."
            />
          </div>
        </div>
      )}

      <div
        style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}
      >
        {CATS.map((c) => (
          <button
            key={c}
            className={`ct${cat === c ? " on" : ""}`}
            onClick={() => setCat(c)}
            style={{
              padding: "10px 20px",
              fontSize: ".85rem",
              borderRadius: 50,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 28,
        }}
      >
        {displayed.map((r) => (
          <RoomCard
            key={r.id}
            room={r}
            onBook={() => setModalRoom(r)}
            inCart={cart.some((c) => c.id === r.id)}
            onToggleCart={toggleCart}
          />
        ))}
        {displayed.length === 0 && (
          <p
            className="sans"
            style={{ color: C.gray, fontSize: "1.1rem", padding: "40px 0" }}
          >
            No rooms found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

/* ── PREMIUM CART & CHECKOUT TAB ── */
const CartTab = ({ cart, setCart, setTab, refreshData }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [loading, setLoading] = useState(false);

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights =
    checkIn && checkOut && checkOutDate > checkInDate
      ? Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
      : 0;

  const totalRoomPrice = cart.reduce(
    (sum, r) => sum + parseFloat(r.price_per_night || 0),
    0,
  );
  const totalPrice = nights > 0 ? totalRoomPrice * nights : 0;

  const PAY_METHODS = [
    { id: "Credit Card", icon: <CreditCard size={28} /> },
    { id: "GCash", icon: <Smartphone size={28} /> },
    { id: "Pay-at-Hotel", label: "Pay at Hotel", icon: <BellRing size={28} /> },
  ];

  const handleCheckout = async () => {
    if (!checkIn || !checkOut || nights <= 0)
      return alert("Please select valid dates.");
    setLoading(true);
    try {
      await bookingsService.create({
        room_ids: cart.map((r) => r.id),
        check_in: checkIn,
        check_out: checkOut,
        guest_count: guests,
        payment_method: paymentMethod,
      });
      alert("Reservation Confirmed! Thank you for choosing StayEase.");
      setCart([]);
      refreshData();
      setTab("bookings");
    } catch (err) {
      alert("Failed to secure reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fi">
      <div style={{ marginBottom: 32 }}>
        <h2
          className="serif"
          style={{ color: C.primary, fontSize: "2rem", fontWeight: 600 }}
        >
          Reservation Cart
        </h2>
        <p
          className="sans"
          style={{ color: C.gray, marginTop: 4, fontSize: ".9rem" }}
        >
          Complete your booking details below.
        </p>
      </div>

      {cart.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: C.neutral,
            borderRadius: 20,
            boxShadow: "0 10px 30px rgba(10,29,55,.04)",
          }}
        >
          <div
            style={{
              color: C.grayL,
              marginBottom: 20,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ShoppingCart size={64} />
          </div>
          <h3
            className="serif"
            style={{
              color: C.primary,
              fontSize: "1.4rem",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Your cart is empty
          </h3>
          <p className="sans" style={{ color: C.gray, marginBottom: 24 }}>
            Explore our premium rooms and suites to start your journey.
          </p>
          <button
            className="btn-p"
            style={{ padding: "12px 32px", borderRadius: 50 }}
            onClick={() => setTab("home")}
          >
            Discover Rooms
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              flex: 2,
              minWidth: 320,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {cart.map((r) => {
              let imageUrl =
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80";
              if (r.image_urls && r.image_urls.length > 0)
                imageUrl = r.image_urls[0].image_url || r.image_urls[0];
              return (
                <div
                  key={r.id}
                  style={{
                    background: C.neutral,
                    borderRadius: 16,
                    padding: 20,
                    display: "flex",
                    gap: 20,
                    alignItems: "center",
                    boxShadow: "0 4px 20px rgba(10,29,55,.04)",
                    border: `1px solid ${C.grayL}`,
                  }}
                >
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: C.grayXL,
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      className="sans"
                      style={{
                        color: C.secondary,
                        fontSize: ".65rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".1em",
                        marginBottom: 4,
                      }}
                    >
                      {r.category}
                    </div>
                    <h4
                      className="serif"
                      style={{
                        color: C.primary,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      {r.name}
                    </h4>
                    <div
                      className="serif"
                      style={{
                        color: C.primary,
                        fontSize: "1.2rem",
                        fontWeight: 700,
                      }}
                    >
                      ₱{parseFloat(r.price_per_night || 0).toLocaleString()}{" "}
                      <span
                        className="sans"
                        style={{
                          fontSize: ".75rem",
                          color: C.gray,
                          fontWeight: 400,
                        }}
                      >
                        / night
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setCart((prev) => prev.filter((c) => c.id !== r.id))
                    }
                    style={{
                      background: "transparent",
                      color: C.gray,
                      border: "none",
                      width: 40,
                      height: 40,
                      borderRadius: 50,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#FEE2E2";
                      e.currentTarget.style.color = C.red;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = C.gray;
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 320,
              background: C.neutral,
              borderRadius: 20,
              padding: 32,
              boxShadow: "0 10px 40px rgba(10,29,55,.08)",
              border: `1px solid ${C.grayL}`,
            }}
          >
            <h3
              className="serif"
              style={{
                color: C.primary,
                fontSize: "1.3rem",
                fontWeight: 600,
                marginBottom: 24,
              }}
            >
              Stay Details
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    background: C.grayXL,
                    padding: "10px 16px",
                    borderRadius: 12,
                  }}
                >
                  <label
                    className="sans"
                    style={{
                      display: "block",
                      fontSize: ".7rem",
                      color: C.gray,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Check-In
                  </label>
                  <input
                    type="date"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: "DM Sans,sans-serif",
                      color: C.primary,
                      fontWeight: 500,
                    }}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    background: C.grayXL,
                    padding: "10px 16px",
                    borderRadius: 12,
                  }}
                >
                  <label
                    className="sans"
                    style={{
                      display: "block",
                      fontSize: ".7rem",
                      color: C.gray,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Check-Out
                  </label>
                  <input
                    type="date"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: "DM Sans,sans-serif",
                      color: C.primary,
                      fontWeight: 500,
                    }}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              <div
                style={{
                  background: C.grayXL,
                  padding: "10px 16px",
                  borderRadius: 12,
                }}
              >
                <label
                  className="sans"
                  style={{
                    display: "block",
                    fontSize: ".7rem",
                    color: C.gray,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Total Guests
                </label>
                <input
                  type="number"
                  min="1"
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "DM Sans,sans-serif",
                    color: C.primary,
                    fontWeight: 500,
                  }}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
            </div>

            <h3
              className="serif"
              style={{
                color: C.primary,
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Payment Method
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 32,
              }}
            >
              {PAY_METHODS.map((pm) => (
                <div
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  style={{
                    border: `2px solid ${paymentMethod === pm.id ? C.secondary : C.grayL}`,
                    background:
                      paymentMethod === pm.id
                        ? "rgba(197,160,89,.05)"
                        : "transparent",
                    padding: "16px 12px",
                    borderRadius: 12,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      color: paymentMethod === pm.id ? C.secondary : C.gray,
                    }}
                  >
                    {pm.icon}
                  </div>
                  <span
                    className="sans"
                    style={{
                      fontSize: ".75rem",
                      fontWeight: paymentMethod === pm.id ? 700 : 500,
                      color: C.primary,
                      textAlign: "center",
                    }}
                  >
                    {pm.label || pm.id}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: `1px dashed ${C.grayL}`,
                paddingTop: 20,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  fontSize: ".9rem",
                  color: C.gray,
                }}
              >
                <span>Subtotal ({nights} nights)</span>
                <span style={{ color: C.primary }}>
                  ₱{totalPrice.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  fontSize: ".9rem",
                  color: C.gray,
                }}
              >
                <span>Taxes & Fees</span>
                <span style={{ color: C.primary }}>Included</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  className="serif"
                  style={{
                    fontWeight: 600,
                    color: C.primary,
                    fontSize: "1.2rem",
                  }}
                >
                  Total
                </span>
                <span
                  className="serif"
                  style={{
                    fontWeight: 700,
                    color: C.primary,
                    fontSize: "1.6rem",
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
                padding: "16px",
                fontSize: "1rem",
                borderRadius: 12,
                fontWeight: 600,
                letterSpacing: ".05em",
              }}
              onClick={handleCheckout}
              disabled={loading || nights <= 0}
            >
              {loading ? "Processing..." : `Complete Reservation`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── BOOKINGS TAB ── */
const BookingsTab = ({ bookings }) => (
  <div className="fi">
    <div style={{ marginBottom: 32 }}>
      <h2
        className="serif"
        style={{ color: C.primary, fontSize: "2rem", fontWeight: 600 }}
      >
        My Stays
      </h2>
      <p
        className="sans"
        style={{ color: C.gray, marginTop: 4, fontSize: ".9rem" }}
      >
        Manage your upcoming and past reservations.
      </p>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {bookings.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: C.neutral,
            borderRadius: 20,
          }}
        >
          <p className="sans" style={{ color: C.gray, fontSize: "1.1rem" }}>
            You have no reservations yet.
          </p>
        </div>
      ) : (
        bookings.map((b) => (
          <div
            key={b.id}
            className="lift"
            style={{
              background: C.neutral,
              borderRadius: 16,
              padding: "24px 32px",
              display: "flex",
              gap: 24,
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(10,29,55,.04)",
              border: `1px solid ${C.grayL}`,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div>
                  <div
                    className="sans"
                    style={{
                      color: C.gray,
                      fontSize: ".7rem",
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      marginBottom: 4,
                    }}
                  >
                    Booking Ref: {b.booking_ref}
                  </div>
                  <h4
                    className="serif"
                    style={{
                      color: C.primary,
                      fontSize: "1.2rem",
                      fontWeight: 600,
                    }}
                  >
                    StayEase Reservation
                  </h4>
                </div>
                <Badge s={b.status} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 12,
                  borderTop: `1px dashed ${C.grayL}`,
                }}
              >
                <span
                  className="sans"
                  style={{ color: C.gray, fontSize: ".85rem", fontWeight: 500 }}
                >
                  <span style={{ color: C.primary }}>{b.check_in}</span>{" "}
                  &nbsp;→&nbsp;{" "}
                  <span style={{ color: C.primary }}>{b.check_out}</span>{" "}
                  &nbsp;&nbsp;|&nbsp;&nbsp; 👥 {b.guest_count} Guests
                </span>
                <span
                  className="serif"
                  style={{
                    color: C.secondary,
                    fontSize: "1.3rem",
                    fontWeight: 700,
                  }}
                >
                  ₱{parseFloat(b.total_price || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

/* ── MAIN COMPONENT ── */
const UserDash = ({ setPage }) => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("home");
  const [modalRoom, setModalRoom] = useState(null);
  const [cart, setCart] = useState([]);

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);

    // 1. Safe Room Fetching - Without restrictive UI filters so rooms ALWAYS show
    try {
      // Determines whether your backend uses .list() or .getRooms()
      const fetchFunc = roomsService.list
        ? roomsService.list
        : roomsService.getRooms;
      const roomsRes = await fetchFunc();

      // Safely extract the array no matter how Django wraps it
      const allRooms = Array.isArray(roomsRes)
        ? roomsRes
        : roomsRes?.results || [];
      setRooms(allRooms);
    } catch (err) {
      console.error("Failed to load rooms:", err);
    }

    // 2. Safe Booking Fetching
    try {
      if (bookingsService.getMyBookings) {
        const bksRes = await bookingsService.getMyBookings();
        setBookings(Array.isArray(bksRes) ? bksRes : bksRes?.results || []);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const toggleCart = (room) => {
    setCart((prev) =>
      prev.find((r) => r.id === room.id)
        ? prev.filter((r) => r.id !== room.id)
        : [...prev, room],
    );
  };

  if (loading)
    return (
      <div
        style={{
          padding: "100px 20px",
          textAlign: "center",
          fontFamily: "DM Sans, sans-serif",
          color: C.primary,
          fontSize: "1.1rem",
        }}
      >
        Loading your stay...
      </div>
    );

  return (
    <>
      {modalRoom && (
        <RoomDetailsModal
          room={modalRoom}
          onClose={() => setModalRoom(null)}
          inCart={cart.some((c) => c.id === modalRoom.id)}
          onToggleCart={toggleCart}
        />
      )}

      <Shell
        nav={navItems}
        tab={tab}
        setTab={setTab}
        setPage={setPage}
        name={
          `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Guest"
        }
        role="guest"
        init={user?.first_name?.charAt(0) || "G"}
      >
        {tab === "home" && (
          <RoomListings
            title={`Welcome back, ${user?.first_name || "Guest"}`}
            showSearch={true}
            rooms={rooms}
            setModalRoom={setModalRoom}
            cart={cart}
            toggleCart={toggleCart}
          />
        )}
        {tab === "cart" && (
          <CartTab
            cart={cart}
            setCart={setCart}
            setTab={setTab}
            refreshData={fetchAllData}
          />
        )}
        {tab === "bookings" && <BookingsTab bookings={bookings} />}

        {tab === "profile" && (
          <div className="fi" style={{ maxWidth: 580 }}>
            <div
              style={{
                background: C.primary,
                borderRadius: 20,
                padding: "40px",
                textAlign: "center",
                marginBottom: 24,
                boxShadow: "0 10px 30px rgba(10,29,55,.1)",
              }}
            >
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg,${C.secondary},${C.tertiary})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  border: "4px solid rgba(197,160,89,.3)",
                }}
              >
                <span
                  className="serif"
                  style={{
                    color: C.primary,
                    fontSize: "2rem",
                    fontWeight: 700,
                  }}
                >
                  {user?.first_name?.charAt(0) || "G"}
                </span>
              </div>
              <div
                className="serif"
                style={{
                  color: C.neutral,
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                {user?.first_name} {user?.last_name}
              </div>
              <div
                className="sans"
                style={{ color: "rgba(255,255,255,.5)", fontSize: ".9rem" }}
              >
                {user?.email}
              </div>
            </div>
            <button
              className="btn-o"
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 12,
                borderColor: C.red,
                color: C.red,
                fontSize: "1rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onClick={() => {
                logout();
                setPage("landing");
              }}
            >
              <LogOut size={18} /> Log Out Securely
            </button>
          </div>
        )}
      </Shell>
    </>
  );
};

export default UserDash;
