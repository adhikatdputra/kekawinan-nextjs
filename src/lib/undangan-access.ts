import { prisma } from '@/lib/prisma'

export type UndanganRole = 'OWNER' | 'MEMBER' | 'CREW'

export interface UndanganAccess {
  role: UndanganRole
  undangan: { id: string; userId: string; name: string | null; permalink: string }
}

/**
 * Returns the role of `userId` in the given undangan, or null if no access.
 * Owner = creator (tbl_undangan.userId), Member/Crew = active collaborator.
 */
export async function getUndanganAccess(
  undanganId: string,
  userId: string,
): Promise<UndanganAccess | null> {
  const undangan = await prisma.undangan.findUnique({
    where: { id: undanganId },
    select: { id: true, userId: true, name: true, permalink: true },
  })

  if (!undangan) return null

  if (undangan.userId === userId) {
    return { role: 'OWNER', undangan }
  }

  const collab = await prisma.undanganCollaborator.findFirst({
    where: { undanganId, userId, status: 'ACTIVE' },
  })

  if (collab) {
    return { role: collab.role as UndanganRole, undangan }
  }

  return null
}
