import axios from "@/lib/axios";
import { Params } from "../interface/undangan";

const giftApi = {
  getAll: (undangan_id: string) => {
    return axios.get(`/users/kado/slug/${undangan_id}`);
  },
  getData: (undangan_id: string, params: Params) => {
    return axios.get(`/users/kado/?undangan_id=${undangan_id}`, { params });
  },
  getDetail: (id: string) => {
    return axios.get(`/users/kado/${id}`);
  },
  create: (formData: FormData) => {
    return axios.post(`/users/kado/`, formData);
  },
  update: (id: string, formData: FormData) => {
    return axios.put(`/users/kado/${id}`, formData);
  },
  remove: (id: string) => {
    return axios.delete(`/users/kado/${id}`);
  },
  confirm: (id: string, formData: FormData) => {
    return axios.put(`/users/kado/${id}/confirm`, formData);
  },
};

export default giftApi;
