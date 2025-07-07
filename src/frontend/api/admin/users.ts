import axios from "@/lib/axios";
import { Params } from "../../interface/undangan";

const usersApi = {
  getUsers: async (params: Params) => {
    return axios.get(`/admin/users`, { params });
  },
};

export default usersApi;
