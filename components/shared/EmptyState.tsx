import React from "react";
import Link from "next/link";
import { Film } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "No Titles Found",
  description = "We couldn't find any matching titles in our catalog.",
  actionText = "Explore Catalog",
  actionHref = "/anime",
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 max-w-md mx-auto my-8">
      <div className="w-14 h-14 rounded-full bg-[#181818] flex items-center justify-center text-[#A3A3A3] mb-4">
        {icon || <Film className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">
        {title}
      </h3>
      <p className="text-xs text-[#A3A3A3] leading-relaxed mb-6">
        {description}
      </p>
      {onAction ? (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium text-xs transition"
        >
          {actionText}
        </button>
      ) : actionHref ? (
        <Link
          href={actionHref}
          className="px-5 py-2.5 rounded-md bg-[#181818] hover:bg-[#262626] border border-white/10 text-white font-medium text-xs transition"
        >
          {actionText}
        </Link>
      ) : null}
    </div>
  );
}

export { EmptyState };
