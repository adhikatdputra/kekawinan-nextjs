import axios from "@/lib/axios";
import { Params } from "../../interface/undangan";

const undanganApi = {
  getAll: async (params: Params) => {
    return axios.get(`/admin/undangan`, { params });
  },
  remove: async (id: string) => {
    return axios.delete(`/admin/undangan/${id}`);
  },
  update: async (
    id: string,
    body: { user_id: string; name: string; permalink: string }
  ) => {
    return axios.put(`/admin/undangan/${id}`, body);
  },
};

export default undanganApi;
