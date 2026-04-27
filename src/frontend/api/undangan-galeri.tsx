import axios from "@/lib/axios";

const undanganGaleriApi = {
  getData: (undanganId: string) => {
    return axios.get(`/undangan/${undanganId}/gallery`);
  },
  create: (undanganId: string, formData: object) => {
    return axios.post(`/undangan/${undanganId}/gallery`, formData);
  },
  update: (undanganId: string, galleryId: string, formData: object) => {
    return axios.put(`/undangan/${undanganId}/gallery/${galleryId}`, formData);
  },
  remove: (undanganId: string, galleryId: string) => {
    return axios.delete(`/undangan/${undanganId}/gallery/${galleryId}`);
  },
  moveUp: (undanganId: string, galleryId: string) => {
    return axios.patch(`/undangan/${undanganId}/gallery/${galleryId}/move`, { direction: "up" });
  },
  moveDown: (undanganId: string, galleryId: string) => {
    return axios.patch(`/undangan/${undanganId}/gallery/${galleryId}/move`, { direction: "down" });
  },
};

export default undanganGaleriApi;
