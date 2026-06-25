// src/api/calendar.api.ts

import { http } from "./http";

export interface CalendarStatus {
    connected: boolean;
    google_email: string | null;
    granted_at?: string;
}

export const calendarApi = {
    /** Check whether the current user has connected their Google Calendar. */
    getStatus: async (): Promise<CalendarStatus> => {
        const { data } = await http.get("/calendar/status");
        return data;
    },

    /** Get the Google OAuth consent URL. Open the returned `auth_url` in a new tab. */
    getAuthUrl: async (): Promise<{ auth_url: string; message: string }> => {
        const { data } = await http.get("/calendar/auth");
        return data;
    },

    /** Revoke the stored Google Calendar tokens for the current user. */
    revoke: async (): Promise<void> => {
        await http.delete("/calendar/revoke");
    },
};
