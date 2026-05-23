import axios from "@/lib/axios";

const loveStoryApi = {
  getData: (undanganId: string) => {
    return axios.get(`/undangan/${undanganId}/love-story`);
  },
  create: (undanganId: string, formData: object) => {
    return axios.post(`/undangan/${undanganId}/love-story`, formData);
  },
  update: (undanganId: string, storyId: string, formData: object) => {
    return axios.put(`/undangan/${undanganId}/love-story/${storyId}`, formData);
  },
  remove: (undanganId: string, storyId: string) => {
    return axios.delete(`/undangan/${undanganId}/love-story/${storyId}`);
  },
  moveUp: (undanganId: string, storyId: string) => {
    return axios.patch(`/undangan/${undanganId}/love-story/${storyId}/move`, { direction: "up" });
  },
  moveDown: (undanganId: string, storyId: string) => {
    return axios.patch(`/undangan/${undanganId}/love-story/${storyId}/move`, { direction: "down" });
  },
};

export default loveStoryApi;
