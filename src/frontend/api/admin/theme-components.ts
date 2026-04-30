import axios from "@/lib/axios";

export interface ThemeComponentBody {
  name: string;
  description?: string;
}

const themeComponentsApi = {
  getAll: () => axios.get("/admin/master-data/theme-components"),
  create: (body: ThemeComponentBody) =>
    axios.post("/admin/master-data/theme-components", body),
  update: (id: string, body: ThemeComponentBody) =>
    axios.put(`/admin/master-data/theme-components/${id}`, body),
  remove: (id: string) =>
    axios.delete(`/admin/master-data/theme-components/${id}`),
};

export default themeComponentsApi;
