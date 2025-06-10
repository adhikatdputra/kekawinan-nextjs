import axios from "@/lib/axios";

const undanganContentApi = {
  getUndanganContent: (id: string) => {
    return axios.get(`/users/undangancontent/slug/${id}`);
  },
  updateUndanganContent: (id: string, formData: FormData) => {
    return axios.put(`/users/undangancontent/${id}`, formData);
  },
  getDataGift: (id: string) => {
    return axios.get(`/users/gift/slug/${id}`);
  },
  updateGift: (id: string, formData: FormData) => {
    return axios.put(`/users/gift/${id}`, formData);
  },
};

export default undanganContentApi;
