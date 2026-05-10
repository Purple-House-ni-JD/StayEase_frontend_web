// src/api/client.js
const BASE_URL = "https://stayease-backend-vl07.onrender.com/api/v1";

const getHeaders = (isMultipart = false) => {
  const headers = {};
  const token = localStorage.getItem("access_token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isMultipart) headers["Content-Type"] = "application/json";
  return headers;
};

const handleResponse = async (res) => {
  if (res.status === 204) return null; // No content
  const data = await res.json();
  if (!res.ok) throw data; // Throw error body for callers to catch
  return data;
};

export const api = {
  get: (path) =>
    fetch(`${BASE_URL}${path}`, { headers: getHeaders() }).then(handleResponse),

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  patch: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path) =>
    fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(handleResponse),

  // For file uploads (avatar, room images)
  postForm: (path, formData) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    }).then(handleResponse),

  patchForm: (path, formData) =>
    fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: getHeaders(true),
      body: formData,
    }).then(handleResponse),
};
