import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  timeout: 45000,
  headers: {
    "Content-Type": "application/json"
  }
});

export function apiErrorMessage(error) {
  const detail = error?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(" ");
  }
  if (typeof detail === "string") {
    return detail;
  }
  if (error?.code === "ECONNABORTED") {
    return "The request timed out. Check the backend and local model, then try again.";
  }
  if (!error?.response) {
    return "Cannot reach the backend API. Confirm it is running on port 8000.";
  }
  return error.message || "Something went wrong.";
}
