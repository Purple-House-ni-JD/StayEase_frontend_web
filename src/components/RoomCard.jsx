import { Plus, Check } from "lucide-react";
import { C } from "../constants";

const RoomCard = ({ room, onBook, inCart, onToggleCart }) => {
  let imageUrl =
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80";
  if (room.image_urls && room.image_urls.length > 0)
    imageUrl = room.image_urls[0].image_url || room.image_urls[0];
  else if (room.img) imageUrl = room.img;

  return (
    <div
      className="lift"
      style={{
        background: C.neutral,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(10,29,55,.08)",
        position: "relative",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={() => onBook?.(room)}
    >
      {/* Cart toggle button */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          background: inCart ? C.primary : "rgba(255,255,255,0.9)",
          borderRadius: "50%",
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.2s",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleCart?.(room);
        }}
      >
        <div
          style={{ color: inCart ? C.secondary : C.primary, display: "flex" }}
        >
          {inCart ? (
            <Check size={18} strokeWidth={3} />
          ) : (
            <Plus size={20} strokeWidth={2.5} />
          )}
        </div>
      </div>

      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img
          src={imageUrl}
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
        <div style={{ position: "absolute", bottom: 12, left: 14 }}>
          <span
            className="sans"
            style={{
              background: "rgba(10,29,55,.8)",
              color: C.secondary,
              fontSize: ".62rem",
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: 4,
            }}
          >
            {room.category || room.type || "Standard"}
          </span>
        </div>
      </div>

      <div
        style={{
          padding: "18px 20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4
          className="serif"
          style={{
            color: C.primary,
            fontSize: "1.1rem",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          {room.name}
        </h4>
        <p
          className="sans"
          style={{
            color: C.gray,
            fontSize: ".8rem",
            marginBottom: 14,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {room.description || "A beautiful room for your perfect stay."}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 2,
            marginTop: "auto",
          }}
        >
          <span
            className="serif"
            style={{ color: C.primary, fontSize: "1.2rem", fontWeight: 700 }}
          >
            ₱
            {parseFloat(
              room.price_per_night || room.price || 0,
            ).toLocaleString()}
          </span>
          <span className="sans" style={{ color: C.gray, fontSize: ".7rem" }}>
            /night
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
