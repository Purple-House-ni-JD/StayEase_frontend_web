import { C } from "../constants";

// Logo
export const Logo = ({ dark = false, sm = false }) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
  >
    <div
      style={{
        width: sm ? 26 : 30,
        height: sm ? 26 : 30,
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
          fontSize: sm ? ".68rem" : ".78rem",
          color: C.primary,
        }}
      >
        SE
      </span>
    </div>
    <span
      className="serif"
      style={{
        color: dark ? C.primary : C.neutral,
        fontSize: sm ? "1rem" : "1.2rem",
        fontWeight: 600,
        letterSpacing: ".04em",
      }}
    >
      StayEase
    </span>
  </div>
);

// Gold gradient bar
export const GBar = ({ w = 40, my = 16 }) => (
  <div
    style={{
      width: w,
      height: 2,
      background: `linear-gradient(90deg,${C.secondary},${C.tertiary})`,
      margin: `${my}px 0`,
    }}
  />
);

// Status badge
export const Badge = ({ s }) => {
  const m = {
    confirmed: "b-c",
    pending: "b-p",
    cancelled: "b-x",
    active: "b-a",
    paid: "b-g",
  };
  return <span className={`bdg ${m[s] || "b-p"}`}>{s}</span>;
};

// Form field wrapper
export const Field = ({
  label,
  type = "text",
  ph,
  dark = false,
  defaultValue,
  children,
}) => (
  <div>
    <label
      className="lbl"
      style={{ color: dark ? "rgba(255,255,255,.45)" : C.gray }}
    >
      {label}
    </label>
    {children || (
      <input
        type={type}
        className={dark ? "inp-d" : "inp"}
        placeholder={ph}
        defaultValue={defaultValue || ""}
      />
    )}
  </div>
);
