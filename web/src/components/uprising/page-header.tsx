"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: "success" | "warning" | "default";
  };
  className?: string;
  centered?: boolean;
}

/**
 * PageHeader - Uprising Node style page header
 * 
 * Features the elegant serif title with uppercase tracking subtitle
 * and optional status badge, matching the source design aesthetic.
 */
export function PageHeader({
  title,
  subtitle,
  badge,
  className,
  centered = false,
}: PageHeaderProps) {
  const badgeColors = {
    success: "bg-green-500/10 text-green-600",
    warning: "bg-amber-500/10 text-amber-600",
    default: "bg-gray-100 text-gray-500",
  };

  return (
    <div
      className={cn(
        "space-y-4",
        centered && "text-center",
        className
      )}
    >
      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-serif font-normal text-black tracking-tight">
        {title}
      </h1>

      {/* Subtitle with optional divider */}
      {subtitle && (
        <>
          {centered && <div className="w-16 h-px bg-black/10 mx-auto" />}
          <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.25em]">
            {subtitle}
          </p>
        </>
      )}

      {/* Status Badge */}
      {badge && (
        <div className="flex items-center gap-2">
          {badge.variant === "success" && (
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
          )}
          <span
            className={cn(
              "text-[10px] font-medium uppercase tracking-widest",
              badgeColors[badge.variant || "default"]
            )}
          >
            {badge.text}
          </span>
        </div>
      )}
    </div>
  );
}
