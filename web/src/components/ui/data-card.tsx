import * as React from "react";
import { cn } from "@/lib/utils";

interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}

export function DataCard({
  className,
  title,
  value,
  trend,
  trendUp,
  ...props
}: DataCardProps) {
  return (
    <div
      className={cn(
        "p-6 border border-gray-100 hover:border-black transition-colors cursor-pointer bg-white",
        className,
      )}
      {...props}
    >
      <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
        {title}
      </p>
      <p className="text-3xl font-serif text-black mb-2">{value}</p>
      {trend && (
        <p
          className={cn(
            "text-xs flex items-center gap-1",
            trendUp ? "text-green-600" : "text-gray-500",
          )}
        >
          {trendUp && (
            <span className="material-symbols-outlined text-[10px]">
              arrow_upward
            </span>
          )}
          {trend}
        </p>
      )}
    </div>
  );
}
