import axios from "@/lib/axios";

const creditsApi = {
  getMyCredits: () => {
    return axios.get(`/credits`);
  },
  getHistory: () => {
    return axios.get(`/credits/history`);
  },
};

export default creditsApi;
