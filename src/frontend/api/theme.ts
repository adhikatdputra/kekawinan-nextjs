import axios from "@/lib/axios";
import { Params } from "../interface/undangan";

const themeApi = {
  // Public: active themes for the invitation picker
  getTheme: async () => {
    return axios.get(`/theme/public?sortBy=createdAt&order=ASC`);
  },
  // Admin only
  getThemeAll: async (params: Params) => {
    return axios.get(`/admin/theme`, { params });
  },
  createTheme: async (formData: object) => {
    return axios.post(`/admin/theme`, formData);
  },
  updateTheme: async (id: string, formData: object) => {
    return axios.put(`/admin/theme/${id}`, formData);
  },
  deleteTheme: async (id: string) => {
    return axios.delete(`/admin/theme/${id}`);
  },
};

export default themeApi;
