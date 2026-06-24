import { http } from "./http";
import type { LabTimelineResponse } from "../types/app.types";

export const healthRecordsApi = {
    /**
     * Upload a health record (prescription image or lab report PDF).
     * Triggers Gemini OCR extraction on the backend.
     */
    upload: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await http.post("/health-records/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },

    /**
     * Fetch all lab results for the authenticated user, sorted chronologically.
     * Optionally filter by test name (e.g. "HbA1c", "TSH").
     */
    getLabsTimeline: async (testName?: string): Promise<LabTimelineResponse> => {
        const { data } = await http.get("/health-records/labs/timeline", {
            params: testName ? { test_name: testName } : undefined,
        });
        return data;
    },

    /**
     * Download the user's full Digital Twin as a FHIR R4 Bundle JSON file.
     */
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
