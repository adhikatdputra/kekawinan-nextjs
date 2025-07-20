import axios from "@/lib/axios";
import { Params } from "../interface/undangan";

const themeApi = {
  getTheme: async () => {
    return axios.get(`/users/theme-all?sortBy=createdAt&order=ASC`);
  },
  getThemeAll: async (params: Params) => {
    return axios.get(`/admin/theme`, { params });
  },
};

export default themeApi;