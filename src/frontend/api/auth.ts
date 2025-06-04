import axios from "@/lib/axios";

const authApi = {
  login: async (formData: { username: string; password: string }) => {
    return axios.post(`/api/auth-rest/signin`, formData);
  },
  logout: async () => {
    return axios.post(`/api/auth-rest/signout`);
  },
  getUser: async () => {
    return axios.get(`/api/auth-rest/me`);
  },
};

export default authApi;
