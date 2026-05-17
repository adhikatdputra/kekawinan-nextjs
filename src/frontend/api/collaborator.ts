import axios from '@/lib/axios'
import { InviteCollaboratorBody } from '../interface/collaborator'

const collaboratorApi = {
  getCollaborators: (undanganId: string) =>
    axios.get(`/undangan/${undanganId}/collaborators`),

  inviteCollaborator: (undanganId: string, body: InviteCollaboratorBody) =>
    axios.post(`/undangan/${undanganId}/collaborators`, body),

  updateRole: (undanganId: string, collabId: string, role: string) =>
    axios.patch(`/undangan/${undanganId}/collaborators/${collabId}`, { role }),

  removeCollaborator: (undanganId: string, collabId: string) =>
    axios.delete(`/undangan/${undanganId}/collaborators/${collabId}`),

  resendInvite: (undanganId: string, collabId: string) =>
    axios.post(`/undangan/${undanganId}/collaborators/${collabId}/resend`),
}

export default collaboratorApi
