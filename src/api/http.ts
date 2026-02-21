// src/api/http.ts

import axios, { InternalAxiosRequestConfig } from "axios";
import { auth } from "../firebase";
import { appParams } from "../lib/app-params";

const { appId, functionsVersion, appBaseUrl } = appParams;

export const http = axios.create({
  baseURL: appBaseUrl ?? undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (appId) config.headers["x-app-id"] = appId;
    if (functionsVersion)
      config.headers["x-functions-version"] = functionsVersion;

    return config;
  },
  (error) => Promise.reject(error)
);