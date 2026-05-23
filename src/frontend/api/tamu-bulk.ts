import axios from '@/lib/axios'

const tamuBulkApi = {
  import: (undanganId: string, file: File) => {
    const form = new FormData()
    form.append('undanganId', undanganId)
    form.append('file', file)
    return axios.post('/tamu/bulk-import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getLogs: (undanganId: string, params?: object) =>
    axios.get(`/tamu/bulk-log/undangan/${undanganId}`, { params }),
  updateLog: (id: string, data: object) =>
    axios.put(`/tamu/bulk-log/${id}`, data),
  deleteLog: (id: string) =>
    axios.delete(`/tamu/bulk-log/${id}`),
  retry: (id: string, data?: object) =>
    axios.post(`/tamu/bulk-log/${id}/retry`, data ?? {}),
}

export default tamuBulkApi
