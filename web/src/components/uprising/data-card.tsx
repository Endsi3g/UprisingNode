"use client";

import { cn } from "@/lib/utils";

interface DataCardProps {
    label?: string;
    title?: string;
    value: string;
    sublabel?: string;
    icon?: React.ReactNode;
    trend?: string | {
        value: string;
        direction: "up" | "down" | "neutral";
    };
    trendDirection?: "up" | "down" | "neutral";
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
    title,
    value,
    sublabel,
    icon,
    trend,
    trendDirection,
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

    let displayTrendValue: string | undefined;
    let displayTrendDir: "up" | "down" | "neutral" = "neutral";

    if (typeof trend === 'string') {
        displayTrendValue = trend;
        displayTrendDir = trendDirection || "neutral";
    } else if (trend) {
        displayTrendValue = trend.value;
        displayTrendDir = trend.direction;
    }

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
                    {label || title}
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
                {displayTrendValue && (
                    <span
                        className={cn(
                            "text-xs font-medium",
                            trendColors[displayTrendDir]
                        )}
                    >
                        {trendIcons[displayTrendDir]} {displayTrendValue}
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
