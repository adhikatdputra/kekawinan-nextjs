import axios from "@/lib/axios";
import { Params } from "../../interface/undangan";

export interface ThemeBody {
  name?: string;
  componentName?: string;
  linkUrl?: string;
  thumbnail?: string | null;
  credit?: number;
  promo?: number | null;
  isActive?: boolean;
}

const themeApi = {
  getAll: async (params: Params) => {
    return axios.get(`/admin/theme`, { params });
  },
  remove: async (id: string) => {
    return axios.delete(`/admin/theme/${id}`);
  },
  update: async (id: string, body: ThemeBody) => {
    return axios.put(`/admin/theme/${id}`, body);
  },
  create: async (body: ThemeBody) => {
    return axios.post(`/admin/theme`, body);
  },
};

export default themeApi;
