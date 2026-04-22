import { useState } from "react";
import { C } from "../constants";
import { Logo } from "./UI";

const Shell = ({ nav, tab, setTab, children, setPage, name, role, init }) => {
  const [col, setCol] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      {/* Sidebar */}
      <aside
        style={{
          width: col ? 64 : 240,
          background: C.primary,
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          transition: "width .25s",
          overflow: "hidden",
          flexShrink: 0,
          zIndex: 20,
        }}
      >
        {/* Logo row */}
        <div
          style={{
            padding: "20px 16px",
            borderBottom: "1px solid rgba(197,160,89,.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 64,
          }}
        >
          {!col && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: `linear-gradient(135deg,${C.secondary},${C.tertiary})`,
                  borderRadius: 6,
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
                    fontSize: ".72rem",
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
                    fontSize: ".95rem",
                    fontWeight: 600,
                  }}
                >
                  StayEase
                </span>
                {role === "admin" && (
                  <div
                    className="sans"
                    style={{
                      color: C.secondary,
                      fontSize: ".55rem",
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      lineHeight: 1,
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
              background: "none",
              border: "none",
              color: C.secondary,
              cursor: "pointer",
              fontSize: "1rem",
              padding: 4,
              flexShrink: 0,
            }}
          >
            {col ? "▶" : "◀"}
          </button>
        </div>

        {/* User info */}
        {!col && (
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid rgba(197,160,89,.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
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
                    fontSize: ".85rem",
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
                    fontSize: ".82rem",
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
                    fontSize: ".6rem",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                  }}
                >
                  {role === "admin" ? "Super Administrator" : "Gold Member"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ padding: "12px 8px", flex: 1, overflowY: "auto" }}>
          {nav.map((item) => (
            <div
              key={item.id}
              className={`ni${tab === item.id ? " on" : ""}`}
              style={{ justifyContent: col ? "center" : "flex-start" }}
              onClick={() => setTab(item.id)}
            >
              <span style={{ fontSize: "1.05rem", flexShrink: 0 }}>
                {item.icon}
              </span>
              {!col && (
                <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Sign out */}
        <div
          style={{
            padding: "12px 8px",
            borderTop: "1px solid rgba(197,160,89,.08)",
          }}
        >
          <div
            className="ni"
            style={{
              justifyContent: col ? "center" : "flex-start",
              color: "rgba(255,255,255,.3)",
            }}
            onClick={() => setPage("landing")}
          >
            <span style={{ flexShrink: 0 }}>🚪</span>
            {!col && <span>Sign Out</span>}
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
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: C.neutral,
            padding: "0 32px",
            height: 60,
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
            style={{ color: C.primary, fontSize: "1.2rem", fontWeight: 600 }}
          >
            {nav.find((n) => n.id === tab)?.label}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{ fontSize: "1.1rem", cursor: "pointer", color: C.gray }}
            >
              🔔
            </span>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: `linear-gradient(135deg,${C.secondary},${C.tertiary})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="serif"
                style={{ fontWeight: 700, color: C.primary, fontSize: ".8rem" }}
              >
                {init}
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: "32px", flex: 1 }}>{children}</div>
      </main>
    </div>
  );
};

export default Shell;
