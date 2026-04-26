// src/pages/Register.jsx  — replace your existing file with this
import { useState } from "react";
import { C } from "../constants";
import { GBar, Logo } from "../components/UI";
import { useAuth } from "../context/AuthContext";

const Register = ({ setPage }) => {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  // Step 1 fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // Step 2 fields
  const [phone, setPhone] = useState("");
  const [discountType, setDiscountType] = useState("none");
  const [nationality, setNationality] = useState("Filipino");

  const validateStep1 = () => {
    if (!fullName || !email || !password || !password2)
      return "Please fill in all fields.";
    if (password !== password2) return "Passwords do not match.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!agree) return "Please agree to the Terms of Service.";
    return null;
  };

  const go = async () => {
    setError("");

    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setError(err);
        return;
      }
      setStep(2);
      return;
    }

    // Step 2 — submit to backend
    setLoading(true);
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      await register({
        email,
        username: email.split("@")[0], // derive username from email
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        password,
        password2,
      });
      setPage("userDash");
    } catch (err) {
      // Django validation errors come as { field: ['message'] }
      const firstError =
        err?.email?.[0] ||
        err?.password?.[0] ||
        err?.username?.[0] ||
        err?.detail ||
        err?.non_field_errors?.[0] ||
        "Registration failed. Please try again.";
      setError(firstError);
    } finally {
      setLoading(false);
    }
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
              onClick={() => {
                if (step === 2) {
                  setStep(1);
                  setError("");
                }
              }}
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
              ? "Experience a world of luxury and personalized stays."
              : "Complete your profile to personalize your experience."}
          </p>

          {/* Error message */}
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

          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {step === 1 ? (
              <>
                <div>
                  <label className="lbl">Full Name</label>
                  <input
                    className="inp"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="lbl">Email Address</label>
                  <input
                    type="email"
                    className="inp"
                    placeholder="example@stayease.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="lbl">Password</label>
                  <input
                    type="password"
                    className="inp"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="lbl">Confirm Password</label>
                  <input
                    type="password"
                    className="inp"
                    placeholder="Re-enter password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
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
                  <input
                    className="inp"
                    placeholder="+63 9XX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="lbl">
                    Are you a PWD or Senior Citizen?
                  </label>
                  <select
                    className="inp"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <option value="none">No</option>
                    <option value="pwd">Yes — PWD (20% discount)</option>
                    <option value="senior">
                      Yes — Senior Citizen (20% discount)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="lbl">Nationality</label>
                  <select
                    className="inp"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                  >
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

          <p
            className="sans"
            style={{
              textAlign: "center",
              color: C.gray,
              fontSize: ".85rem",
              marginTop: 22,
            }}
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
