import type { Metadata } from "next";
import { SubmitForm } from "./_components/submit-form";

export const metadata: Metadata = {
  title: "Submit Feedback",
  description: "Submit anonymous feedback about your campus. No login required.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Submit Anonymous Feedback
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Your identity is never recorded. Choose a category, describe the
          issue, and get a tracking ID to follow progress.
        </p>
      </div>

      <SubmitForm />
    </div>
  );
}
