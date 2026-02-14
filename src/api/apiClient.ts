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
