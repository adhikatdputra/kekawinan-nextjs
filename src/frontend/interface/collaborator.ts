export type CollaboratorRole = 'MEMBER' | 'CREW'
export type CollaboratorStatus = 'PENDING' | 'ACTIVE'

export interface Collaborator {
  id: string
  undanganId: string
  userId: string | null
  email: string
  role: CollaboratorRole
  status: CollaboratorStatus
  invitedBy: string
  joinedAt: string | null
  createdAt: string
  updatedAt: string
  user: { fullname: string | null; email: string } | null
  inviter: { fullname: string | null }
}

export interface InviteCollaboratorBody {
  email: string
  role: CollaboratorRole
}
