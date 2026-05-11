// src/api/rooms.js
import { api } from "./client";

export const roomsService = {
  // GET /rooms/?category=deluxe&min_price=1000&check_in=...
  // params: { category, min_price, max_price, guests, is_featured, check_in, check_out, search, ordering }
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined,
      ),
    ).toString();
    return api.get(`/rooms/${query ? `?${query}` : ""}`);
  },

  // GET /rooms/featured/
  featured: () => api.get("/rooms/featured/"),

  // GET /rooms/categories/
  categories: () => api.get("/rooms/categories/"),

  // GET /rooms/{id}/
  get: (id) => api.get(`/rooms/${id}/`),

  // --- Admin only below ---

  // POST /rooms/
  create: (data) => api.post("/rooms/", data),

  // PATCH /rooms/{id}/
  update: (id, data) => api.patch(`/rooms/${id}/`, data),

  // DELETE /rooms/{id}/
  delete: (id) => api.delete(`/rooms/${id}/`),

  // POST /rooms/{id}/images/  (multipart — multiple files)
  uploadImages: (id, files) => {
    const form = new FormData();
    files.forEach((f) => form.append("images", f));
    return api.postForm(`/rooms/${id}/images/`, form);
  },

  // DELETE /rooms/{id}/images/remove/
  removeImage: (id, url) => api.delete(`/rooms/${id}/images/remove/`, { url }),

  // GET /amenities/
  getAmenities: () => api.get("/amenities/"),

  // GET /policies/
  getPolicies: () => api.get("/policies/"),
};
