import { useState } from "react";
import { C } from "../constants";
import { GBar, Logo } from "../components/UI";
import { useAuth } from "../context/AuthContext";

const Login = ({ setPage }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const go = async () => {
    if (!email || !pw) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const user = await login(email, pw);
      // Automatically routes based on actual database role, no toggle needed
      const isAdmin = user.is_staff || user.is_superuser;
      setPage(isAdmin ? "adminDash" : "userDash");
    } catch (err) {
      const msg =
        err?.detail ||
        err?.non_field_errors?.[0] ||
        "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") go();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          background: C.primary,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "1px solid rgba(197,160,89,.07)",
          }}
        />
        <div onClick={() => setPage("landing")} style={{ cursor: "pointer" }}>
          <Logo />
        </div>
        <div>
          <div
            className="sans"
            style={{
              color: C.secondary,
              fontSize: ".68rem",
              fontWeight: 700,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            STAYEASE
          </div>
          <h2
            className="serif"
            style={{
              color: C.neutral,
              fontSize: "2.8rem",
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: 10,
            }}
          >
            Welcome
            <br />
            <em style={{ color: C.tertiary }}>Back</em>
          </h2>
          <GBar w={48} my={18} />
          <p
            className="sans"
            style={{
              color: "rgba(255,255,255,.5)",
              fontSize: ".88rem",
              lineHeight: 1.8,
              maxWidth: 320,
              marginBottom: 44,
            }}
          >
            THE ART OF LUXURY LIVING. Sign in to manage your reservations and
            access exclusive member benefits.
          </p>
          <div
            style={{
              background: "rgba(197,160,89,.08)",
              borderLeft: `2px solid ${C.secondary}`,
              padding: "18px 22px",
              borderRadius: "0 8px 8px 0",
              maxWidth: 340,
            }}
          >
            <p
              className="sans"
              style={{
                color: "rgba(255,255,255,.5)",
                fontSize: ".82rem",
                fontStyle: "italic",
                lineHeight: 1.7,
              }}
            >
              "Exceptional service, stunning rooms, and an unforgettable
              experience every single time."
            </p>
            <p
              className="sans"
              style={{
                color: C.secondary,
                fontSize: ".72rem",
                marginTop: 10,
                fontWeight: 600,
              }}
            >
              — Maria Santos, Gold Member
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            "photo-1631049307264-da0ec9d70304",
            "photo-1590490360182-c33d57733427",
          ].map((u, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 80,
                borderRadius: 8,
                overflow: "hidden",
                opacity: 0.45,
              }}
            >
              <img
                src={`https://images.unsplash.com/${u}?w=200&q=60`}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          background: "#F8F7F4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }} className="fi">
          <h3
            className="serif"
            style={{
              color: C.primary,
              fontSize: "1.9rem",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Sign In
          </h3>
          <p
            className="sans"
            style={{ color: C.gray, fontSize: ".85rem", marginBottom: 30 }}
          >
            Enter your credentials to continue
          </p>

          {error && (
            <div
              className="sans"
              style={{
                background: "#FEE2E2",
                color: "#991B1B",
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: ".82rem",
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 17 }}>
            <div>
              <label className="lbl">Email Address</label>
              <input
                type="email"
                className="inp"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <label className="lbl">Password</label>
              </div>
              <input
                type="password"
                className="inp"
                placeholder="••••••••"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              className="btn-p"
              style={{ width: "100%", padding: "14px", fontSize: ".85rem" }}
              onClick={go}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Log In →"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "22px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: C.grayL }} />
            <span
              className="sans"
              style={{
                color: C.gray,
                fontSize: ".72rem",
                letterSpacing: ".06em",
              }}
            >
              OR CONTINUE WITH
            </span>
            <div style={{ flex: 1, height: 1, background: C.grayL }} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 26,
            }}
          >
            {[
              ["G", "Google", "#4285F4"],
              ["f", "Facebook", "#1877F2"],
            ].map(([ic, nm, cl]) => (
              <button
                key={nm}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px",
                  border: `1.5px solid ${C.grayL}`,
                  background: C.neutral,
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "DM Sans,sans-serif",
                  fontSize: ".82rem",
                  fontWeight: 500,
                  color: C.primary,
                }}
              >
                <span style={{ color: cl, fontWeight: 700 }}>{ic}</span>
                {nm}
              </button>
            ))}
          </div>

          <p
            className="sans"
            style={{ textAlign: "center", color: C.gray, fontSize: ".85rem" }}
          >
            Don't have an account?{" "}
            <span
              className="ul"
              style={{ color: C.secondary, fontWeight: 700, cursor: "pointer" }}
              onClick={() => setPage("register")}
            >
              Sign Up
            </span>
          </p>

          {/* Back to Landing Page Option */}
          <p
            className="sans"
            style={{
              textAlign: "center",
              color: C.gray,
              fontSize: ".78rem",
              marginTop: 15,
              cursor: "pointer",
            }}
            onClick={() => setPage("landing")}
          >
            ← Back to Home
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
