// src/api/upload.api.ts

import { http } from "./http";

export const uploadApi = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await http.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },
};