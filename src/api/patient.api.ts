// src/api/doctor.api.ts

import { http } from "./http";

export interface PatientProfilePayload {
    date_of_birth: string;
    phone: string;

    location: {
        city: string;
        state: string;
        country: string;
        timezone: string;
        postal_code: string;
    };

    medical_history: {
        blood_type: string;
        allergies: string[];
        chronic_conditions: string[];
        past_surgeries: string[];
        family_history: string;
    };

    insurance: {
        provider: string;
        policy_number: string;
        group_number: string;
    };

    emergency_contact: {
        name: string;
        relationship: string;
        phone: string;
    };
    onboarding_completed: boolean;
}

export const patientApi = {
    createProfile: async (payload: PatientProfilePayload) => {
        const { data } = await http.post("/users/patient-profile", payload);
        return data;
    },
};