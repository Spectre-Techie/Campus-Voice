"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CATEGORIES, CATEGORY_CONFIG, type Category } from "@/lib/constants";
import { submitFeedback } from "@/lib/api";
import { ConfirmationView } from "@/app/(public)/submit/_components/confirmation-view";
import { ImageUpload } from "@/components/image-upload";
import { Loader2 } from "lucide-react";

// ─── Validation Schema ──────────────────────────────────
const feedbackSchema = z.object({
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Please select a category" }),
  }),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(120, "Title must be under 120 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(3000, "Description must be under 3000 characters"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormData = z.infer<typeof feedbackSchema>;
type FieldErrors = Partial<Record<keyof FormData, string>>;

export function SubmitForm() {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  // If successfully submitted, show confirmation
  if (trackingId) {
    return (
      <ConfirmationView
        trackingId={trackingId}
        onSubmitAnother={() => {
          setTrackingId(null);
          setCategory(null);
          setTitle("");
          setDescription("");
          setImageUrl("");
        }}
      />
    );
  }

  const validate = (): FormData | null => {
    const result = feedbackSchema.safeParse({
      category,
      title: title.trim(),
      description: description.trim(),
      image_url: imageUrl.trim() || undefined,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return null;
    }

    setErrors({});
    return result.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = validate();
    if (!data) return;

    setSubmitting(true);
    try {
      const result = await submitFeedback({
        category: data.category,
        title: data.title,
        description: data.description,
        image_url: data.image_url || undefined,
      });
      setTrackingId(result.tracking_id);
      toast.success("Feedback submitted successfully!");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message || "Failed to submit. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Step 1: Category Selection */}
      <div>
        <Label className="mb-1 block text-base font-semibold">
          1. Select a Category
        </Label>
        <p className="mb-4 text-sm text-muted-foreground">
          Choose the category that best describes your feedback.
        </p>
        {errors.category && (
          <p className="mb-3 text-sm text-destructive">{errors.category}</p>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const Icon = config.icon;
            const isSelected = category === cat;

            return (
              <button
                type="button"
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setErrors((prev) => ({ ...prev, category: undefined }));
                }}
                className={cn(
                  "flex flex-col items-center gap-2.5 rounded-xl border-2 p-5 transition-all duration-200 hover:shadow-md",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                    : "border-transparent bg-muted/40 hover:border-border"
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl transition-transform",
                    isSelected && "scale-110",
                    config.bgColor
                  )}
                >
                  <Icon className={cn("h-5 w-5", config.color)} />
                </div>
                <span className="text-sm font-medium">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Title */}
      <div>
        <Label htmlFor="title" className="mb-1 block text-base font-semibold">
          2. Title
        </Label>
        <p className="mb-3 text-sm text-muted-foreground">
          A brief summary of the issue.
        </p>
        <Input
          id="title"
          placeholder="e.g., Broken AC in Library Building A, Room 302"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title)
              setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          className={cn("h-12 rounded-xl", errors.title && "border-destructive")}
          maxLength={120}
        />
        <div className="mt-1.5 flex justify-between">
          {errors.title ? (
            <p className="text-sm text-destructive">{errors.title}</p>
          ) : (
            <span />
          )}
          <span className="text-xs tabular-nums text-muted-foreground">
            {title.length}/120
          </span>
        </div>
      </div>

      {/* Step 3: Description */}
      <div>
        <Label
          htmlFor="description"
          className="mb-1 block text-base font-semibold"
        >
          3. Description
        </Label>
        <p className="mb-3 text-sm text-muted-foreground">
          Describe the issue in detail. What happened? Where? When?
        </p>
        <Textarea
          id="description"
          placeholder="Provide specific details about the issue. The more context you give, the faster it can be addressed."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description)
              setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          className={cn("min-h-[160px] rounded-xl", errors.description && "border-destructive")}
          maxLength={3000}
        />
        <div className="mt-1.5 flex justify-between">
          {errors.description ? (
            <p className="text-sm text-destructive">{errors.description}</p>
          ) : (
            <span />
          )}
          <span className="text-xs tabular-nums text-muted-foreground">
            {description.length}/3000
          </span>
        </div>
      </div>

      {/* Step 4: Image (optional) */}
      <div>
        <Label className="mb-1 block text-base font-semibold">
          4. Evidence Photo{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <p className="mb-3 text-sm text-muted-foreground">
          Upload a photo showing the issue. EXIF metadata is automatically
          stripped to protect your privacy.
        </p>
        <ImageUpload
          value={imageUrl}
          onChange={(url) => {
            setImageUrl(url);
            if (errors.image_url)
              setErrors((prev) => ({ ...prev, image_url: undefined }));
          }}
          disabled={submitting}
        />
        {errors.image_url && (
          <p className="mt-1 text-sm text-destructive">{errors.image_url}</p>
        )}
      </div>

      {/* Submit */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="text-sm">
            <p className="font-semibold text-foreground">Ready to submit?</p>
            <p className="text-muted-foreground">
              Your submission is completely anonymous. No personal data is stored.
            </p>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="w-full gap-2 rounded-xl shadow-md shadow-primary/20 sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
