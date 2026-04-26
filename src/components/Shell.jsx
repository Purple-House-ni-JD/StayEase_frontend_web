import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { C } from "../constants";
import { useAuth } from "../context/AuthContext";

const Shell = ({
  nav,
  tab,
  setTab,
  children,
  name,
  role,
  init,
  bookings = [],
}) => {
  const [col, setCol] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // NEW: Smart Notification Function!
  const handleNotification = () => {
    // Look for bookings that are specifically still "pending"
    const pending = bookings.filter(
      (b) => String(b.status).toLowerCase() === "pending",
    );

    if (pending.length > 0) {
      const latest = pending[0];
      alert(
        `🔔 Notification:\nYou successfully booked a stay (Ref: ${latest.booking_ref}) and we are currently waiting for a change of status from the admin. We will update you soon!`,
      );
    } else if (bookings.length > 0) {
      const latest = bookings[0];
      alert(
        `🔔 Notification:\nYour latest reservation (Ref: ${latest.booking_ref}) is currently marked as ${String(latest.status).toUpperCase()}.`,
      );
    } else {
      alert("🔔 You're all caught up! No new notifications.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      {/* Sidebar */}
      <aside
        style={{
          width: col ? 80 : 260,
          background: C.primary,
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          transition: "width .3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          flexShrink: 0,
          zIndex: 20,
        }}
      >
        {/* Logo row */}
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid rgba(197,160,89,.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 76,
          }}
        >
          {!col && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: `linear-gradient(135deg,${C.secondary},${C.tertiary})`,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(197,160,89,.2)",
                }}
              >
                <span
                  className="serif"
                  style={{
                    fontWeight: 700,
                    fontSize: ".85rem",
                    color: C.primary,
                  }}
                >
                  SE
                </span>
              </div>
              <div>
                <span
                  className="serif"
                  style={{
                    color: C.neutral,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    letterSpacing: ".02em",
                  }}
                >
                  StayEase
                </span>
                {role === "admin" && (
                  <div
                    className="sans"
                    style={{
                      color: C.secondary,
                      fontSize: ".6rem",
                      letterSpacing: ".15em",
                      textTransform: "uppercase",
                      lineHeight: 1,
                      marginTop: 2,
                    }}
                  >
                    Admin Portal
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            onClick={() => setCol(!col)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "none",
              color: C.secondary,
              cursor: "pointer",
              padding: 6,
              borderRadius: 8,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background .2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
            }
          >
            {col ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* User info */}
        {!col && (
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid rgba(197,160,89,.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg,${C.secondary},${C.tertiary})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  className="serif"
                  style={{
                    fontWeight: 700,
                    color: C.primary,
                    fontSize: "1rem",
                  }}
                >
                  {init}
                </span>
              </div>
              <div style={{ overflow: "hidden" }}>
                <div
                  className="sans"
                  style={{
                    color: C.neutral,
                    fontSize: ".9rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {name}
                </div>
                <div
                  className="sans"
                  style={{
                    color: C.secondary,
                    fontSize: ".65rem",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}
                >
                  {role === "admin" ? "Super Administrator" : "Gold Member"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav
          style={{
            padding: "20px 12px",
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {nav.map((item) => (
            <div
              key={item.id}
              className={`ni${tab === item.id ? " on" : ""}`}
              style={{
                justifyContent: col ? "center" : "flex-start",
                padding: col ? "12px" : "12px 16px",
                borderRadius: 12,
                transition: "all .2s",
                cursor: "pointer",
              }}
              onClick={() => setTab(item.id)}
            >
              <span
                style={{ flexShrink: 0, display: "flex", alignItems: "center" }}
              >
                {item.icon}
              </span>
              {!col && (
                <span
                  className="sans"
                  style={{
                    whiteSpace: "nowrap",
                    fontWeight: tab === item.id ? 600 : 400,
                    fontSize: ".95rem",
                    letterSpacing: ".02em",
                  }}
                >
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Sign out */}
        <div
          style={{
            padding: "16px 12px",
            borderTop: "1px solid rgba(197,160,89,.08)",
          }}
        >
          <div
            className="ni"
            style={{
              justifyContent: col ? "center" : "flex-start",
              color: "rgba(255,255,255,.4)",
              padding: col ? "12px" : "12px 16px",
              borderRadius: 12,
              cursor: "pointer",
            }}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = C.red;
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,.4)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span
              style={{ flexShrink: 0, display: "flex", alignItems: "center" }}
            >
              <LogOut size={18} />
            </span>
            {!col && (
              <span
                className="sans"
                style={{ fontWeight: 500, fontSize: ".95rem" }}
              >
                Sign Out
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          background: C.bg,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            padding: "0 32px",
            height: 76,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${C.grayL}`,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <span
            className="serif"
            style={{ color: C.primary, fontSize: "1.3rem", fontWeight: 600 }}
          >
            {nav.find((n) => n.id === tab)?.label}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Notification Bell is now active! */}
            <button
              onClick={handleNotification}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: C.gray,
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.gray)}
            >
              <Bell size={20} />
              {/* Only show the red dot if there is actually a pending booking! */}
              {bookings.some(
                (b) => String(b.status).toLowerCase() === "pending",
              ) && (
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 8,
                    height: 8,
                    background: C.red,
                    borderRadius: "50%",
                    border: "2px solid #fff",
                  }}
                />
              )}
            </button>

            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `linear-gradient(135deg,${C.secondary},${C.tertiary})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(10,29,55,.1)",
              }}
            >
              <span
                className="serif"
                style={{ fontWeight: 700, color: C.primary, fontSize: ".9rem" }}
              >
                {init}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "32px",
            flex: 1,
            maxWidth: 1400,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default Shell;
