// src/api/upload.api.ts

import { http } from "./http";
import type { HealthRecordUploadResponse } from "../types/app.types";

export const uploadApi = {
  uploadHealthRecord: async (file: File): Promise<HealthRecordUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await http.post("/health-records/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },
};