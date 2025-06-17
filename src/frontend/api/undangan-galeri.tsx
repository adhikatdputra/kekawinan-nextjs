import axios from "@/lib/axios";

const undanganGaleriApi = {
  getData: (id: string) => {
    return axios.get(
      `/users/undangangallery/slug/${id}?limit=10&page=1&sortBy=createdAt&order=ASC`
    );
  },
  create: (formData: FormData) => {
    return axios.post(`/users/undangangallery`, formData);
  },
  update: (id: string, formData: FormData) => {
    return axios.put(`/users/undangangallery/${id}`, formData);
  },
  remove: (id: string) => {
    return axios.delete(`/users/undangangallery/${id}`);
  },
  moveUp: (id: string) => {
    return axios.put(`/users/undangangallery/${id}/move-up`);
  },
  moveDown: (id: string) => {
    return axios.put(`/users/undangangallery/${id}/move-down`);
  },
};

export default undanganGaleriApi;
