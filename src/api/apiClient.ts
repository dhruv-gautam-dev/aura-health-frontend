import axios, { InternalAxiosRequestConfig } from "axios";
import { auth } from "../firebase";
import { appParams } from "../lib/app-params";

const { appId, functionsVersion, appBaseUrl } = appParams;

// Create Axios instance
export const api = axios.create({
  baseURL: appBaseUrl ?? undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Firebase ID token automatically
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const user = auth.currentUser;

    if (user) {
      const idToken = await user.getIdToken();
      config.headers.Authorization = `Bearer ${idToken}`;
    }

    // Optional metadata headers
    if (appId) {
      config.headers["x-app-id"] = appId;
    }

    if (functionsVersion) {
      config.headers["x-functions-version"] = functionsVersion;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication Endpoints
export const authenticateUser = async (firebaseUser: any) => {
  const token = await firebaseUser.getIdToken();

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    // 1. Try Login first
    let response = await api.post("/auth/login", null, { headers });

    // 2. If 404 → User not found → Call Signup
    if (response.status === 404) {
      console.log("User not found in DB. Creating new account...");
      response = await api.post("/auth/signup", null, { headers });
    }

    // 3. Handle final response
    if (response.status === 200 || response.status === 201) {
      return response.data; // Proceed to Dashboard
    } else {
      throw new Error(response.data.detail);
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Authentication failed");
  }
};
