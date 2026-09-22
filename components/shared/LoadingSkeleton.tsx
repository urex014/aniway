import React from "react";

export function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#181818] rounded-md ${className}`}
    />
  );
}

export function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative aspect-[2/3] w-full rounded-md bg-[#181818] animate-pulse" />
      <div className="h-4 bg-[#181818] rounded w-3/4 animate-pulse mt-1" />
      <div className="h-3 bg-[#181818]/60 rounded w-1/2 animate-pulse" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[80vh] min-h-[500px] bg-[#111111] overflow-hidden flex items-end pb-16 px-6 md:px-12">
      <div className="max-w-xl w-full space-y-4 animate-pulse">
        <div className="h-4 w-24 bg-[#181818] rounded" />
        <div className="h-10 w-3/4 bg-[#181818] rounded" />
        <div className="h-14 w-full bg-[#181818] rounded" />
        <div className="flex gap-4 pt-2">
          <div className="h-11 w-32 bg-[#8B5CF6]/40 rounded-md" />
          <div className="h-11 w-32 bg-[#181818] rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function AnimeRowSkeleton({ title }: { title?: string }) {
  return (
    <div className="space-y-3 my-8 px-4 md:px-8 max-w-7xl mx-auto">
      {title && <div className="h-5 w-40 bg-[#181818] rounded animate-pulse" />}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <AnimeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
