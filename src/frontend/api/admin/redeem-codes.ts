import axios from "@/lib/axios";
import { Params } from "../../interface/undangan";

export interface RedeemCodeParams extends Params {
  status?: string;
  packageType?: string;
  themeId?: string;
}

export interface GenerateCodeBody {
  packageType: string;
  totalCredit: number;
  expiredAt?: string;
  note?: string;
}

const redeemCodesApi = {
  getAll: async (params: RedeemCodeParams) => {
    return axios.get(`/admin/redeem-codes`, { params });
  },
  generate: async (body: GenerateCodeBody) => {
    return axios.post(`/admin/redeem-codes`, body);
  },
};

export default redeemCodesApi;
