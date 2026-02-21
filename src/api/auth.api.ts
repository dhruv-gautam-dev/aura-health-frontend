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

    authenticateUser: async (firebaseUser: any) => {
        const token = await firebaseUser.getIdToken();

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        let response = await http.post("/auth/login", null, {
            headers,
            validateStatus: () => true,
        });

        if (response.status === 404) {
            response = await http.post("/auth/signup", null, { headers });
        }

        if (response.status === 200 || response.status === 201) {
            return response.data;
        }

        

        throw new Error(response.data?.detail || "Authentication failed");
    },

    signupWithFirebase: async (
        firebaseUser: any,
        payload: {
            email: string;
            role: string;
            userName: string;
        }
    ) => {
        const token = await firebaseUser.getIdToken();

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
}
};