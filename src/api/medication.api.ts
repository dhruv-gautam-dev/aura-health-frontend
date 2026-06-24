import { http } from "./http";
import type {
  Medication,
  MedicationCreatePayload,
  MedicationCreateResponse,
  MedicationUpdatePayload,
} from "../types/app.types";

export const medicationApi = {
  list: async (): Promise<Medication[]> => {
    const { data } = await http.get("/medications");
    return data;
  },

  create: async (payload: MedicationCreatePayload): Promise<MedicationCreateResponse> => {
    const { data } = await http.post("/medications/", payload);
    return data;
  },

  get: async (id: number): Promise<Medication> => {
    const { data } = await http.get(`/medications/${id}`);
    return data;
  },

  update: async (id: number, payload: MedicationUpdatePayload): Promise<Medication> => {
    const { data } = await http.patch(`/medications/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/medications/${id}`);
  },
};