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

        console.log("Authenticating user with token:", token);

        let response = await http.post("/auth/login", null, {
            headers,
            validateStatus: () => true,
        });

        console.log("Login response:", response);

        if (response.status === 404) {
            console.log("User not found, attempting signup...");
            response = await http.post("/auth/signup", null, { headers });
            console.log("Signup response:", response);
        }

        if (response.status === 200 || response.status === 201) {
            console.log("Authentication successful, user data:", response.data);
            return response.data;
        }

        console.error("Authentication failed with status:", response.status);
        throw new Error(response.data?.detail || "Authentication failed");
    },

    signupWithFirebase: async (
        firebaseUser: any,
        payload: {
            name: string;  
            role: string;  
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
    },
};