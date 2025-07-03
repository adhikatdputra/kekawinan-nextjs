import axios from "@/lib/axios";

const profileApi = {
  getUser: () => {
    return axios.get(`/users/profile`);
  },
  updateUser: (body: { fullname: string; phone: string }) => {
    return axios.put(`/users/update-profile`, body);
  },
  updatePassword: (body: { old_password: string; new_password: string }) => {
    return axios.put(`/users/change-password`, body);
  },
};

export default profileApi;
