import axios from "@/lib/axios";
import { Params } from "../interface/undangan";

const themeApi = {
  getTheme: async () => {
    return axios.get(`/users/theme-all?sortBy=createdAt&order=ASC`);
  },
  getThemeAll: async (params: Params) => {
    return axios.get(`/admin/theme`, { params });
  },
  createTheme: async (formData: FormData) => {
    return axios.post(`/admin/theme`, formData);
  },
  updateTheme: async (id: string, formData: FormData) => {
    return axios.put(`/admin/theme/${id}`, formData);
  },
  deleteTheme: async (id: string) => {
    return axios.delete(`/admin/theme/${id}`);
  },
};

export default themeApi;