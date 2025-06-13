import axios from "@/lib/axios";

const undanganUserApi = {
  getUndangan: async (slug: string) => {
    const res = await axios.get(`/undangan/${slug}`);
    return res.data;
  },
  getUndanganDetail: (slug: string) => {
    return axios.get(`/undangan-detail/${slug}`);
  },
  getTamu: async (id_tamu: string) => {
    const res = await axios.get(`/undangan/tamu/${id_tamu}`);
    return res.data;
  },
  createUcapan: (formData: FormData) => {
    return axios.post(`/undangan/ucapan/submit`, formData);
  },
  changeStatusUcapan: (id_tamu: string) => {
    return axios.put(`/undangan/tamu/${id_tamu}`);
  },
};

export default undanganUserApi;
