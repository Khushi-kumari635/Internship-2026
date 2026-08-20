// js/api.js
// A small helper module that centralizes all calls to our backend API.
// Every other JS file uses these functions instead of writing fetch()
// calls everywhere — this keeps the code clean and reusable.

// Since the frontend is served BY the same Express server (see server.js),
// we can use a relative path "/api" here. If you run the frontend
// separately, change this to "http://localhost:5000/api".
const API_BASE_URL = "/api";

// Get the saved JWT token from localStorage (set after login/register)
function getToken() {
  return localStorage.getItem("token");
}

// Get the saved logged-in user object from localStorage
function getCurrentUser() {
  const userJson = localStorage.getItem("user");
  return userJson ? JSON.parse(userJson) : null;
}

// Save login session details to localStorage
function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Clear the session (used on logout)
function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Core function that all API calls go through.
// method: "GET", "POST", "PUT", "DELETE"
// endpoint: e.g. "/jobs" or "/auth/login"
// body: JS object to send as JSON (optional)
// authRequired: whether to attach the JWT token (default true)
async function apiRequest(method, endpoint, body = null, authRequired = true) {
  const headers = { "Content-Type": "application/json" };

  if (authRequired) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  // Try to parse JSON response (even for errors, our backend sends JSON)
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = {};
  }

  if (!response.ok) {
    // Throw an error with the backend's message so calling code can catch it
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
}

// Convenience wrapper functions
const api = {
  get: (endpoint, authRequired = false) => apiRequest("GET", endpoint, null, authRequired),
  post: (endpoint, body, authRequired = true) => apiRequest("POST", endpoint, body, authRequired),
  put: (endpoint, body, authRequired = true) => apiRequest("PUT", endpoint, body, authRequired),
  delete: (endpoint, authRequired = true) => apiRequest("DELETE", endpoint, null, authRequired),
};
