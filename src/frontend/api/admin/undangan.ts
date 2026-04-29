import axios from "@/lib/axios";
import { Params } from "../../interface/undangan";

const adminUndanganApi = {
  // Admin sees all undangan (JWT level controls scope)
  getAll: async (params: Params) => {
    return axios.get(`/undangan`, { params });
  },
  remove: async (id: string) => {
    return axios.delete(`/undangan/${id}`);
  },
  update: async (id: string, body: { name: string; permalink: string; themeId?: string }) => {
    return axios.put(`/undangan/${id}`, body);
  },
};

export default adminUndanganApi;
