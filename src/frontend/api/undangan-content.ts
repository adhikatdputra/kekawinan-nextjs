import axios from "@/lib/axios";

const undanganContentApi = {
  getUndanganContent: (undanganId: string) => {
    return axios.get(`/undangan/${undanganId}/content`);
  },
  updateUndanganContent: (undanganId: string, formData: object) => {
    return axios.put(`/undangan/${undanganId}/content`, formData);
  },
  // Amplop digital (bank accounts)
  getDataGift: (undanganId: string) => {
    return axios.get(`/undangan/${undanganId}/gifts`);
  },
  createGift: (undanganId: string, formData: object) => {
    return axios.post(`/undangan/${undanganId}/gifts`, formData);
  },
  updateGift: (undanganId: string, giftId: string, formData: object) => {
    return axios.put(`/undangan/${undanganId}/gifts/${giftId}`, formData);
  },
  deleteGift: (undanganId: string, giftId: string) => {
    return axios.delete(`/undangan/${undanganId}/gifts/${giftId}`);
  },
};

export default undanganContentApi;
