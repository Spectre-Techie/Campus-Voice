"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Users,
  Shield,
  ShieldCheck,
  Eye,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  adminListUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  type AdminProfile,
} from "@/lib/admin-api";
import { useAuth } from "@/hooks/use-auth";
import { CATEGORIES, CATEGORY_CONFIG } from "@/lib/constants";
import { toast } from "sonner";

const ROLES = [
  { value: "super_admin", label: "Super Admin", icon: ShieldCheck },
  { value: "department_admin", label: "Dept. Admin", icon: Shield },
  { value: "viewer", label: "Viewer", icon: Eye },
];

export default function UserManagementPage() {
  const { admin: currentAdmin } = useAuth();
  const [users, setUsers] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Create/Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminProfile | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    display_name: "",
    password: "",
    role: "viewer" as string,
    department: "" as string,
  });
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<AdminProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await adminListUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function openCreateModal() {
    setEditingUser(null);
    setFormData({
      username: "",
      display_name: "",
      password: "",
      role: "viewer",
      department: "",
    });
    setFormErrors({});
    setModalOpen(true);
  }

  function openEditModal(user: AdminProfile) {
    setEditingUser(user);
    setFormData({
      username: user.username,
      display_name: user.display_name,
      password: "",
      role: user.role,
      department: user.department ?? "",
    });
    setFormErrors({});
    setModalOpen(true);
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!editingUser) {
      if (!formData.username.trim() || formData.username.length < 3) {
        errors.username = "Username must be at least 3 characters";
      }
      if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username = "Username must be alphanumeric with underscores only";
      }
      if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/.test(formData.password)) {
        errors.password = "Must include upper, lower, number, and special char";
      }
    } else {
      if (formData.password && formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      if (formData.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/.test(formData.password)) {
        errors.password = "Must include upper, lower, number, and special char";
      }
    }
    if (!formData.display_name.trim() || formData.display_name.length < 2) {
      errors.display_name = "Display name must be at least 2 characters";
    }
    if (formData.role === "department_admin" && !formData.department) {
      errors.department = "Department is required for department admins";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;
    setSaving(true);
    try {
      if (editingUser) {
        const updateData: Record<string, string | boolean> = {};
        if (formData.display_name !== editingUser.display_name) {
          updateData.display_name = formData.display_name;
        }
        if (formData.role !== editingUser.role) {
          updateData.role = formData.role;
        }
        if (formData.department !== (editingUser.department ?? "")) {
          updateData.department = formData.department;
        }
        if (formData.password) {
          updateData.password = formData.password;
        }
        if (Object.keys(updateData).length === 0) {
          toast.info("No changes detected");
          setModalOpen(false);
          return;
        }
        await adminUpdateUser(editingUser.id, updateData);
        toast.success("User updated successfully");
      } else {
        const createData: {
          username: string;
          display_name: string;
          password: string;
          role: string;
          department?: string;
        } = {
          username: formData.username,
          display_name: formData.display_name,
          password: formData.password,
          role: formData.role,
        };
        if (formData.department) {
          createData.department = formData.department;
        }
        await adminCreateUser(createData);
        toast.success("User created successfully");
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
      const msg = axiosErr.response?.data?.error?.message;
      toast.error(msg || "Failed to save user");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteUser(deleteTarget.id);
      toast.success("User deactivated successfully");
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
      toast.error(axiosErr.response?.data?.error?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getRoleConfig(role: string) {
    return ROLES.find((r) => r.value === role) ?? ROLES[2];
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-start justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            User Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage admin accounts and permissions.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </motion.div>

      {/* Users Table (desktop) + Cards (mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
            <Users className="h-8 w-8" />
            <p>No users found</p>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="space-y-3 md:hidden">
              {users.map((user) => {
                const roleConfig = getRoleConfig(user.role);
                const initials = user.display_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                const isSelf = user.id === currentAdmin?.id;

                return (
                  <div
                    key={user.id}
                    className="rounded-xl border bg-card p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback
                          className={`text-xs font-semibold ${user.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {user.display_name}
                          {isSelf && (
                            <span className="ml-1.5 text-xs text-primary">(you)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditModal(user)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {!isSelf && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteTarget(user)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs gap-1">
                        <roleConfig.icon className="h-3 w-3" />
                        {roleConfig.label}
                      </Badge>
                      {user.department && (
                        <Badge variant="outline" className="text-xs">
                          {CATEGORY_CONFIG[user.department as keyof typeof CATEGORY_CONFIG]?.label ?? user.department}
                        </Badge>
                      )}
                      {user.is_active ? (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-0 text-[10px]"
                        >
                          <UserCheck className="mr-1 h-3 w-3" /> Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-0 text-[10px]"
                        >
                          <UserX className="mr-1 h-3 w-3" /> Inactive
                        </Badge>
                      )}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {formatDate(user.last_login_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block rounded-xl border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>User</TableHead>
                    <TableHead className="w-[120px]">Role</TableHead>
                    <TableHead className="w-[120px]">Department</TableHead>
                    <TableHead className="w-[80px] text-center">Status</TableHead>
                    <TableHead className="w-[100px]">Last Login</TableHead>
                    <TableHead className="w-[80px] text-center">Actions</TableHead>
                    <TableHead className="w-[80px] text-right">Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const roleConfig = getRoleConfig(user.role);
                    const initials = user.display_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);
                    const isSelf = user.id === currentAdmin?.id;

                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback
                                className={`text-xs font-semibold ${user.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                              >
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {user.display_name}
                                {isSelf && (
                                  <span className="ml-1.5 text-xs text-primary">
                                    (you)
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="text-xs gap-1"
                          >
                            <roleConfig.icon className="h-3 w-3" />
                            {roleConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {user.department
                            ? CATEGORY_CONFIG[user.department as keyof typeof CATEGORY_CONFIG]?.label ??
                              user.department
                            : "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          {user.is_active ? (
                            <Badge
                              variant="secondary"
                              className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-0 text-[10px]"
                            >
                              <UserCheck className="mr-1 h-3 w-3" /> Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-0 text-[10px]"
                            >
                              <UserX className="mr-1 h-3 w-3" /> Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(user.last_login_at)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditModal(user)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            {!isSelf && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => setDeleteTarget(user)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-xs text-muted-foreground">
                          {user.action_count ?? 0} actions
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </motion.div>

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Create New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update admin account details."
                : "Create a new admin account with the appropriate role."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {!editingUser && (
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  placeholder="e.g. john_doe"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
                {formErrors.username && (
                  <p className="text-xs text-destructive">
                    {formErrors.username}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input
                placeholder="e.g. John Doe"
                value={formData.display_name}
                onChange={(e) =>
                  setFormData({ ...formData, display_name: e.target.value })
                }
              />
              {formErrors.display_name && (
                <p className="text-xs text-destructive">
                  {formErrors.display_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                {editingUser ? "New Password (leave blank to keep)" : "Password"}
              </Label>
              <Input
                type="password"
                placeholder={editingUser ? "Leave blank to keep current" : "Min 8 chars, mixed case + special"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {formErrors.password && (
                <p className="text-xs text-destructive">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(v) =>
                  setFormData({ ...formData, role: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.role === "department_admin" && (
              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(v) =>
                    setFormData({ ...formData, department: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_CONFIG[cat].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.department && (
                  <p className="text-xs text-destructive">
                    {formErrors.department}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {editingUser ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate{" "}
              <span className="font-semibold">
                {deleteTarget?.display_name}
              </span>
              ? They will no longer be able to log in. This action can be
              reversed by reactivating the account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
