// src/api/reviews.js
import { api } from "./client";

export const reviewsService = {
  // GET /reviews/?room=1&ordering=-created_at
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined,
      ),
    ).toString();
    return api.get(`/reviews/${query ? `?${query}` : ""}`);
  },

  // POST /reviews/
  // body: { room, booking, rating (1-5), comment }
  // NOTE: booking must be status='completed' first
  create: (data) => api.post("/reviews/", data),

  // PATCH /reviews/{id}/  — owner only
  update: (id, data) => api.patch(`/reviews/${id}/`, data),

  // DELETE /reviews/{id}/  — owner only
  delete: (id) => api.delete(`/reviews/${id}/`),
};
