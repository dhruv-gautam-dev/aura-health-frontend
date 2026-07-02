import { http } from "./http";
import type { UserSettings, UserSettingsUpdatePayload } from "../types/app.types";

export const settingsApi = {
    getMe: async (): Promise<UserSettings> => {
        const { data } = await http.get("/users/me");
        return data;
    },

    updateMe: async (payload: UserSettingsUpdatePayload): Promise<UserSettings> => {
        const { data } = await http.patch("/users/me", payload);
        return data;
    },

    deleteMe: async (): Promise<void> => {
        await http.delete("/users/me");
    },
};
