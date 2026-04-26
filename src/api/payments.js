// src/api/payments.js
import { api } from "./client";

export const paymentsService = {
  // GET /payments/{booking_id}/
  get: (bookingId) => api.get(`/payments/${bookingId}/`),

  // PATCH /payments/{booking_id}/update/  — admin only
  // body: { status: 'paid'|'refunded'|'failed', transaction_ref, paid_at }
  update: (bookingId, data) =>
    api.patch(`/payments/${bookingId}/update/`, data),
};
