// src/api/auth.api.ts

import { signOut } from "firebase/auth";
import { http } from "./http";
import { auth } from "../firebase";

export const authApi = {
    me: async () => {
        const { data } = await http.get("/auth/me");
        return data;
    },

    updateMe: async (payload: {
        user_type?: string;
        onboarding_completed?: boolean;
    }) => {
        const { data } = await http.patch("/auth/me", payload);
        return data;
    },

    /**
     * Called after Firebase sign-in to sync with the backend.
     * Only attempts POST /auth/login — never falls back to signup.
     * Signup is handled explicitly by signupWithFirebase.
     */
    authenticateUser: async (firebaseUser: any) => {
        const token = await firebaseUser.getIdToken();

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await http.post("/auth/login", null, {
            headers,
        });

        return response.data;
    },

    signupWithFirebase: async (
        firebaseUser: any,
        payload: {
            name: string;
            role: string;
        }
    ) => {
        // Force-refresh the token so the backend always receives the very latest
        // credential — avoids 401s caused by tokens minted milliseconds before
        // the Firebase Admin SDK's clock_skew window.
        const token = await firebaseUser.getIdToken(true);

        const { data } = await http.post(
            "/auth/signup",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return data;
    },

    logout: async () => {
        await signOut(auth);
    },
};