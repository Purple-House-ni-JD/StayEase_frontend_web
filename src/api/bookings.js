// src/api/bookings.js
import { api } from "./client";

export const bookingsService = {
  // POST /bookings/create/
  // body: { room_ids: [1], check_in, check_out, guest_count, payment_method }
  // payment_method: 'card' | 'gcash' | 'maya' | 'cash'
  create: (data) => api.post("/bookings/create/", data),

  // GET /bookings/my/  — guest's own bookings
  myBookings: () => api.get("/bookings/my/"),

  // GET /bookings/{id}/
  get: (id) => api.get(`/bookings/${id}/`),

  // POST /bookings/{id}/cancel/  — guest self-cancel
  cancel: (id) => api.post(`/bookings/${id}/cancel/`, {}),

  // --- Admin only below ---

  // GET /bookings/?status=pending&search=SE-2026
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined,
      ),
    ).toString();
    return api.get(`/bookings/${query ? `?${query}` : ""}`);
  },

  // PATCH /bookings/{id}/status/
  // body: { status: 'confirmed' | 'cancelled' | 'completed' }
  updateStatus: (id, status) =>
    api.patch(`/bookings/${id}/status/`, { status }),
};
