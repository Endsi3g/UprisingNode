"use client";

import { cn } from "@/lib/utils";

interface DataCardProps {
    label: string;
    value: string;
    sublabel?: string;
    icon?: React.ReactNode;
    trend?: {
        value: string;
        direction: "up" | "down" | "neutral";
    };
    className?: string;
    variant?: "default" | "highlight";
}

/**
 * DataCard - Uprising Node style data display card
 * 
 * Used for displaying metrics like "GAINS ACCUMULÉS" and "GAINS POTENTIELS"
 * with large serif numbers and small uppercase labels.
 */
export function DataCard({
    label,
    value,
    sublabel,
    icon,
    trend,
    className,
    variant = "default",
}: DataCardProps) {
    const trendColors = {
        up: "text-green-600",
        down: "text-red-500",
        neutral: "text-gray-400",
    };

    const trendIcons = {
        up: "↑",
        down: "↓",
        neutral: "→",
    };

    return (
        <div
            className={cn(
                "space-y-3 p-4",
                variant === "highlight" && "bg-accent-gray rounded-sm",
                className
            )}
        >
            {/* Label */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    {label}
                </span>
                {icon && (
                    <span className="text-gray-300">{icon}</span>
                )}
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-serif text-black">
                    {value}
                </span>
                {trend && (
                    <span
                        className={cn(
                            "text-xs font-medium",
                            trendColors[trend.direction]
                        )}
                    >
                        {trendIcons[trend.direction]} {trend.value}
                    </span>
                )}
            </div>

            {/* Sublabel */}
            {sublabel && (
                <p className="text-[10px] text-gray-400 font-light">
                    {sublabel}
                </p>
            )}
        </div>
    );
}
