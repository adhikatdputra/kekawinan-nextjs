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
  forgotPassword: async (email: string) => {
    return axios.post(`/auth/forget-password`, { email });
  },
  resetPassword: async (token: string, new_password: string) => {
    return axios.post(`/auth/reset-password`, { token, new_password });
  },
};

export default authApi;
