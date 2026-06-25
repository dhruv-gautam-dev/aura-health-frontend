import { http } from "./http";
import type { LabTimelineResponse, UploadsListResponse } from "../types/app.types";

export const healthRecordsApi = {
    upload: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await http.post("/health-records/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },

    getUploads: async (): Promise<UploadsListResponse> => {
        const { data } = await http.get("/health-records/uploads");
        return data;
    },

    deleteUpload: async (uploadId: string): Promise<void> => {
        await http.delete(`/health-records/uploads/${uploadId}`);
    },

    getLabsTimeline: async (testName?: string): Promise<LabTimelineResponse> => {
        const { data } = await http.get("/health-records/labs/timeline", {
            params: testName ? { test_name: testName } : undefined,
        });
        return data;
    },

    exportFhir: async (): Promise<void> => {
        const response = await http.get("/users/export/fhir", {
            responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        const disposition = response.headers["content-disposition"] || "";
        const filename = disposition.match(/filename="(.+)"/)?.[1] ?? "fhir-export.json";
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};
