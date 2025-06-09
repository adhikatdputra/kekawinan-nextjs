import axios from "@/lib/axios";

const profileApi = {
  getUser: () => {
    return axios.get(`/users/profile`);
  },
  updateUser: (body: { fullname: string; phone: string }) => {
    return axios.put(`/users/update-profile`, body);
  },
};

export default profileApi;
