// src/api/auth.js
import { api } from "./client";
import { tokens } from "./tokens";

export const authService = {
  // POST /auth/register/
  // body: { email, username, first_name, last_name, phone_number, password, password2 }
  register: (data) => api.post("/auth/register/", data),

  // POST /auth/login/
  // body: { email, password }
  login: (email, password) => api.post("/auth/login/", { email, password }),

  // POST /auth/logout/
  logout: () => {
    const refresh = tokens.getRefresh();
    return api.post("/auth/logout/", { refresh }).finally(() => tokens.clear());
  },

  // POST /auth/token/refresh/
  refreshToken: () =>
    api.post("/auth/token/refresh/", { refresh: tokens.getRefresh() }),

  // GET /auth/me/
  me: () => api.get("/auth/me/"),

  // PATCH /auth/me/
  updateProfile: (data) => api.patch("/auth/me/", data),

  // PATCH /auth/me/avatar/  (multipart)
  uploadAvatar: (file) => {
    const form = new FormData();
    form.append("avatar", file);
    return api.patchForm("/auth/me/avatar/", form);
  },

  // POST /auth/oauth/google/
  googleLogin: (idToken) =>
    api.post("/auth/oauth/google/", { id_token: idToken }),

  // POST /auth/oauth/facebook/
  facebookLogin: (accessToken) =>
    api.post("/auth/oauth/facebook/", { access_token: accessToken }),
};
