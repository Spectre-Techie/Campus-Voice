import type { Metadata } from "next";
import { DetailContent } from "./_components/detail-content";

export const metadata: Metadata = {
  title: "Feedback Detail",
  description: "View the full details and status of a feedback submission.",
};

export default function FeedbackDetailPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <DetailContent />
    </div>
  );
}
