// src/api/wishlist.js
import { api } from "./client";

export const wishlistService = {
  // GET /wishlist/
  list: () => api.get("/wishlist/"),

  // POST /wishlist/
  // body: { room_id: 3 }
  add: (roomId) => api.post("/wishlist/", { room_id: roomId }),

  // DELETE /wishlist/{room_id}/
  remove: (roomId) => api.delete(`/wishlist/${roomId}/`),
};
