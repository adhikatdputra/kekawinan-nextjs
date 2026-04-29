import axios from "@/lib/axios";
import { Params } from "../interface/undangan";

const undanganUcapanApi = {
  getData: (undanganId: string, params: Params) => {
    return axios.get(`/ucapan/undangan/${undanganId}`, { params });
  },
  getStats: (undanganId: string) => {
    return axios.get(`/ucapan/undangan/${undanganId}/stats`);
  },
  update: (id: string, formData: object) => {
    return axios.put(`/ucapan/${id}`, formData);
  },
  remove: (id: string) => {
    return axios.delete(`/ucapan/${id}`);
  },
  // Toggle visibility on the public invitation page (0 = hidden, 1 = visible)
  changeShow: (id: string, data: { isShow: number }) => {
    return axios.patch(`/ucapan/${id}/show`, data);
  },
};

export default undanganUcapanApi;
