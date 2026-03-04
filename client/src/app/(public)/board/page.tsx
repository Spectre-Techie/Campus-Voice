import type { Metadata } from "next";
import { BoardContent } from "./_components/board-content";

export const metadata: Metadata = {
  title: "Feedback Board",
  description: "Browse and upvote campus feedback submissions.",
};

export default function BoardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Feedback Board
        </h1>
        <p className="mt-2 max-w-xl text-base text-muted-foreground">
          Browse all campus feedback. Filter by category, search issues, and
          upvote what matters to you.
        </p>
      </div>

      <BoardContent />
    </div>
  );
}
