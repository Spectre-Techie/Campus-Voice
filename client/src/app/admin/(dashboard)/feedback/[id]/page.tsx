"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  MessageSquare,
  Send,
  ImageIcon,
  CalendarIcon,
  Building2,
  Flag,
  FlagOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/image-upload";
import {
  adminGetFeedback,
  adminUpdateStatus,
  adminAssignDepartment,
  adminToggleSpam,
  adminAddResponse,
  type AdminFeedbackDetail,
} from "@/lib/admin-api";
import { useAuth } from "@/hooks/use-auth";
import {
  STATUS_CONFIG,
  CATEGORY_CONFIG,
  STATUSES,
  CATEGORIES,
  type Category,
} from "@/lib/constants";
import { toast } from "sonner";

export default function FeedbackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { admin } = useAuth();
  const isViewer = admin?.role === "viewer";
  const isSuperAdmin = admin?.role === "super_admin";

  const [feedback, setFeedback] = useState<AdminFeedbackDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Status change modal
  const [statusOpen, setStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);

  // Department assign
  const [assignDept, setAssignDept] = useState("");
  const [assignSaving, setAssignSaving] = useState(false);

  // Response form
  const [responseText, setResponseText] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [expectedResolution, setExpectedResolution] = useState("");
  const [responseStatusChange, setResponseStatusChange] = useState("");
  const [responseSaving, setResponseSaving] = useState(false);

  async function loadFeedback() {
    try {
      const data = await adminGetFeedback(id);
      setFeedback(data);
      setAssignDept(data.assigned_department ?? "");
    } catch {
      toast.error("Failed to load feedback details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeedback();
  }, [id]);

  async function handleStatusChange() {
    if (!newStatus || !statusComment.trim()) return;
    setStatusSaving(true);
    try {
      const updated = await adminUpdateStatus(id, {
        status: newStatus,
        comment: statusComment,
      });
      setFeedback(updated);
      setStatusOpen(false);
      setNewStatus("");
      setStatusComment("");
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleAssignDepartment() {
    if (!assignDept) return;
    setAssignSaving(true);
    try {
      const updated = await adminAssignDepartment(id, assignDept);
      setFeedback(updated);
      toast.success("Department assigned");
    } catch {
      toast.error("Failed to assign department");
    } finally {
      setAssignSaving(false);
    }
  }

  async function handleToggleSpam() {
    if (!feedback) return;
    try {
      const updated = await adminToggleSpam(id, !feedback.is_spam);
      setFeedback(updated);
      toast.success(
        feedback.is_spam ? "Unflagged as spam" : "Flagged as spam"
      );
    } catch {
      toast.error("Failed to update spam flag");
    }
  }

  async function handleSubmitResponse() {
    if (isViewer) {
      toast.info(
        "Viewers have read-only access. Only department admins and super admins can submit responses."
      );
      return;
    }
    if (!responseText.trim() || responseText.trim().length < 20) {
      toast.error("Response must be at least 20 characters");
      return;
    }
    setResponseSaving(true);
    try {
      const data: Parameters<typeof adminAddResponse>[1] = {
        response_text: responseText.trim(),
      };
      if (proofUrl.trim()) data.proof_image_url = proofUrl.trim();
      if (expectedResolution)
        data.expected_resolution = new Date(expectedResolution).toISOString();
      if (responseStatusChange && responseStatusChange !== "keep")
        data.status_changed_to = responseStatusChange;

      await adminAddResponse(id, data);
      setResponseText("");
      setProofUrl("");
      setExpectedResolution("");
      setResponseStatusChange("");
      toast.success("Response submitted");
      loadFeedback();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message || "Failed to submit response";
      toast.error(msg);
    } finally {
      setResponseSaving(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-24 rounded-xl" />
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-7 w-1/2" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-40 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Feedback not found</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const catConfig = CATEGORY_CONFIG[feedback.category as Category];
  const statusConfig =
    STATUS_CONFIG[feedback.status as keyof typeof STATUS_CONFIG];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2"
            onClick={() => router.push("/admin/feedback")}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Feedback
          </Button>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            {feedback.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono">{feedback.tracking_id}</span>
            <span>·</span>
            <span>{formatDate(feedback.created_at)}</span>
            {feedback.is_spam && (
              <Badge variant="destructive" className="text-[10px]">
                SPAM
              </Badge>
            )}
          </div>
        </div>

        {/* Quick actions */}
        {!isViewer && (
          <div className="flex gap-2">
            <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
              <DialogTrigger asChild>
                <Button size="sm">Change Status</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Status</DialogTitle>
                  <DialogDescription>
                    Change the status and add a mandatory comment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>New Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.filter((s) => s !== feedback.status).map(
                          (s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_CONFIG[s].label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Comment (required)</Label>
                    <Textarea
                      placeholder="Explain why you're changing the status..."
                      value={statusComment}
                      onChange={(e) => setStatusComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setStatusOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleStatusChange}
                    disabled={
                      !newStatus || !statusComment.trim() || statusSaving
                    }
                  >
                    {statusSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Update Status
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleSpam}
            >
              {feedback.is_spam ? (
                <>
                  <FlagOff className="mr-1 h-4 w-4" /> Unflag
                </>
              ) : (
                <>
                  <Flag className="mr-1 h-4 w-4" /> Flag Spam
                </>
              )}
            </Button>
          </div>
        )}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {feedback.description}
                </p>
                {feedback.image_url && (
                  <div className="mt-4">
                    <img
                      src={feedback.image_url}
                      alt="Feedback attachment"
                      className="max-h-64 rounded-lg border object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Response Form */}
          {!isViewer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Send className="h-4 w-4" /> Add Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Response Text (min 20 chars)</Label>
                    <Textarea
                      placeholder="Write your official response to this feedback..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5" /> Proof Image
                        (optional)
                      </Label>
                      <ImageUpload
                        value={proofUrl}
                        onChange={setProofUrl}
                        disabled={responseSaving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5" /> Expected
                        Resolution (optional)
                      </Label>
                      <Input
                        type="datetime-local"
                        value={expectedResolution}
                        onChange={(e) =>
                          setExpectedResolution(e.target.value)
                        }
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Also change status to (optional)</Label>
                    <Select
                      value={responseStatusChange}
                      onValueChange={setResponseStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Keep current status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="keep">
                          Keep current status
                        </SelectItem>
                        {STATUSES.filter((s) => s !== feedback.status).map(
                          (s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_CONFIG[s].label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSubmitResponse}
                    disabled={
                      responseSaving || responseText.trim().length < 20
                    }
                    className="w-full sm:w-auto"
                  >
                    {responseSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Submit Response
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Responses Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4" /> Responses (
                  {feedback.responses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feedback.responses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No responses yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {feedback.responses.map((resp) => (
                      <div key={resp.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {resp.admin_name}
                              </p>
                              {resp.admin_department && (
                                <p className="text-[11px] text-muted-foreground">
                                  {resp.admin_department}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(resp.created_at)}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {resp.response_text}
                        </p>
                        {(resp.status_changed_to ||
                          resp.proof_image_url ||
                          resp.expected_resolution) && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {resp.status_changed_to && (
                              <Badge variant="secondary" className="text-xs">
                                Status →{" "}
                                {STATUS_CONFIG[
                                  resp.status_changed_to as keyof typeof STATUS_CONFIG
                                ]?.label ?? resp.status_changed_to}
                              </Badge>
                            )}
                            {resp.expected_resolution && (
                              <Badge variant="outline" className="text-xs">
                                <CalendarIcon className="mr-1 h-3 w-3" />
                                Expected:{" "}
                                {new Date(
                                  resp.expected_resolution
                                ).toLocaleDateString()}
                              </Badge>
                            )}
                            {resp.proof_image_url && (
                              <div className="mt-2 w-full">
                                <img
                                  src={resp.proof_image_url}
                                  alt="Proof image"
                                  className="max-h-48 rounded-lg border object-cover"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Meta Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <Card>
              <CardContent className="p-5 space-y-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </span>
                  {statusConfig && (
                    <div className="mt-1 flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${statusConfig.dotColor}`}
                      />
                      <span className="font-semibold">
                        {statusConfig.label}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Category
                  </span>
                  {catConfig && (
                    <div className="mt-1 flex items-center gap-2">
                      <catConfig.icon
                        className={`h-4 w-4 ${catConfig.color}`}
                      />
                      <span className="font-medium">{catConfig.label}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Upvotes
                  </span>
                  <p className="mt-1 text-lg font-bold tabular-nums">
                    {feedback.upvote_count}
                  </p>
                </div>

                <Separator />

                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Assigned Department
                  </span>
                  <p className="mt-1 text-sm font-medium">
                    {feedback.assigned_department ?? "Not assigned"}
                  </p>
                </div>

                {feedback.resolved_at && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Resolved At
                      </span>
                      <p className="mt-1 text-sm">
                        {formatDate(feedback.resolved_at)}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Department Assign (super_admin only) */}
          {isSuperAdmin && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4" /> Assign Department
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select
                    value={assignDept}
                    onValueChange={setAssignDept}
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
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={handleAssignDepartment}
                    disabled={
                      assignSaving ||
                      !assignDept ||
                      assignDept === feedback.assigned_department
                    }
                  >
                    {assignSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Building2 className="mr-2 h-4 w-4" />
                    )}
                    Assign
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Status History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" /> Status History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feedback.status_history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No status changes yet.
                  </p>
                ) : (
                  <div className="relative space-y-3 pl-6">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
                    {feedback.status_history.map((entry, i) => {
                      const sc =
                        STATUS_CONFIG[
                          entry.status as keyof typeof STATUS_CONFIG
                        ];
                      return (
                        <div key={i} className="relative">
                          <div
                            className={`absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-background ${sc?.dotColor ?? "bg-gray-400"}`}
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {sc?.label ?? entry.status}
                            </p>
                            {entry.comment && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {entry.comment}
                              </p>
                            )}
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {formatDate(entry.changed_at)}
                              {entry.changed_by && ` · ${entry.changed_by}`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
