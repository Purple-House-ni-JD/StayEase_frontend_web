import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Compass,
  ShoppingCart,
  ClipboardList,
  User as UserIcon,
  Search,
  X,
  CreditCard,
  BellRing,
  Trash2,
  Wifi,
  ThermometerSnowflake,
  Coffee,
  Tv,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { C } from "../constants";
import { Badge } from "../components/UI";
import Shell from "../components/Shell";
import RoomCard from "../components/RoomCard";
import { useAuth } from "../context/AuthContext";
import { roomsService } from "../api/rooms";
import { bookingsService } from "../api/bookings";
import { wishlistService } from "../api/wishlist";

const navItems = [
  { id: "home", icon: <Compass size={18} />, label: "Discover" },
  { id: "cart", icon: <ShoppingCart size={18} />, label: "Reservation Cart" },
  { id: "bookings", icon: <ClipboardList size={18} />, label: "My Stays" },
  { id: "profile", icon: <UserIcon size={18} />, label: "Profile" },
];

const CATS = [
  "All",
  "Standard",
  "Deluxe",
  "Superior",
  "Junior Suite",
  "Executive Suite",
  "Family",
];

/* ── ERROR MODAL ── */
const ErrorModal = ({ message, onClose }) => {
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
          maxWidth: 400,
          padding: 32,
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(220, 38, 38, 0.1)",
            color: C.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <X size={32} />
        </div>
        <h3
          className="serif"
          style={{
            color: C.primary,
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          Booking Unsuccessful
        </h3>
        <p
          className="sans"
          style={{
            color: C.gray,
            fontSize: ".95rem",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          {message}
        </p>
        <button
          className="btn-p"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            fontWeight: 600,
            background: C.red,
            borderColor: C.red,
            color: "#fff",
          }}
          onClick={onClose}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

/* ── PREMIUM ROOM DETAILS MODAL ── */
const RoomDetailsModal = ({ room, onClose, inCart, onToggleCart, setTab }) => {
  let imageUrl =
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80";
  if (room.image_urls && room.image_urls.length > 0)
    imageUrl = room.image_urls[0].image_url || room.image_urls[0];
  const price = parseFloat(
    room.price_per_night || room.price || room.pricePerNight || 0,
  );

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
            }}
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
                ₱{price.toLocaleString()}
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
              "Experience ultimate luxury in our beautifully appointed room."}
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
            }}
            onClick={() => {
              if (!inCart) {
                onToggleCart(room);
                setTab("cart");
              } else {
                onToggleCart(room);
              }
              onClose();
            }}
          >
            {inCart ? "Remove from Reservation" : "Review in Cart →"}
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

/* ── CART TAB (Step 1) ── */
const CartTab = ({
  cart,
  toggleCart,
  setTab,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
}) => {
  let actualNights = 0;
  if (checkIn && checkOut) {
    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    if (co > ci) actualNights = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
  }

  const now = new Date();
  const todayDateStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  const minCheckOutDate = checkIn ? checkIn : todayDateStr;

  const displayNights = actualNights > 0 ? actualNights : 1;
  const totalRoomPrice = cart.reduce(
    (sum, r) =>
      sum + parseFloat(r.price_per_night || r.price || r.pricePerNight || 0),
    0,
  );
  const displayTotalPrice = totalRoomPrice * displayNights;

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
          Review your selected rooms and dates.
        </p>
      </div>

      {cart.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: C.neutral,
            borderRadius: 20,
          }}
        >
          <ShoppingCart
            size={64}
            color={C.grayL}
            style={{ margin: "0 auto 20px" }}
          />
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
          <button
            className="btn-p"
            style={{ padding: "12px 32px", borderRadius: 50, marginTop: 10 }}
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
              const price = parseFloat(
                r.price_per_night || r.price || r.pricePerNight || 0,
              );
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
                    border: `1px solid ${C.grayL}`,
                  }}
                >
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 12,
                      overflow: "hidden",
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
                      ₱{price.toLocaleString()}{" "}
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
                    onClick={() => toggleCart(r)}
                    style={{
                      background: "transparent",
                      color: C.gray,
                      border: "none",
                      cursor: "pointer",
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
                    }}
                  >
                    Check-In
                  </label>
                  <input
                    type="date"
                    min={todayDateStr}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
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
                    }}
                  >
                    Check-Out
                  </label>
                  <input
                    type="date"
                    min={minCheckOutDate}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
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
                    color: C.primary,
                    fontWeight: 500,
                  }}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
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
                <span>
                  Subtotal (
                  {actualNights > 0
                    ? `${actualNights} nights`
                    : "1 night estimate"}
                  )
                </span>
                <span style={{ color: C.primary }}>
                  ₱{displayTotalPrice.toLocaleString()}
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
              }}
              onClick={() => {
                if (!checkIn || !checkOut || actualNights <= 0)
                  return alert(
                    "Please select valid Check-In and Check-Out dates before proceeding.",
                  );
                setTab("checkout");
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── CHECKOUT TAB (Step 2) ── */
const CheckoutTab = ({
  cart,
  setCart,
  setTab,
  setPage,
  navigate,
  refreshData,
  checkIn,
  checkOut,
  guests,
  user,
  setReceiptData,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  // 1. ADD THIS STATE FOR THE ERROR MODAL
  const [checkoutError, setCheckoutError] = useState(null);

  const ci = new Date(checkIn);
  const co = new Date(checkOut);
  const nights = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
  const totalRoomPrice = cart.reduce(
    (sum, r) =>
      sum + parseFloat(r.price_per_night || r.price || r.pricePerNight || 0),
    0,
  );
  const totalPrice = totalRoomPrice * nights;

  const PAY_METHODS = [
    { id: "card", label: "Card", icon: <CreditCard size={28} /> },
    { id: "cash", label: "Cash", icon: <BellRing size={28} /> },
  ];

  const handleCheckout = async () => {
    setLoading(true);
    setCheckoutError(null); // Clear previous errors
    try {
      const payload = {
        room_ids: cart.map((r) => parseInt(r.id, 10)),
        check_in: checkIn,
        check_out: checkOut,
        guest_count: parseInt(guests, 10),
        payment_method: paymentMethod,
        total_price: totalPrice,
      };

      const res = await bookingsService.create(payload);

      for (const r of cart) {
        try {
          await wishlistService.remove(r.id);
        } catch (e) {}
      }

      setReceiptData({
        ref:
          res?.booking_ref ||
          res?.[0]?.booking_ref ||
          `SE-${Math.floor(Math.random() * 100000)}`,
        total: totalPrice,
        checkIn,
        checkOut,
        nights,
        guests,
      });

      setCart([]);
      refreshData();
      navigate("/receipt");
    } catch (err) {
      console.error("Full error object:", err);

      // 2. UPDATE THE CATCH BLOCK TO EXTRACT THE SPECIFIC ERROR TEXT
      let errorMsg = "Failed to secure reservation. Please try again.";
      const data = err?.response?.data || err;

      if (data?.room_ids && Array.isArray(data.room_ids)) {
        // This catches the exact: "Rooms already booked for these dates: ['Deluxe Room 201']"
        errorMsg = data.room_ids[0].replace(/[\[\]']/g, ""); // Strips the brackets/quotes for cleaner UI
      } else if (data?.detail) {
        errorMsg = data.detail;
      } else if (typeof data === "object") {
        errorMsg = Object.values(data).flat().join(" | ");
      } else if (typeof data === "string") {
        errorMsg = data;
      } else if (err?.message) {
        errorMsg = err.message;
      }

      // Trigger the modal instead of the alert
      setCheckoutError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fi">
      {checkoutError && (
        <ErrorModal
          message={checkoutError}
          onClose={() => setCheckoutError(null)}
        />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <button
          onClick={() => setTab("cart")}
          style={{
            background: C.neutral,
            border: `1px solid ${C.grayL}`,
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: C.primary,
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2
            className="serif"
            style={{ color: C.primary, fontSize: "2rem", fontWeight: 600 }}
          >
            Secure Checkout
          </h2>
          <p
            className="sans"
            style={{ color: C.gray, marginTop: 4, fontSize: ".9rem" }}
          >
            Finalize your payment to secure your stay.
          </p>
        </div>
      </div>

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
            gap: 24,
          }}
        >
          <div
            style={{
              background: C.neutral,
              borderRadius: 20,
              padding: 32,
              border: `1px solid ${C.grayL}`,
              boxShadow: "0 4px 20px rgba(10,29,55,.04)",
            }}
          >
            <h3
              className="serif"
              style={{
                color: C.primary,
                fontSize: "1.3rem",
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              1. Guest Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <label className="lbl">First Name</label>
                <input
                  type="text"
                  className="inp"
                  value={user?.first_name || ""}
                  disabled
                  style={{ background: C.grayXL, color: C.gray }}
                />
              </div>
              <div>
                <label className="lbl">Last Name</label>
                <input
                  type="text"
                  className="inp"
                  value={user?.last_name || ""}
                  disabled
                  style={{ background: C.grayXL, color: C.gray }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="lbl">Email Address</label>
                <input
                  type="email"
                  className="inp"
                  value={user?.email || ""}
                  disabled
                  style={{ background: C.grayXL, color: C.gray }}
                />
              </div>
            </div>
            <p
              className="sans"
              style={{
                color: C.gray,
                fontSize: ".8rem",
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <ShieldCheck size={14} color={C.secondary} /> Your information is
              securely encrypted.
            </p>
          </div>

          <div
            style={{
              background: C.neutral,
              borderRadius: 20,
              padding: 32,
              border: `1px solid ${C.grayL}`,
              boxShadow: "0 4px 20px rgba(10,29,55,.04)",
            }}
          >
            <h3
              className="serif"
              style={{
                color: C.primary,
                fontSize: "1.3rem",
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              2. Payment Method
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {PAY_METHODS.map((pm) => (
                <div
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  style={{
                    border: `2px solid ${
                      paymentMethod === pm.id ? C.secondary : C.grayL
                    }`,
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
                      fontSize: ".8rem",
                      fontWeight: paymentMethod === pm.id ? 700 : 500,
                      color: C.primary,
                    }}
                  >
                    {pm.label}
                  </span>
                </div>
              ))}
            </div>

            {/* RESTORED: Card Details Form */}
            {paymentMethod === "card" && (
              <div
                style={{
                  padding: 20,
                  background: C.grayXL,
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div>
                  <label className="lbl">Card Number</label>
                  <input
                    type="text"
                    className="inp"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <label className="lbl">Expiry Date</label>
                    <input type="text" className="inp" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="lbl">CVC</label>
                    <input type="text" className="inp" placeholder="123" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 320,
            background: C.neutral,
            borderRadius: 20,
            padding: 32,
            border: `1px solid ${C.grayL}`,
            boxShadow: "0 10px 40px rgba(10,29,55,.08)",
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
            Order Summary
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {cart.map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: `1px solid ${C.grayXL}`,
                  paddingBottom: 12,
                }}
              >
                <div>
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
                    style={{ color: C.gray, fontSize: ".75rem", marginTop: 2 }}
                  >
                    {r.category}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: C.grayXL,
              borderRadius: 8,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
                fontSize: ".85rem",
                color: C.gray,
              }}
            >
              <span>Dates</span>
              <span style={{ color: C.primary, fontWeight: 500 }}>
                {checkIn} to {checkOut}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
                fontSize: ".85rem",
                color: C.gray,
              }}
            >
              <span>Duration</span>
              <span style={{ color: C.primary, fontWeight: 500 }}>
                {nights} nights
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: ".85rem",
                color: C.gray,
              }}
            >
              <span>Guests</span>
              <span style={{ color: C.primary, fontWeight: 500 }}>
                {guests} Guests
              </span>
            </div>
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
              <span>Subtotal</span>
              <span style={{ color: C.primary }}>
                ₱{totalPrice.toLocaleString()}
              </span>
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <Lock size={18} /> Complete Reservation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── BOOKING DETAILS MODAL (NEW) ── */
const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;

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
          maxWidth: 480,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: 32,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2
            className="serif"
            style={{ color: C.primary, fontSize: "1.6rem", fontWeight: 600 }}
          >
            Stay Details
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: C.gray,
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 16,
            borderBottom: `1px solid ${C.grayXL}`,
          }}
        >
          <div>
            <div
              className="sans"
              style={{
                color: C.gray,
                fontSize: ".75rem",
                textTransform: "uppercase",
                letterSpacing: ".05em",
              }}
            >
              Reference ID
            </div>
            <div
              className="serif"
              style={{
                color: C.primary,
                fontSize: "1.2rem",
                fontWeight: 700,
              }}
            >
              {booking.booking_ref}
            </div>
          </div>
          <Badge s={booking.status} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 24,
          }}
        >
          <div style={{ background: C.grayXL, padding: 16, borderRadius: 12 }}>
            <div
              className="sans"
              style={{
                color: C.gray,
                fontSize: ".7rem",
                textTransform: "uppercase",
                letterSpacing: ".05em",
                marginBottom: 4,
              }}
            >
              Check-In
            </div>
            <div
              className="sans"
              style={{ color: C.primary, fontSize: ".95rem", fontWeight: 600 }}
            >
              {booking.check_in}
            </div>
          </div>
          <div style={{ background: C.grayXL, padding: 16, borderRadius: 12 }}>
            <div
              className="sans"
              style={{
                color: C.gray,
                fontSize: ".7rem",
                textTransform: "uppercase",
                letterSpacing: ".05em",
                marginBottom: 4,
              }}
            >
              Check-Out
            </div>
            <div
              className="sans"
              style={{ color: C.primary, fontSize: ".95rem", fontWeight: 600 }}
            >
              {booking.check_out}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 24,
            paddingBottom: 16,
            borderBottom: `1px solid ${C.grayXL}`,
          }}
        >
          <div className="sans" style={{ color: C.gray, fontSize: ".9rem" }}>
            Guests
          </div>
          <div className="sans" style={{ color: C.primary, fontWeight: 600 }}>
            {booking.guest_count}
          </div>
        </div>

        {booking.payment_method && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 16,
              paddingBottom: 16,
              borderBottom: `1px solid ${C.grayXL}`,
            }}
          >
            <div className="sans" style={{ color: C.gray, fontSize: ".9rem" }}>
              Payment Method
            </div>
            <div
              className="sans"
              style={{
                color: C.primary,
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {booking.payment_method.replace("_", " ")}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginTop: 24,
          }}
        >
          <div
            className="serif"
            style={{ color: C.primary, fontSize: "1.1rem", fontWeight: 600 }}
          >
            Total Amount
          </div>
          <div
            className="serif"
            style={{
              color: C.secondary,
              fontSize: "1.6rem",
              fontWeight: 700,
            }}
          >
            ₱{parseFloat(booking.total_price || 0).toLocaleString()}
          </div>
        </div>

        <button
          className="btn-p"
          style={{
            width: "100%",
            padding: "14px",
            marginTop: 32,
            borderRadius: 12,
            fontWeight: 600,
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

/* ── BOOKINGS TAB ── */
const BookingsTab = ({ bookings }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);

  return (
    <div className="fi">
      {/* RESTORED: Detailed Booking Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      <div style={{ marginBottom: 32 }}>
        <h2
          className="serif"
          style={{ color: C.primary, fontSize: "2rem", fontWeight: 600 }}
        >
          My Stays
        </h2>
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
              onClick={() => setSelectedBooking(b)} // Clicking opens the details modal
              style={{
                background: C.neutral,
                borderRadius: 16,
                padding: "24px 32px",
                display: "flex",
                gap: 24,
                alignItems: "center",
                border: `1px solid ${C.grayL}`,
                cursor: "pointer",
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
                    style={{
                      color: C.gray,
                      fontSize: ".85rem",
                      fontWeight: 500,
                    }}
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
};

/* ── PROFILE TAB (NEW & OPTIMIZED) ── */
const ProfileTab = ({ user, logout, navigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (user)
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
      });
  }, [user]);

  const handleSave = async () => {
    // await authService.updateProfile(formData);
    alert("Profile details updated successfully!");
    setIsEditing(false);
  };

  return (
    <div
      className="fi"
      style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}
    >
      <div
        style={{
          background: C.primary,
          borderRadius: 24,
          padding: "48px 32px",
          marginBottom: 24,
          boxShadow: "0 20px 40px rgba(10,29,55,.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Gold Background Accent */}
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(197,160,89,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: `linear-gradient(135deg,${C.secondary},${C.tertiary})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              border: "4px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <span
              className="serif"
              style={{ color: C.primary, fontSize: "2.4rem", fontWeight: 700 }}
            >
              {formData.first_name?.charAt(0) || "G"}
            </span>
          </div>

          {!isEditing ? (
            <>
              <div
                className="serif"
                style={{
                  color: C.neutral,
                  fontSize: "1.8rem",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {formData.first_name} {formData.last_name}
              </div>
              <div
                className="sans"
                style={{
                  color: "rgba(255,255,255,.6)",
                  fontSize: ".95rem",
                  marginBottom: 32,
                }}
              >
                {formData.email}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: C.secondary,
                  color: C.primary,
                  border: "none",
                  padding: "12px 32px",
                  borderRadius: 50,
                  cursor: "pointer",
                  fontSize: ".95rem",
                  fontWeight: 600,
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(197,160,89,.3)",
                }}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginTop: 16,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <label
                    className="sans"
                    style={{
                      display: "block",
                      fontSize: ".75rem",
                      color: "rgba(255,255,255,.6)",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                      marginBottom: 6,
                    }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      outline: "none",
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: ".95rem",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="sans"
                    style={{
                      display: "block",
                      fontSize: ".75rem",
                      color: "rgba(255,255,255,.6)",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                      marginBottom: 6,
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      outline: "none",
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: ".95rem",
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  className="sans"
                  style={{
                    display: "block",
                    fontSize: ".75rem",
                    color: "rgba(255,255,255,.6)",
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    marginBottom: 6,
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    outline: "none",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: ".95rem",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "transparent",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: ".95rem",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: 12,
                    border: "none",
                    background: C.secondary,
                    color: C.primary,
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: ".95rem",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className="btn-o"
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: 16,
          borderColor: "rgba(239, 68, 68, 0.3)",
          background: "rgba(239, 68, 68, 0.05)",
          color: C.red,
          fontSize: "1rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "all 0.2s",
        }}
        onClick={() => {
          logout();
          navigate("/");
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)")
        }
      >
        <LogOut size={20} /> Log Out Securely
      </button>
    </div>
  );
};

/* ── MAIN COMPONENT ── */
const UserDash = ({ setPage, setReceiptData }) => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "home";
  const setTab = (newTab) => setSearchParams({ tab: newTab });

  const [modalRoom, setModalRoom] = useState(null);
  const [cart, setCart] = useState([]);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const fetchFunc = roomsService.list
        ? roomsService.list
        : roomsService.getRooms;
      const roomsRes = await fetchFunc();
      const allRooms = Array.isArray(roomsRes)
        ? roomsRes
        : roomsRes?.results || [];
      setRooms(allRooms);
    } catch (err) {}

    try {
      if (bookingsService.myBookings) {
        const bksRes = await bookingsService.myBookings();
        setBookings(Array.isArray(bksRes) ? bksRes : bksRes?.results || []);
      }
    } catch (err) {}

    try {
      if (wishlistService.list) {
        const wlRes = await wishlistService.list();
        const wlData = Array.isArray(wlRes) ? wlRes : wlRes?.results || [];
        const dbCartRooms = wlData.map((item) =>
          item.room ? item.room : item,
        );
        setCart(dbCartRooms);
      }
    } catch (err) {}

    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const toggleCart = async (room) => {
    const inCart = cart.some((c) => c.id === room.id);
    if (inCart) {
      setCart((prev) => prev.filter((r) => r.id !== room.id));
      try {
        await wishlistService.remove(room.id);
      } catch (e) {
        fetchAllData();
      }
    } else {
      setCart((prev) => [...prev, room]);
      try {
        await wishlistService.add(room.id);
      } catch (e) {
        fetchAllData();
      }
    }
  };

  if (loading)
    return (
      <div
        style={{ padding: "100px 20px", textAlign: "center", color: C.primary }}
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
          setTab={setTab}
        />
      )}

      <Shell
        nav={navItems}
        tab={tab === "checkout" ? "cart" : tab}
        setTab={setTab}
        name={
          `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Guest"
        }
        role="guest"
        init={user?.first_name?.charAt(0) || "G"}
        bookings={bookings}
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
            toggleCart={toggleCart}
            setTab={setTab}
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            guests={guests}
            setGuests={setGuests}
          />
        )}

        {tab === "checkout" && (
          <CheckoutTab
            cart={cart}
            setCart={setCart}
            setTab={setTab}
            setPage={setPage}
            navigate={navigate}
            refreshData={fetchAllData}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            user={user}
            setReceiptData={setReceiptData}
          />
        )}

        {tab === "bookings" && <BookingsTab bookings={bookings} />}

        {tab === "profile" && (
          <ProfileTab user={user} logout={logout} navigate={navigate} />
        )}
      </Shell>
    </>
  );
};

export default UserDash;
