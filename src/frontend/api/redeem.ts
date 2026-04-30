import axios from "@/lib/axios";

const redeemApi = {
  redeemCode: (code: string) => {
    return axios.post(`/redeem`, { code });
  },
};

export default redeemApi;
