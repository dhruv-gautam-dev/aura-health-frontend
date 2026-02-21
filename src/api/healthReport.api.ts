import { http } from "./http";

export const healthReportApi = {
  getRecent: async () => {
    const { data } = await http.get("/health-reports", {
      params: {
        limit: 5,
        sort: "-created_date",
      },
    });
    return data;
  },
};