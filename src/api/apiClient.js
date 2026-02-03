import axios from "axios";
import { appParams } from "../lib/app-params";

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Axios instance = your "client"
export const api = axios.create({
  baseURL: appBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach auth token automatically
api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // optional metadata headers
    if (appId) config.headers["x-app-id"] = appId;
    if (functionsVersion)
      config.headers["x-functions-version"] = functionsVersion;

    return config;
  },
  (error) => Promise.reject(error)
);


// base44.get("/users");
// base44.post("/login", data);
// base44.put("/profile", payload);
// base44.delete("/logout");
