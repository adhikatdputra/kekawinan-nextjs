"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/frontend/composable/useAuth";
import useSession from "@/frontend/hook/useSession";
import collaboratorApi from "@/frontend/api/collaborator";
import undanganApi from "@/frontend/api/undangan";
import { Collaborator, CollaboratorRole } from "@/frontend/interface/collaborator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconUserPlus, IconMail, IconTrash, IconEdit } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import PendingData from "@/components/ui/custom/pending-data";

export default function KolaboratorPage() {
  useSession();
  const params = useParams();
  const id = params.id as string;
  const { getUser } = useAuth();
  const queryClient = useQueryClient();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCollab, setSelectedCollab] = useState<Collaborator | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<CollaboratorRole>("MEMBER");
  const [editRole, setEditRole] = useState<CollaboratorRole>("MEMBER");

  // Fetch undangan to verify ownership
  const { data: undangan } = useQuery({
    queryKey: ["undangan-detail", id],
    queryFn: () => undanganApi.getUndanganDetail(id),
    select: (data) => data.data.data,
  });

  const isOwner = undangan?.userId === getUser()?.id;

  // Fetch collaborators
  const { data: collaborators, isLoading } = useQuery({
    queryKey: ["collaborators", id],
    queryFn: () => collaboratorApi.getCollaborators(id),
    select: (data) => data.data.data as Collaborator[],
    enabled: isOwner,
  });

  // Invite mutation
  const { mutate: invite, isPending: isInviting } = useMutation({
    mutationFn: () => collaboratorApi.inviteCollaborator(id, { email: inviteEmail, role: inviteRole }),
    onSuccess: (data) => {
      if (data.data.success) {
        toast.success("Kolaborator berhasil diundang");
        setIsInviteOpen(false);
        setInviteEmail("");
        setInviteRole("MEMBER");
        queryClient.invalidateQueries({ queryKey: ["collaborators", id] });
      } else {
        toast.error(data.data.message);
      }
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Gagal mengundang kolaborator");
    },
  });

  // Update role mutation
  const { mutate: updateRole, isPending: isUpdatingRole } = useMutation({
    mutationFn: () => collaboratorApi.updateRole(id, selectedCollab!.id, editRole),
    onSuccess: (data) => {
      if (data.data.success) {
        toast.success("Role berhasil diubah");
        setIsEditOpen(false);
        queryClient.invalidateQueries({ queryKey: ["collaborators", id] });
      } else {
        toast.error(data.data.message);
      }
    },
    onError: () => { toast.error("Gagal mengubah role"); },
  });

  // Delete mutation
  const { mutate: removeCollab, isPending: isRemoving } = useMutation({
    mutationFn: () => collaboratorApi.removeCollaborator(id, selectedCollab!.id),
    onSuccess: (data) => {
      if (data.data.success) {
        toast.success("Kolaborator berhasil dihapus");
        setIsDeleteOpen(false);
        queryClient.invalidateQueries({ queryKey: ["collaborators", id] });
      } else {
        toast.error(data.data.message);
      }
    },
    onError: () => { toast.error("Gagal menghapus kolaborator"); },
  });

  // Resend mutation
  const { mutate: resend } = useMutation({
    mutationFn: (collabId: string) => collaboratorApi.resendInvite(id, collabId),
    onSuccess: (data) => {
      if (data.data.success) toast.success("Email undangan berhasil dikirim ulang");
      else toast.error(data.data.message);
    },
    onError: () => { toast.error("Gagal mengirim ulang email"); },
  });

  const openEdit = (collab: Collaborator) => {
    setSelectedCollab(collab);
    setEditRole(collab.role);
    setIsEditOpen(true);
  };

  const openDelete = (collab: Collaborator) => {
    setSelectedCollab(collab);
    setIsDeleteOpen(true);
  };

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Kamu tidak memiliki akses ke halaman ini.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Kolaborator Undangan</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola siapa saja yang bisa membantu undangan ini.
            </p>
          </div>
          <Button onClick={() => setIsInviteOpen(true)}>
            <IconUserPlus size={16} />
            Invite Kolaborator
          </Button>
        </div>

        {isLoading ? (
          <PendingData />
        ) : (collaborators?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 border border-dashed border-border rounded-2xl text-center text-muted-foreground">
            <IconUserPlus size={32} />
            <p className="font-medium">Belum ada kolaborator</p>
            <p className="text-sm">Klik "Invite Kolaborator" untuk menambahkan orang pertama.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collaborators?.map((collab) => (
                  <TableRow key={collab.id}>
                    <TableCell className="font-mono text-sm">{collab.email}</TableCell>
                    <TableCell>{collab.user?.fullname ?? <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>
                      <Badge variant={collab.role === "MEMBER" ? "default" : "secondary"}>
                        {collab.role === "MEMBER" ? "Member" : "Crew"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={collab.status === "ACTIVE" ? "default" : "outline"}
                        className={collab.status === "ACTIVE" ? "bg-green-kwn text-white" : ""}
                      >
                        {collab.status === "ACTIVE" ? "Aktif" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {collab.status === "PENDING" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resend(collab.id)}
                            title="Kirim ulang email"
                          >
                            <IconMail size={14} />
                            Resend
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(collab)}
                        >
                          <IconEdit size={14} />
                          Ubah
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDelete(collab)}
                        >
                          <IconTrash size={14} />
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {(collaborators?.length ?? 0) > 0 && (
          <p className="text-xs text-muted-foreground">
            ⓘ Status &quot;Pending&quot; berarti email belum memiliki akun Kekawinan.com.
            Mereka akan otomatis mendapat akses setelah mendaftar.
          </p>
        )}
      </div>

      {/* ── Dialog: Invite ───────────────────────────────────────────────────── */}
      <Dialog open={isInviteOpen} onOpenChange={(open) => { setIsInviteOpen(open); if (!open) { setInviteEmail(""); setInviteRole("MEMBER"); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite Kolaborator</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@contoh.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as CollaboratorRole)}>
                <SelectTrigger className="text-left [&>span]:text-left">
                  <SelectValue className="text-left" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">
                    <div>
                      <div className="font-medium">Member</div>
                      <div className="text-xs text-muted-foreground">Bisa isi dan update data undangan</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="CREW">
                    <div>
                      <div className="font-medium">Crew</div>
                      <div className="text-xs text-muted-foreground">Khusus scanner absensi di hari H</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Batal</Button>
            <Button
              onClick={() => invite()}
              disabled={isInviting || !inviteEmail.trim()}
            >
              {isInviting ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</> : "Kirim Undangan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Edit Role ────────────────────────────────────────────────── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Ubah Role</DialogTitle>
            <DialogDescription>{selectedCollab?.email}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label>Role</Label>
            <Select value={editRole} onValueChange={(v) => setEditRole(v as CollaboratorRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="CREW">Crew</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
            <Button onClick={() => updateRole()} disabled={isUpdatingRole}>
              {isUpdatingRole ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Alert: Hapus ─────────────────────────────────────────────────────── */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kolaborator</AlertDialogTitle>
            <AlertDialogDescription>
              Hapus <strong>{selectedCollab?.email}</strong> dari undangan ini? Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsDeleteOpen(false); setSelectedCollab(null); }}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => removeCollab()} disabled={isRemoving}>
              {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
