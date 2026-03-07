// const DEFAULT_API_BASE_URL = "http://localhost:5000";
const DEFAULT_API_BASE_URL = "https://talkypie-backend-test-repo.onrender.com";
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

const TOKEN_STORAGE_KEY = "talkypie_auth_token";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function isUnauthorizedError(error) {
  return error?.status === 401 || error?.status === 403;
}

export async function apiRequest(path, options = {}) {
  const token = options.token || getStoredToken();
  const requestHeaders = {
    ...(options.headers || {}),
  };

  const isJsonBody =
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData);

  if (isJsonBody && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token && !requestHeaders.Authorization) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: requestHeaders,
    body: isJsonBody ? JSON.stringify(options.body) : options.body,
  });

  const contentType = response.headers.get("content-type") || "";
  const responseData = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(
      responseData?.error || responseData?.message || "Request failed",
    );
    error.status = response.status;
    error.data = responseData;
    throw error;
  }

  return responseData;
}
