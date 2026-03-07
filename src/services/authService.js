import {
  apiRequest,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "../config/api";

const USER_STORAGE_KEY = "talkypie_auth_user";

function safeParseUser(rawUser) {
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser);
  } catch (error) {
    return null;
  }
}

export function getStoredUser() {
  return safeParseUser(localStorage.getItem(USER_STORAGE_KEY));
}

export function setStoredUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function clearAuthSession() {
  clearStoredToken();
  clearStoredUser();
}

export function setAuthSession({ token, user }) {
  setStoredToken(token);
  setStoredUser(user);
}

export function getAuthToken() {
  return getStoredToken();
}

export async function signupRequest(payload) {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: payload,
  });
}

export async function loginRequest(payload) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function fetchCurrentUser(token = getStoredToken()) {
  return apiRequest("/auth/me", {
    method: "GET",
    token,
  });
}
