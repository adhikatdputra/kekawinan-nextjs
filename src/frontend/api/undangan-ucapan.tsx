import axios from "@/lib/axios";
import { Params } from "../interface/undangan";

const undanganUcapanApi = {
  getData: (id: string, params: Params) => {
    return axios.get(`/users/ucapan/slug/${id}`, { params });
  },
  update: (id: string, formData: FormData) => {
    return axios.put(`/users/ucapan/${id}`, formData);
  },
  remove: (id: string) => {
    return axios.delete(`/users/ucapan/${id}`);
  },
  getAttend: (id: string) => {
    return axios.get(`/users/ucapan/attend/${id}`);
  },
  getNoAttend: (id: string) => {
    return axios.get(`/users/ucapan/no-attend/${id}`);
  },
  changeShow: (id: string, data: { is_show: string }) => {
    return axios.put(`/users/ucapan/show/${id}`, data);
  },
};

export default undanganUcapanApi;
