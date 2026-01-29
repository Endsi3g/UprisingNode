"use client";

import { cn } from "@/lib/utils";

interface MetricDisplayProps {
  value: string;
  currency?: string;
  label?: string;
  size?: "default" | "large" | "hero";
  className?: string;
  align?: "left" | "center" | "right";
}

/**
 * MetricDisplay - Uprising Node style large metric display
 *
 * Used for prominent financial figures like "$4,250.00" with
 * elegant serif typography and optional currency prefix.
 */
export function MetricDisplay({
  value,
  currency = "$",
  label,
  size = "default",
  className,
  align = "left",
}: MetricDisplayProps) {
  const sizes = {
    default: {
      value: "text-3xl md:text-4xl",
      currency: "text-2xl md:text-3xl",
    },
    large: {
      value: "text-4xl md:text-5xl",
      currency: "text-3xl md:text-4xl",
    },
    hero: {
      value: "text-5xl md:text-6xl",
      currency: "text-4xl md:text-5xl",
    },
  };

  const alignments = {
    left: "text-left justify-start",
    center: "text-center justify-center",
    right: "text-right justify-end",
  };

  return (
    <div className={cn("space-y-2", alignments[align], className)}>
      {label && (
        <span className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </span>
      )}
      <div className={cn("flex items-center gap-2", alignments[align])}>
        {currency && (
          <span
            className={cn(
              "font-serif text-gray-300 group-focus-within:text-black transition-colors",
              sizes[size].currency,
            )}
          >
            {currency}
          </span>
        )}
        <span className={cn("font-serif text-black", sizes[size].value)}>
          {value}
        </span>
      </div>
    </div>
  );
}
