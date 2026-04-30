import axios from "@/lib/axios";

const creditsApi = {
  getMyCredits: () => {
    return axios.get(`/credits`);
  },
};

export default creditsApi;
