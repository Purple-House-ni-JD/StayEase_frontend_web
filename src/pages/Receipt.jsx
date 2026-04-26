import { Check } from "lucide-react";
import { C } from "../constants";

const Receipt = ({ setPage, data }) => {
  // If the user manually navigates to /receipt without buying anything, send them back
  if (!data) {
    return (
      <div
        style={{
          padding: 100,
          textAlign: "center",
          minHeight: "100vh",
          background: C.background || "#F5F3EF",
        }}
      >
        <p className="sans" style={{ color: C.gray, marginBottom: 20 }}>
          No active receipt found.
        </p>
        <button className="btn-p" onClick={() => setPage("userDash")}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.background || "#F5F3EF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="lift"
        style={{
          background: C.neutral,
          borderRadius: 24,
          width: "100%",
          maxWidth: 480,
          padding: 40,
          boxShadow: "0 20px 40px rgba(10,29,55,.08)",
          border: `1px solid ${C.grayL}`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#DCFCE7",
            color: "#166534",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <Check size={40} strokeWidth={3} />
        </div>

        <h2
          className="serif"
          style={{
            color: C.primary,
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Booking Confirmed!
        </h2>
        <p
          className="sans"
          style={{ color: C.gray, fontSize: ".95rem", marginBottom: 32 }}
        >
          Your payment was successful and your stay is secured.
        </p>

        <div
          style={{
            background: C.grayXL,
            borderRadius: 16,
            padding: 24,
            textAlign: "left",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: `1px dashed ${C.gray}`,
              paddingBottom: 16,
              marginBottom: 16,
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
                {data.ref}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
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
                Amount Paid
              </div>
              <div
                className="serif"
                style={{
                  color: C.secondary,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                }}
              >
                ₱{data.total.toLocaleString()}
              </div>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
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
                Check-In
              </div>
              <div
                className="sans"
                style={{ color: C.primary, fontSize: ".9rem", fontWeight: 600 }}
              >
                {data.checkIn}
              </div>
            </div>
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
                Check-Out
              </div>
              <div
                className="sans"
                style={{ color: C.primary, fontSize: ".9rem", fontWeight: 600 }}
              >
                {data.checkOut}
              </div>
            </div>
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
                Duration
              </div>
              <div
                className="sans"
                style={{ color: C.primary, fontSize: ".9rem", fontWeight: 600 }}
              >
                {data.nights} Nights
              </div>
            </div>
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
                Guests
              </div>
              <div
                className="sans"
                style={{ color: C.primary, fontSize: ".9rem", fontWeight: 600 }}
              >
                {data.guests} Guests
              </div>
            </div>
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
          onClick={() => setPage("userDash")}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Receipt;
