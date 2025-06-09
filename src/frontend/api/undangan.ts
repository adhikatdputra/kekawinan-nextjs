import axios from "@/lib/axios";
import { UndanganBody } from "../interface/undangan";

const undanganApi = {
  getUndangan: () => {
    return axios.post(`/users/undangan/me`);
  },
  getUndanganDetail: (key: string) => {
    return axios.get(`/users/undangan/${key}`);
  },
  createUndangan: (formData: UndanganBody) => {
    return axios.post(`/users/undangan/`, formData);
  },
  updateUndangan: (key: string, formData: UndanganBody) => {
    return axios.put(`/users/undangan/${key}`, formData);
  },
  deleteUndangan: (key: string) => {
    return axios.delete(`/users/undangan/${key}`);
  },
  getThemeUndangan: () => {
    return axios.get(`/users/theme-all?sortBy=createdAt&order=ASC`);
  },
};

export default undanganApi;
