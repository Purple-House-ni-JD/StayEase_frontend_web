import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  MapPin,
  Search,
  Wifi,
  Coffee,
  Dumbbell,
  Car,
  ShieldCheck,
  Tv,
  Star,
  Award,
  Heart,
  Key,
} from "lucide-react";
import { C } from "../constants";
import { ROOMS } from "../data"; // Kept as a safe fallback!
import { GBar, Logo } from "../components/UI";
import TopNav from "../components/TopNav";
import RoomCard from "../components/RoomCard";
import { roomsService } from "../api/rooms";

const Landing = ({ setPage }) => {
  const [dynamicRooms, setDynamicRooms] = useState([]);

  // NEW: Make the landing page dynamic! Pull the actual rooms from the Django DB.
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const fetchFunc = roomsService.list
          ? roomsService.list
          : roomsService.getRooms;
        const res = await fetchFunc();
        const allRooms = Array.isArray(res) ? res : res?.results || [];
        // Only grab the first 3 for the "Featured" section
        if (allRooms.length > 0) {
          setDynamicRooms(allRooms.slice(0, 3));
        }
      } catch (e) {
        console.error(
          "Failed to load dynamic rooms on landing, falling back to mock data.",
        );
      }
    };
    loadRooms();
  }, []);

  // Use DB rooms if available, otherwise safely fall back to static data
  const displayRooms =
    dynamicRooms.length > 0 ? dynamicRooms : ROOMS.slice(0, 3);

  // NEW: Premium Lucide Icons for Amenities
  const LUXURY_AMENITIES = [
    {
      l: "High-Speed WiFi",
      i: <Wifi size={32} strokeWidth={1.5} color={C.secondary} />,
    },
    {
      l: "Premium Dining",
      i: <Coffee size={32} strokeWidth={1.5} color={C.secondary} />,
    },
    {
      l: "Fitness Center",
      i: <Dumbbell size={32} strokeWidth={1.5} color={C.secondary} />,
    },
    {
      l: "Secure Valet",
      i: <Car size={32} strokeWidth={1.5} color={C.secondary} />,
    },
    {
      l: "24/7 Security",
      i: <ShieldCheck size={32} strokeWidth={1.5} color={C.secondary} />,
    },
    {
      l: "Smart Rooms",
      i: <Tv size={32} strokeWidth={1.5} color={C.secondary} />,
    },
  ];

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
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <MapPin size={12} /> Premium Accommodation · CDO
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
                style={{
                  color: "rgba(255,255,255,.7)",
                  fontSize: ".88rem",
                  cursor: "pointer",
                }}
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
              <div
                style={{
                  color: C.secondary,
                  fontSize: ".8rem",
                  display: "flex",
                  gap: 2,
                }}
              >
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
              </div>
              <div
                className="sans"
                style={{
                  color: "rgba(255,255,255,.45)",
                  fontSize: ".65rem",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  marginTop: 2,
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
            {/* Check In */}
            <div>
              <label className="lbl" style={{ color: "rgba(255,255,255,.45)" }}>
                Check-in
              </label>
              <div style={{ position: "relative" }}>
                <Calendar
                  size={16}
                  color="rgba(255,255,255,.5)"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="date"
                  className="inp-d"
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>
            {/* Check Out */}
            <div>
              <label className="lbl" style={{ color: "rgba(255,255,255,.45)" }}>
                Check-out
              </label>
              <div style={{ position: "relative" }}>
                <Calendar
                  size={16}
                  color="rgba(255,255,255,.5)"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="date"
                  className="inp-d"
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="lbl" style={{ color: "rgba(255,255,255,.45)" }}>
                Guests
              </label>
              <div style={{ position: "relative" }}>
                <Users
                  size={16}
                  color="rgba(255,255,255,.5)"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <select
                  className="inp-d"
                  style={{
                    color: "rgba(255,255,255,.7)",
                    background: "rgba(255,255,255,.06)",
                    paddingLeft: 38,
                  }}
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} style={{ color: C.primary }}>
                      {n} Guest{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              className="btn-g"
              style={{
                marginTop: 6,
                padding: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onClick={() => setPage("register")}
            >
              <Search size={16} /> Search Rooms
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
          {displayRooms.map((r) => (
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
          {LUXURY_AMENITIES.map((a) => (
            <div
              key={a.l}
              className="lift"
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(197,160,89,.12)",
                borderRadius: 12,
                padding: "28px 20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ marginBottom: 16 }}>{a.i}</div>
              <div
                className="sans"
                style={{
                  color: "rgba(255,255,255,.8)",
                  fontSize: ".85rem",
                  fontWeight: 500,
                  letterSpacing: ".02em",
                }}
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
            ["250+", "Rooms Available", <Key size={24} color={C.primary} />],
            ["4.9★", "Guest Rating", <Star size={24} color={C.primary} />],
            ["12K+", "Happy Guests", <Heart size={24} color={C.primary} />],
            [
              "15+",
              "Years of Excellence",
              <Award size={24} color={C.primary} />,
            ],
          ].map(([v, l, icon]) => (
            <div
              key={l}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ marginBottom: 12, opacity: 0.8 }}>{icon}</div>
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
                  marginTop: 8,
                  fontWeight: 600,
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
