import axios from "@/lib/axios";

const uploadApi = {
  /**
   * Upload an image file to Cloudinary via the Next.js API.
   * @param file  The File object to upload
   * @param folder  Optional Cloudinary folder (default: 'kekawinan/general')
   * @returns { url: string, publicId: string }
   */
  uploadImage: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);
    return axios.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default uploadApi;
