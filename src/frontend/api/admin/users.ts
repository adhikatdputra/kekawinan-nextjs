import axios from "@/lib/axios";
import { Params } from "../../interface/undangan";

const usersApi = {
  getUsers: async (params: Params) => {
    return axios.get(`/admin/users`, { params });
  },
  getStats: async () => {
    return axios.get(`/admin/users/stats`);
  },
  createUser: async (data: {
    email: string;
    fullname: string;
    password: string;
    level: string;
  }) => {
    return axios.post(`/admin/users`, data);
  },
  updateUser: async (id: string, data: Record<string, unknown>) => {
    return axios.put(`/admin/users/${id}`, data);
  },
};

export default usersApi;
