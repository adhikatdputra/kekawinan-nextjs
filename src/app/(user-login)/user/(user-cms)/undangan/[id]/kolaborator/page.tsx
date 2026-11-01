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
  IconUserPlus,
  IconMail,
  IconTrash,
  IconEdit,
  IconLoader2,
  IconInfoCircle,
} from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { BrandCharacter } from "@/components/pages/home/brand-visual";

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus";
const actionButton = `inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${focusRing}`;

// Same wording as the role picker in the invite dialog
const ROLES: { value: CollaboratorRole; label: string; description: string; className: string }[] = [
  { value: "OWNER", label: "Owner", description: "Akses penuh seperti pemilik undangan.", className: "bg-brand-green text-white" },
  { value: "MEMBER", label: "Member", description: "Bisa isi dan update data undangan.", className: "bg-brand-sky text-brand-focus" },
  { value: "CREW", label: "Crew", description: "Khusus scanner absensi di hari H.", className: "bg-brand-yellow text-brand-ink" },
];

function RoleBadge({ role }: { role: CollaboratorRole }) {
  const item = ROLES.find((r) => r.value === role) ?? ROLES[1];
  return (
    <span className={`inline-flex rounded-lg px-2.5 py-0.5 text-xs font-bold ${item.className}`}>
      {item.label}
    </span>
  );
}

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
  const { mutate: resend, isPending: isResending, variables: resendingId } = useMutation({
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
      <div className="flex flex-col items-center py-16 text-center text-brand-ink">
        <BrandCharacter character="host" className="w-28" />
        <p className="mt-4 font-bold">Halaman ini khusus pemilik undangan</p>
        <p className="mt-1 text-sm text-brand-muted">
          Minta pemilik undangan kalau kamu perlu mengatur kolaborator.
        </p>
      </div>
    );
  }

  const inviteButton = (
    <button
      type="button"
      onClick={() => setIsInviteOpen(true)}
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-green px-5 text-sm font-bold text-white transition-colors hover:bg-brand-green-dark ${focusRing}`}
    >
      <IconUserPlus size={18} aria-hidden="true" />
      Undang kolaborator
    </button>
  );

  return (
    <>
      <div className="flex flex-col gap-8 text-brand-ink">
        <header className="relative overflow-hidden rounded-2xl bg-brand-pink p-6 sm:p-8 sm:pr-[200px]">
          <h1 className="font-recoleta-alt text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2] font-bold tracking-[-0.02em]">
            Kolaborator
          </h1>
          <p className="mt-3 max-w-[560px] leading-[1.7] text-brand-muted">
            Ajak keluarga atau WO untuk ikut mengurus undangan ini. Atur juga
            apa saja yang boleh mereka lakukan.
          </p>
          <div className="mt-5">{inviteButton}</div>
          <div className="absolute -bottom-2 right-6 hidden w-[160px] sm:block" aria-hidden="true">
            <div className="absolute inset-x-[4%] top-[14%] bottom-0 rounded-[48%_48%_16px_16px] bg-brand-pink-deep" />
            <BrandCharacter character="host" className="relative w-full" />
          </div>
        </header>

        <section aria-labelledby="role-heading">
          <h2 id="role-heading" className="font-bold">Arti tiap role</h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-3">
            {ROLES.map((role) => (
              <div key={role.value} className="rounded-2xl border border-brand-line bg-brand-cream p-4">
                <dt>
                  <RoleBadge role={role.value} />
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-brand-muted">{role.description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="kolaborator-heading" className="grid grid-cols-[minmax(0,1fr)] gap-4">
          <h2 id="kolaborator-heading" className="font-recoleta-alt text-2xl font-bold">
            Daftar kolaborator
          </h2>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-brand-cream p-8 text-brand-muted">
              <IconLoader2 size={20} className="animate-spin" aria-hidden="true" />
              Memuat kolaborator…
            </div>
          ) : (collaborators?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-brand-line bg-brand-cream px-6 py-10 text-center">
              <BrandCharacter character="courier" className="w-28" />
              <p className="mt-4 font-bold">Belum ada kolaborator</p>
              <p className="mt-1 mb-5 max-w-sm text-sm text-brand-muted">
                Undang lewat email. Mereka dapat akses setelah masuk ke Kekawinan.com.
              </p>
              {inviteButton}
            </div>
          ) : (
            <>
              <ul className="divide-y divide-brand-line rounded-2xl border border-brand-line">
                {collaborators?.map((collab) => {
                  const isResendingThis = isResending && resendingId === collab.id;
                  return (
                    <li
                      key={collab.id}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-bold">
                          {collab.user?.fullname ?? <span className="text-brand-muted">Belum punya akun</span>}
                        </p>
                        <p className="truncate text-sm text-brand-muted">{collab.email}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <RoleBadge role={collab.role} />
                          <span
                            className={`inline-flex rounded-lg px-2.5 py-0.5 text-xs font-bold ${
                              collab.status === "ACTIVE"
                                ? "bg-brand-mint text-brand-green"
                                : "bg-brand-cream text-brand-muted ring-1 ring-brand-line"
                            }`}
                          >
                            {collab.status === "ACTIVE" ? "Aktif" : "Menunggu daftar"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {collab.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => resend(collab.id)}
                            disabled={isResendingThis}
                            className={`${actionButton} border-brand-line bg-white hover:bg-brand-mint`}
                          >
                            {isResendingThis ? (
                              <IconLoader2 size={16} className="animate-spin" aria-hidden="true" />
                            ) : (
                              <IconMail size={16} aria-hidden="true" />
                            )}
                            {isResendingThis ? "Mengirim…" : "Kirim ulang email"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openEdit(collab)}
                          className={`${actionButton} border-brand-line bg-white hover:bg-brand-mint`}
                        >
                          <IconEdit size={16} aria-hidden="true" />
                          Ubah role
                          <span className="sr-only">{collab.email}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openDelete(collab)}
                          className={`${actionButton} border-brand-pink-deep bg-brand-pink text-brand-rose hover:bg-brand-pink-deep`}
                        >
                          <IconTrash size={16} aria-hidden="true" />
                          Hapus
                          <span className="sr-only">{collab.email}</span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="flex items-start gap-2 text-sm text-brand-muted">
                <IconInfoCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                &ldquo;Menunggu daftar&rdquo; berarti email itu belum punya akun Kekawinan.com.
                Aksesnya aktif otomatis setelah mereka mendaftar.
              </p>
            </>
          )}
        </section>
      </div>

      {/* ── Dialog: Invite ───────────────────────────────────────────────────── */}
      <Dialog open={isInviteOpen} onOpenChange={(open) => { setIsInviteOpen(open); if (!open) { setInviteEmail(""); setInviteRole("MEMBER"); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Undang kolaborator</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
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
                  <SelectItem value="OWNER">
                    <div>
                      <div className="font-medium">Owner</div>
                      <div className="text-xs text-muted-foreground">Akses penuh seperti pemilik undangan</div>
                    </div>
                  </SelectItem>
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
              className="bg-brand-green hover:bg-brand-green-dark"
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
                <SelectItem value="OWNER">Owner</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="CREW">Crew</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
            <Button className="bg-brand-green hover:bg-brand-green-dark" onClick={() => updateRole()} disabled={isUpdatingRole}>
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
