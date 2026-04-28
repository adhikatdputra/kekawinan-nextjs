import axios from "@/lib/axios";
import { Params } from "../../interface/undangan";

const bankApi = {
  getAll: async (params: Params) => axios.get(`/admin/bank`, { params }),
  create: async (body: { name: string; code: string; icon?: string; color?: string }) =>
    axios.post(`/admin/bank`, body),
  update: async (id: string, body: { name?: string; code?: string; icon?: string; color?: string }) =>
    axios.put(`/admin/bank/${id}`, body),
  remove: async (id: string) => axios.delete(`/admin/bank/${id}`),
};

export default bankApi;
