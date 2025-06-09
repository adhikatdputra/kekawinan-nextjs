import axios from "@/lib/axios";
import { LoginBody, RegisterBody } from "../interface/auth";

const authApi = {
  login: async (body: LoginBody) => {
    return axios.post(`/auth/signin`, body);
  },
  register: async (body: RegisterBody) => {
    return axios.post(`/users`, body);
  },
  getMe: async () => {
    return axios.get(`/users/profile`);
  },
};

export default authApi;
