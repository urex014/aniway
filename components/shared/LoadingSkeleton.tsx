import React from "react";

export function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#18181F]/80 rounded border border-white/5 ${className}`}
    />
  );
}

export function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative aspect-[3/4.2] w-full rounded-xl overflow-hidden bg-[#18181F] border border-white/5 animate-pulse">
        <div className="absolute top-2 right-2 w-12 h-5 bg-white/10 rounded" />
        <div className="absolute bottom-2 left-2 right-2 h-4 bg-white/10 rounded" />
      </div>
      <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse mt-1" />
      <div className="h-3 bg-white/5 rounded w-1/2 animate-pulse" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[750px] bg-[#111116] overflow-hidden flex items-end pb-16 px-6 md:px-12 border-b border-white/5">
      <div className="max-w-2xl w-full space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-white/10 rounded-full" />
        <div className="h-12 w-3/4 bg-white/15 rounded-lg" />
        <div className="h-4 w-1/3 bg-white/10 rounded" />
        <div className="h-16 w-full bg-white/5 rounded-lg" />
        <div className="flex gap-4 pt-2">
          <div className="h-12 w-36 bg-[#7C3AED]/40 rounded-xl" />
          <div className="h-12 w-36 bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function EpisodeListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-[#111116] border border-white/5 animate-pulse space-y-3"
        >
          <div className="flex justify-between items-center">
            <div className="h-5 w-16 bg-white/10 rounded" />
            <div className="h-4 w-12 bg-white/5 rounded" />
          </div>
          <div className="h-4 w-4/5 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}

export function AnimeRowSkeleton({ title }: { title?: string }) {
  return (
    <div className="space-y-4 my-8 px-4 md:px-10">
      {title && <div className="h-6 w-48 bg-white/10 rounded animate-pulse" />}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <AnimeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
