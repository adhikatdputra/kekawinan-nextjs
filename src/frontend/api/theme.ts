import axios from "@/lib/axios";

const themeApi = {
  getTheme: async () => {
    return axios.get(`/users/theme-all?sortBy=createdAt&order=ASC`);
  },
};

export default themeApi;