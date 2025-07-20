import axios from "@/lib/axios";
import { Params } from "../../interface/undangan";

const themeApi = {
  getAll: async (params: Params) => {
    return axios.get(`/admin/theme`, { params });
  },
  remove: async (id: string) => {
    return axios.delete(`/admin/theme/${id}`);
  },
  update: async (
    id: string,
    body: FormData
  ) => {
    return axios.put(`/admin/theme/${id}`, body);
  },
  create: async (body: FormData) => {
    return axios.post(`/admin/theme`, body);
  },
};

export default themeApi;
