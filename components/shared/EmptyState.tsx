import React from "react";
import Link from "next/link";
import { Film, RefreshCw, Compass } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No Content Located in Memory Banks",
  description = "No signals match the specified parameters in this sector.",
  actionText = "Explore Catalog",
  actionHref = "/anime",
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-14 rounded-2xl bg-[#111116]/80 border border-white/5 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-[#18181F] border border-white/10 flex items-center justify-center text-[#C084FC] mb-5 shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)]">
        {icon || <Film className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold font-mono tracking-wide text-[#F5F5F5] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6 max-w-sm">
        {description}
      </p>
      {onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium text-sm transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          {actionText}
        </button>
      ) : actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#18181F] hover:bg-[#22D3EE]/20 hover:border-[#22D3EE]/40 border border-white/10 text-white font-medium text-sm transition-all duration-200"
        >
          <Compass className="w-4 h-4 text-[#22D3EE]" />
          {actionText}
        </Link>
      ) : null}
    </div>
  );
}
