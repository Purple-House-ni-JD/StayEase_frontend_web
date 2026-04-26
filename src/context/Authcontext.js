// src/api/reports.js
import { api } from "./client";

export const reportsService = {
  // GET /reports/dashboard/
  dashboard: () => api.get("/reports/dashboard/"),

  // GET /reports/revenue/?period=monthly&year=2026
  // period: 'daily' | 'weekly' | 'monthly'
  revenue: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined,
      ),
    ).toString();
    return api.get(`/reports/revenue/${query ? `?${query}` : ""}`);
  },

  // GET /reports/occupancy/?period=monthly
  occupancy: (period = "monthly") =>
    api.get(`/reports/occupancy/?period=${period}`),

  // GET /reports/top-rooms/?order_by=revenue&limit=5
  topRooms: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined,
      ),
    ).toString();
    return api.get(`/reports/top-rooms/${query ? `?${query}` : ""}`);
  },
};
