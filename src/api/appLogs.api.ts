import { http } from "./http";

export const appLogsApi = {
    logUserInApp: async (pageName: string) => {
        await http.post("/app-logs/navigation", {
            page: pageName,
        });
    },
};