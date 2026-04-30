import axios from "@/lib/axios";

const settingsApi = {
  getAll: async () => {
    return axios.get(`/admin/settings`);
  },
  update: async (body: Record<string, string>) => {
    return axios.patch(`/admin/settings`, body);
  },
};

export default settingsApi;
