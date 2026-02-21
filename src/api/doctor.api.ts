// src/api/doctor.api.ts

import { http } from "./http";

export interface DoctorProfilePayload {
  user_id: string;
  specialization: string;
  license_number: string;
  years_of_experience: number;
  bio: string;
  consultation_fee: number;
  education: any[];
  certifications: string[];
  languages: string[];
  availability: {
    days: string[];
    hours: string;
  };
  is_verified: boolean;
  is_available: boolean;
  rating: number;
  total_consultations: number;
}

export const doctorApi = {
  createProfile: async (payload: DoctorProfilePayload) => {
    const { data } = await http.post("/doctor-profile", payload);
    return data;
  },
};