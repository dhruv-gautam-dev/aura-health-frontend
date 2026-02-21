import { http } from "./http";

export const medicationApi = {
  getActive: async () => {
    const { data } = await http.get("/medications", {
      params: {
        is_active: true,
        limit: 10,
        sort: "-created_date",
      },
    });
    return data;
  },
};

export const medicationLogApi = {
  create: async (payload: {
    medication_id: string | number;
    scheduled_time: string;
    taken_time: string;
    status: string;
  }) => {
    const { data } = await http.post("/medication-logs", payload);
    return data;
  },
};