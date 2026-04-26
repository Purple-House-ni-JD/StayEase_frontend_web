import { useNavigate } from "react-router-dom";
import { C } from "../constants";
import { Logo } from "./UI";

const TopNav = () => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        background: "rgba(10,29,55,.97)",
        padding: "0 60px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(197,160,89,.15)",
      }}
    >
      <div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        <Logo />
      </div>

      <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {["Rooms", "Amenities", "About", "Contact"].map((l) => (
          <span
            key={l}
            className="ul sans"
            style={{
              color: "rgba(255,255,255,.6)",
              fontSize: ".82rem",
              letterSpacing: ".06em",
              cursor: "pointer",
            }}
          >
            {l}
          </span>
        ))}
      </nav>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          className="btn-og"
          style={{ padding: "8px 22px" }}
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
        <button
          className="btn-g"
          style={{ padding: "8px 22px" }}
          onClick={() => navigate("/register")}
        >
          Get Started
        </button>
      </div>
    </header>
  );
};

export default TopNav;
