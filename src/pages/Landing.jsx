import { useState } from "react";
import { C } from "../constants";
import { ROOMS, AMENITIES } from "../data";
import { GBar, Logo } from "../components/UI";
import TopNav from "../components/TopNav";
import RoomCard from "../components/RoomCard";

const Landing = ({ setPage }) => {
  return (
    <div style={{ background: C.bg }}>
      <TopNav setPage={setPage} />

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: 700,
          overflow: "hidden",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=90"
          alt="hero"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div className="hero-ov" />

        {/* Hero copy */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 80px 96px",
          }}
        >
          <div className="fi">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div className="gbar" style={{ margin: 0 }} />
              <span
                className="sans"
                style={{
                  color: C.tertiary,
                  fontSize: ".7rem",
                  fontWeight: 700,
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                }}
              >
                Premium Accommodation · CDO
              </span>
            </div>
            <h1
              className="serif"
              style={{
                color: C.neutral,
                fontSize: "clamp(3rem,6vw,5.5rem)",
                lineHeight: 1.08,
                fontWeight: 600,
                maxWidth: 700,
                marginBottom: 18,
              }}
            >
              Experience
              <br />
              <em style={{ color: C.tertiary }}>Unparalleled</em> Luxury
            </h1>
            <p
              className="sans"
              style={{
                color: "rgba(255,255,255,.65)",
                fontSize: "1rem",
                lineHeight: 1.75,
                maxWidth: 460,
                marginBottom: 40,
              }}
            >
              Discover a curated selection of the world's most prestigious
              residences, tailored to your exquisite taste.
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn-g"
                style={{ fontSize: ".9rem", padding: "15px 44px" }}
                onClick={() => setPage("register")}
              >
                Get Started →
              </button>
              <span
                className="sans ul"
                style={{ color: "rgba(255,255,255,.7)", fontSize: ".88rem" }}
                onClick={() => setPage("login")}
              >
                Already have an account?{" "}
                <span style={{ color: C.tertiary, fontWeight: 600 }}>
                  Log In
                </span>
              </span>
            </div>
          </div>

          {/* Social proof */}
          <div
            style={{
              marginTop: 44,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ display: "flex" }}>
              {[
                "photo-1534528741775-53994a69daeb",
                "photo-1506794778202-cad84cf45f1d",
                "photo-1517841905240-472988babdf9",
              ].map((u, i) => (
                <img
                  key={i}
                  src={`https://images.unsplash.com/${u}?w=60&q=80`}
                  alt=""
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: `2px solid ${C.secondary}`,
                    marginLeft: i ? -8 : 0,
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
            <div>
              <div style={{ color: C.secondary, fontSize: ".8rem" }}>★★★★★</div>
              <div
                className="sans"
                style={{
                  color: "rgba(255,255,255,.45)",
                  fontSize: ".65rem",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                2k+ Premium Club Reviews
              </div>
            </div>
          </div>
        </div>

        {/* Booking widget */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 80,
            transform: "translateY(-50%)",
            zIndex: 5,
            background: "rgba(10,29,55,.9)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(197,160,89,.2)",
            borderRadius: 16,
            padding: "28px 32px",
            width: 300,
          }}
        >
          <h3
            className="serif"
            style={{
              color: C.neutral,
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Check Availability
          </h3>
          <GBar w={36} my={12} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["Check-in", "date"],
              ["Check-out", "date"],
            ].map(([l, t]) => (
              <div key={l}>
                <label
                  className="lbl"
                  style={{ color: "rgba(255,255,255,.45)" }}
                >
                  {l}
                </label>
                <input type={t} className="inp-d" />
              </div>
            ))}
            <div>
              <label className="lbl" style={{ color: "rgba(255,255,255,.45)" }}>
                Room Type
              </label>
              <select
                className="inp-d"
                style={{
                  color: "rgba(255,255,255,.7)",
                  background: "rgba(255,255,255,.06)",
                }}
              >
                <option value="">Any Type</option>
                {["Standard", "Deluxe", "Suite", "Villa", "Family"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl" style={{ color: "rgba(255,255,255,.45)" }}>
                Guests
              </label>
              <select
                className="inp-d"
                style={{
                  color: "rgba(255,255,255,.7)",
                  background: "rgba(255,255,255,.06)",
                }}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n}>
                    {n} Guest{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn-g"
              style={{ marginTop: 6, padding: "13px" }}
              onClick={() => setPage("register")}
            >
              Search Rooms
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURED ROOMS ── */}
      <section style={{ padding: "100px 80px", background: C.neutral }}>
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div className="gbar" style={{ margin: 0 }} />
            <span
              className="sans"
              style={{
                color: C.secondary,
                fontSize: ".68rem",
                fontWeight: 700,
                letterSpacing: ".18em",
                textTransform: "uppercase",
              }}
            >
              Our Accommodations
            </span>
          </div>
          <h2
            className="serif"
            style={{
              color: C.primary,
              fontSize: "clamp(1.8rem,3vw,2.6rem)",
              fontWeight: 600,
            }}
          >
            Featured Rooms & Suites
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
            gap: 28,
          }}
        >
          {ROOMS.slice(0, 3).map((r) => (
            <RoomCard key={r.id} room={r} onBook={() => setPage("register")} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button className="btn-o" onClick={() => setPage("register")}>
            View All Rooms
          </button>
        </div>
      </section>

      {/* ── AMENITIES ── */}
      <section
        style={{
          padding: "100px 80px",
          background: C.primary,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: -120,
            transform: "translateY(-50%)",
            width: 480,
            height: 480,
            borderRadius: "50%",
            border: "1px solid rgba(197,160,89,.07)",
            pointerEvents: "none",
          }}
        />
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div className="gbar" style={{ margin: 0 }} />
            <span
              className="sans"
              style={{
                color: C.secondary,
                fontSize: ".68rem",
                fontWeight: 700,
                letterSpacing: ".18em",
                textTransform: "uppercase",
              }}
            >
              World-Class Facilities
            </span>
          </div>
          <h2
            className="serif"
            style={{
              color: C.neutral,
              fontSize: "clamp(1.8rem,3vw,2.6rem)",
              fontWeight: 600,
            }}
          >
            Hotel <em style={{ color: C.tertiary }}>Amenities</em>
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
            gap: 20,
          }}
        >
          {AMENITIES.map((a) => (
            <div
              key={a.l}
              className="lift"
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(197,160,89,.12)",
                borderRadius: 12,
                padding: "28px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>{a.i}</div>
              <div
                className="sans"
                style={{ color: "rgba(255,255,255,.75)", fontSize: ".85rem" }}
              >
                {a.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        style={{
          background: `linear-gradient(135deg,${C.secondary},${C.tertiary})`,
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 40,
            textAlign: "center",
          }}
        >
          {[
            ["250+", "Rooms Available"],
            ["4.9★", "Guest Rating"],
            ["12K+", "Happy Guests"],
            ["15+", "Years of Excellence"],
          ].map(([v, l]) => (
            <div key={l}>
              <div
                className="serif"
                style={{
                  color: C.primary,
                  fontSize: "2.8rem",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {v}
              </div>
              <div
                className="sans"
                style={{
                  color: "rgba(10,29,55,.65)",
                  fontSize: ".78rem",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  marginTop: 6,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{ padding: "100px 80px", textAlign: "center", background: C.bg }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div className="gbar" style={{ margin: 0 }} />
          <span
            className="sans"
            style={{
              color: C.secondary,
              fontSize: ".68rem",
              fontWeight: 700,
              letterSpacing: ".18em",
              textTransform: "uppercase",
            }}
          >
            Book Direct & Save
          </span>
          <div className="gbar" style={{ margin: 0 }} />
        </div>
        <h2
          className="serif"
          style={{
            color: C.primary,
            fontSize: "clamp(1.8rem,3vw,2.6rem)",
            fontWeight: 600,
            marginBottom: 14,
          }}
        >
          Ready for Your <em style={{ color: C.secondary }}>Luxury Stay?</em>
        </h2>
        <p
          className="sans"
          style={{ color: C.gray, marginBottom: 36, fontSize: ".95rem" }}
        >
          Book directly with us and save up to 20% versus third-party platforms.
        </p>
        <button
          className="btn-g"
          style={{ padding: "15px 48px", fontSize: ".9rem" }}
          onClick={() => setPage("register")}
        >
          Reserve a Room
        </button>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: C.primary,
          padding: "32px 80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(197,160,89,.1)",
        }}
      >
        <Logo />
        <span
          className="sans"
          style={{ color: "rgba(255,255,255,.3)", fontSize: ".75rem" }}
        >
          © 2026 StayEase Luxury Group · Cagayan de Oro, Philippines
        </span>
      </footer>
    </div>
  );
};

export default Landing;
