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
  isShowAdmin?: boolean;
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
  setFeatured: async (id: string, isFeatured: boolean) => {
    return axios.patch(`/admin/theme/${id}/featured`, { isFeatured });
  },
  create: async (body: ThemeBody) => {
    return axios.post(`/admin/theme`, body);
  },
};

export default themeApi;
