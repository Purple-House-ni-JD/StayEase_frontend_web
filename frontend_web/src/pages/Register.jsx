import { useState } from "react";
import { C } from "../constants";
import { GBar, Logo } from "../components/UI";

const Register = ({ setPage }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const go = () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPage("userDash");
    }, 1100);
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
          justifyContent: "center",
          padding: "48px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "1px solid rgba(197,160,89,.06)",
          }}
        />
        <div
          onClick={() => setPage("landing")}
          style={{ cursor: "pointer", position: "absolute", top: 40, left: 56 }}
        >
          <Logo />
        </div>
        <div style={{ marginTop: 80 }}>
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
            JOIN THE ELITE
          </div>
          <h2
            className="serif"
            style={{
              color: C.neutral,
              fontSize: "2.8rem",
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: 14,
            }}
          >
            Your Journey
            <br />
            <em style={{ color: C.tertiary }}>Starts Here</em>
          </h2>
          <GBar w={48} my={18} />
          <p
            className="sans"
            style={{
              color: "rgba(255,255,255,.5)",
              fontSize: ".88rem",
              lineHeight: 1.8,
              maxWidth: 340,
              marginBottom: 36,
            }}
          >
            Create your StayEase account and unlock a seamless booking
            experience with exclusive member perks.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "✓  Instant booking confirmation",
              "✓  PWD & Senior Citizen discounts (20%)",
              "✓  Real-time booking status",
              "✓  Exclusive member rates",
              "✓  Promo code access",
            ].map((b) => (
              <span
                key={b}
                className="sans"
                style={{ color: "rgba(255,255,255,.55)", fontSize: ".85rem" }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: 48,
            borderRadius: 12,
            overflow: "hidden",
            opacity: 0.38,
            height: 140,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=60"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
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
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 440 }} className="fi">
          {/* Step bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <span
              onClick={() => step === 2 && setStep(1)}
              style={{
                cursor: step === 2 ? "pointer" : "default",
                color: step === 2 ? C.primary : C.grayL,
                fontSize: "1.1rem",
                fontWeight: 300,
              }}
            >
              ←
            </span>
            <div style={{ flex: 1 }}>
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
                    color: C.secondary,
                    fontSize: ".68rem",
                    fontWeight: 700,
                    letterSpacing: ".1em",
                  }}
                >
                  STEP 0{step} OF 02
                </span>
                <span
                  className="sans"
                  style={{
                    color: C.gray,
                    fontSize: ".68rem",
                    fontWeight: 700,
                    letterSpacing: ".1em",
                  }}
                >
                  ACCOUNT DETAILS
                </span>
              </div>
              <div style={{ height: 3, background: C.grayL, borderRadius: 3 }}>
                <div
                  style={{
                    height: "100%",
                    width: `${step * 50}%`,
                    background: `linear-gradient(90deg,${C.secondary},${C.tertiary})`,
                    borderRadius: 3,
                    transition: "width .4s ease",
                  }}
                />
              </div>
            </div>
          </div>

          <h3
            className="serif"
            style={{
              color: C.primary,
              fontSize: "1.9rem",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            {step === 1 ? "Create an Account" : "Personal Details"}
          </h3>
          <p
            className="sans"
            style={{
              color: C.gray,
              fontSize: ".83rem",
              marginBottom: 26,
              lineHeight: 1.6,
            }}
          >
            {step === 1
              ? "Experience a world of luxury and personalized stays. Join the StayEase elite."
              : "Complete your profile to personalize your experience."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {step === 1 ? (
              <>
                <div>
                  <label className="lbl">Full Name</label>
                  <input className="inp" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="lbl">Email Address</label>
                  <input
                    type="email"
                    className="inp"
                    placeholder="example@stayease.com"
                  />
                </div>
                <div>
                  <label className="lbl">Password</label>
                  <input
                    type="password"
                    className="inp"
                    placeholder="•••••••"
                  />
                </div>
                <div>
                  <label className="lbl">Confirm Password</label>
                  <input
                    type="password"
                    className="inp"
                    placeholder="•••••••"
                  />
                </div>
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                >
                  <input
                    type="checkbox"
                    id="terms"
                    style={{
                      accentColor: C.secondary,
                      marginTop: 3,
                      flexShrink: 0,
                    }}
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <label
                    htmlFor="terms"
                    className="sans"
                    style={{
                      color: C.gray,
                      fontSize: ".8rem",
                      lineHeight: 1.6,
                    }}
                  >
                    By creating an account, you agree to our{" "}
                    <span style={{ color: C.secondary }}>Terms of Service</span>{" "}
                    and{" "}
                    <span style={{ color: C.secondary }}>Privacy Policy</span>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="lbl">Phone Number</label>
                  <input className="inp" placeholder="+63 9XX XXX XXXX" />
                </div>
                <div>
                  <label className="lbl">
                    Are you a PWD or Senior Citizen?
                  </label>
                  <select className="inp">
                    <option>No</option>
                    <option>Yes — PWD (20% discount)</option>
                    <option>Yes — Senior Citizen (20% discount)</option>
                  </select>
                </div>
                <div>
                  <label className="lbl">Nationality</label>
                  <select className="inp">
                    <option>Filipino</option>
                    <option>Other</option>
                  </select>
                </div>
              </>
            )}

            <button
              className="btn-p"
              style={{
                padding: "14px",
                width: "100%",
                marginTop: 4,
                fontSize: ".85rem",
              }}
              onClick={go}
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : step === 1
                  ? "Continue →"
                  : "Complete Registration →"}
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
              OR REGISTER WITH
            </span>
            <div style={{ flex: 1, height: 1, background: C.grayL }} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 22,
            }}
          >
            {[
              ["■", "Apple"],
              ["ios", "iOS"],
            ].map(([ic, nm]) => (
              <button
                key={nm}
                style={{
                  padding: "11px",
                  border: `1.5px solid ${C.grayL}`,
                  background: C.neutral,
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "DM Sans,sans-serif",
                  fontSize: ".82rem",
                  color: C.primary,
                }}
              >
                {ic} {nm}
              </button>
            ))}
          </div>

          <p
            className="sans"
            style={{ textAlign: "center", color: C.gray, fontSize: ".85rem" }}
          >
            Already have an account?{" "}
            <span
              className="ul"
              style={{ color: C.secondary, fontWeight: 700, cursor: "pointer" }}
              onClick={() => setPage("login")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
