import axios from "@/lib/axios";

const undanganUserApi = {
  getUndangan: async (slug: string) => {
    const res = await axios.get(`/undangan/public/${slug}`);
    return res.data;
  },
  getUndanganDetail: (slug: string) => {
    return axios.get(`/undangan/public/detail/${slug}`);
  },
  getTamu: async (id_tamu: string) => {
    const res = await axios.get(`/tamu/public/${id_tamu}`);
    return res.data;
  },
  createUcapan: (formData: object) => {
    return axios.post(`/ucapan/public/submit`, formData);
  },
  changeStatusUcapan: (id_tamu: string) => {
    return axios.put(`/tamu/public/${id_tamu}`);
  },
};

export default undanganUserApi;
