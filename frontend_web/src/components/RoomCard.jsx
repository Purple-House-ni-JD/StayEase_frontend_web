import { C } from "../constants";

const RoomCard = ({ room, onBook }) => (
  <div
    className="lift"
    style={{
      background: C.neutral,
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(10,29,55,.08)",
    }}
  >
    <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
      <img
        src={room.img}
        alt={room.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform .5s",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.06)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      />
      {room.tag && (
        <span
          className="sans"
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: C.primary,
            color: C.secondary,
            fontSize: ".62rem",
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: 4,
          }}
        >
          {room.tag}
        </span>
      )}
    </div>

    <div style={{ padding: "18px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6,
        }}
      >
        <div>
          <div
            className="sans"
            style={{
              color: C.secondary,
              fontSize: ".68rem",
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 3,
            }}
          >
            {room.type}
          </div>
          <h3
            className="serif"
            style={{ color: C.primary, fontSize: "1.1rem", fontWeight: 600 }}
          >
            {room.name}
          </h3>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            className="serif"
            style={{ color: C.secondary, fontSize: "1.25rem", fontWeight: 700 }}
          >
            ₱{room.price.toLocaleString()}
          </div>
          <div className="sans" style={{ color: C.gray, fontSize: ".68rem" }}>
            /night
          </div>
        </div>
      </div>

      <div
        style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}
      >
        {room.features?.map((f) => (
          <span
            key={f}
            className="sans"
            style={{
              background: C.grayXL,
              color: C.gray,
              fontSize: ".68rem",
              padding: "3px 9px",
              borderRadius: 20,
            }}
          >
            {f}
          </span>
        ))}
      </div>

      <button
        className="btn-p"
        style={{ width: "100%", padding: "10px" }}
        onClick={() => onBook?.(room)}
      >
        Book Now
      </button>
    </div>
  </div>
);

export default RoomCard;
